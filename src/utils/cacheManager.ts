/**
 * Utilitário para gerenciar cache específico por perfil de usuário
 * Este módulo define políticas de cache para diferentes tipos de dados e perfis
 */

type UserRole = 'ADMIN' | 'FUNCIONARIO' | 'ASSOCIADO' | 'ANONIMO';

interface CachePolicy {
  // Duração do cache em milissegundos
  maxAge: number;
  // Se o cache deve ser válido em modo offline mesmo expirado
  validOffline: boolean;
  // Perfis de usuário que podem acessar este cache
  allowedRoles: UserRole[];
}

interface CachePolicies {
  [key: string]: CachePolicy;
}

// Definição das políticas de cache por tipo de dado e perfil
const CACHE_POLICIES: CachePolicies = {
  // Dados do usuário - armazenados por 1 hora apenas, mas válidos offline
  'user_profile': {
    maxAge: 60 * 60 * 1000, // 1 hora
    validOffline: true,
    allowedRoles: ['ADMIN', 'FUNCIONARIO', 'ASSOCIADO']
  },
  
  // Saldo do usuário - armazenado por 30 minutos
  'user_balance': {
    maxAge: 30 * 60 * 1000, // 30 minutos
    validOffline: true,
    allowedRoles: ['ASSOCIADO', 'ADMIN']
  },
  
  // Reservas do usuário - armazenado por 1 hora
  'user_reservations': {
    maxAge: 60 * 60 * 1000, // 1 hora
    validOffline: true,
    allowedRoles: ['ASSOCIADO', 'ADMIN', 'FUNCIONARIO']
  },
  
  // Disponibilidade para reservas - armazenado por 15 minutos
  'reservation_availability': {
    maxAge: 15 * 60 * 1000, // 15 minutos
    validOffline: false, // Não deve ser usado offline para evitar conflitos
    allowedRoles: ['ASSOCIADO', 'ADMIN', 'FUNCIONARIO']
  },
  
  // Dados financeiros do Bar - armazenado por 15 minutos apenas para Funcionários/Admin
  'bar_financial': {
    maxAge: 15 * 60 * 1000, // 15 minutos
    validOffline: false,
    allowedRoles: ['FUNCIONARIO', 'ADMIN']
  },
  
  // Relatórios - armazenados por 2 horas apenas para Admin
  'reports': {
    maxAge: 2 * 60 * 60 * 1000, // 2 horas
    validOffline: true,
    allowedRoles: ['ADMIN']
  },
  
  // Configurações do app - armazenadas por 24 horas para todos
  'app_settings': {
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    validOffline: true,
    allowedRoles: ['ADMIN', 'FUNCIONARIO', 'ASSOCIADO', 'ANONIMO']
  }
};

/**
 * Verifica se um tipo de cache é permitido para um determinado perfil
 * @param cacheType O tipo de cache a ser verificado
 * @param userRole O perfil do usuário
 */
export const isCacheAllowed = (cacheType: string, userRole: UserRole): boolean => {
  const policy = CACHE_POLICIES[cacheType];
  
  if (!policy) {
    console.warn(`Política de cache não encontrada para o tipo: ${cacheType}`);
    return false;
  }
  
  return policy.allowedRoles.includes(userRole);
};

/**
 * Obtém a duração máxima do cache para um tipo específico
 * @param cacheType O tipo de cache
 */
export const getCacheMaxAge = (cacheType: string): number => {
  const policy = CACHE_POLICIES[cacheType];
  
  if (!policy) {
    console.warn(`Política de cache não encontrada para o tipo: ${cacheType}`);
    return 0; // Sem cache
  }
  
  return policy.maxAge;
};

/**
 * Verifica se um cache específico deve ser válido offline mesmo expirado
 * @param cacheType O tipo de cache
 */
export const isValidOffline = (cacheType: string): boolean => {
  const policy = CACHE_POLICIES[cacheType];
  
  if (!policy) {
    console.warn(`Política de cache não encontrada para o tipo: ${cacheType}`);
    return false;
  }
  
  return policy.validOffline;
};

/**
 * Obtém a política completa de cache para um tipo específico
 * @param cacheType O tipo de cache
 */
export const getCachePolicy = (cacheType: string): CachePolicy | null => {
  const policy = CACHE_POLICIES[cacheType];
  
  if (!policy) {
    console.warn(`Política de cache não encontrada para o tipo: ${cacheType}`);
    return null;
  }
  
  return { ...policy };
};

/**
 * Gera uma chave de cache específica para o usuário atual e tipo de dados
 * @param cacheType O tipo de cache
 * @param userId ID do usuário (opcional)
 */
export const generateCacheKey = (cacheType: string, userId?: string): string => {
  const userPart = userId ? `_${userId}` : '';
  return `crf_${cacheType}${userPart}`;
};

/**
 * Limpa o cache de um tipo específico
 * @param cacheType O tipo de cache a ser limpo
 * @param userId ID do usuário específico (opcional)
 */
export const clearCache = (cacheType: string, userId?: string): void => {
  const key = generateCacheKey(cacheType, userId);
  localStorage.removeItem(key);
  localStorage.removeItem(`${key}_timestamp`);
};

/**
 * Limpa todos os caches de um usuário específico
 * @param userId ID do usuário
 */
export const clearUserCache = (userId: string): void => {
  Object.keys(CACHE_POLICIES).forEach(cacheType => {
    clearCache(cacheType, userId);
  });
};

export default {
  isCacheAllowed,
  getCacheMaxAge,
  isValidOffline,
  getCachePolicy,
  generateCacheKey,
  clearCache,
  clearUserCache
}; 