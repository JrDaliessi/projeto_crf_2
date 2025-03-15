import { useState, useEffect } from 'react';
import cacheManager from '../utils/cacheManager';

// Tipos de dados
type UserRole = 'ADMIN' | 'FUNCIONARIO' | 'ASSOCIADO' | 'ANONIMO';

interface CacheOptions {
  // Tipo do cache conforme definido no cacheManager
  cacheType: string;
  // ID do usuário (opcional)
  userId?: string;
  // Perfil do usuário atual
  userRole: UserRole;
}

/**
 * Hook para gerenciar dados que precisam ser acessíveis offline
 * Integrado com as políticas de cache para diferentes perfis de usuário
 * 
 * @param fetcher Função para buscar dados online
 * @param options Opções de cache (tipo, usuário e perfil)
 */
function useOfflineData<T>(
  fetcher: () => Promise<T>,
  options: CacheOptions
): {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isOffline: boolean;
  lastUpdated: string | null;
  isStale: boolean;
} {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isStale, setIsStale] = useState<boolean>(false);

  const { cacheType, userId, userRole } = options;

  // Verificar se o cache é permitido para este perfil
  const cacheAllowed = cacheManager.isCacheAllowed(cacheType, userRole);
  
  // Gerar a chave do cache
  const cacheKey = cacheManager.generateCacheKey(cacheType, userId);
  
  // Obter a política de cache
  const cachePolicy = cacheManager.getCachePolicy(cacheType);
  
  // Tempo de expiração conforme a política (ou 0 se não permitido)
  const expirationTime = cacheAllowed && cachePolicy ? cachePolicy.maxAge : 0;
  
  // Se é válido em modo offline mesmo expirado
  const validOffline = cacheAllowed && cachePolicy ? cachePolicy.validOffline : false;

  // Atualizar estado online/offline
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  // Carregar dados (online ou do cache)
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setIsStale(false);

        // Se o cache não for permitido para este perfil, buscar dados online apenas
        if (!cacheAllowed) {
          if (navigator.onLine) {
            await fetchFreshData();
          } else {
            throw new Error(`Acesso offline não permitido para o perfil ${userRole} no recurso ${cacheType}`);
          }
          return;
        }

        // Verificar se há dados em cache e se não estão expirados
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
        
        if (cachedData && cachedTimestamp) {
          const parsedData = JSON.parse(cachedData);
          const timestamp = parseInt(cachedTimestamp, 10);
          const now = Date.now();
          
          // Definir quando os dados foram atualizados pela última vez
          setLastUpdated(new Date(timestamp).toLocaleString());

          // Verificar se os dados estão "velhos" (stale)
          const isDataStale = now - timestamp > expirationTime;
          setIsStale(isDataStale);

          // Se os dados não estiverem expirados ou estivermos offline e o cache for válido offline,
          // usar os dados em cache
          if (!isDataStale || (isOffline && validOffline)) {
            setData(parsedData);
            setIsLoading(false);
            
            // Se estiver online e os dados estiverem "velhos", buscar dados atualizados em segundo plano
            if (navigator.onLine && isDataStale) {
              fetchFreshData();
            }
            return;
          }
        }

        // Se não houver cache ou estiver expirado, buscar dados frescos (se online)
        if (navigator.onLine) {
          await fetchFreshData();
        } else if (cachedData && validOffline) {
          // Se estiver offline e o cache for válido offline, usar dados em cache mesmo expirados
          setData(JSON.parse(cachedData));
          setIsStale(true);
          setIsLoading(false);
        } else {
          // Se estiver offline e não houver cache válido, definir erro
          throw new Error('Você está offline e não há dados em cache disponíveis');
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido ao carregar dados'));
        setIsLoading(false);
      }
    };

    async function fetchFreshData() {
      try {
        const freshData = await fetcher();
        
        // Atualizar dados em memória
        setData(freshData);
        setIsStale(false);
        
        // Salvar no cache local (se permitido)
        if (cacheAllowed) {
          localStorage.setItem(cacheKey, JSON.stringify(freshData));
          const now = Date.now();
          localStorage.setItem(`${cacheKey}_timestamp`, now.toString());
          setLastUpdated(new Date(now).toLocaleString());
        }
      } catch (err) {
        console.error('Erro ao buscar dados frescos:', err);
        // Se falhar ao buscar dados frescos, não definir um erro se tivermos dados em cache
        if (!data) {
          setError(err instanceof Error ? err : new Error('Erro ao buscar dados'));
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [cacheKey, expirationTime, fetcher, isOffline, cacheAllowed, userRole, cacheType, validOffline]);

  return { data, isLoading, error, isOffline, lastUpdated, isStale };
}

export default useOfflineData; 