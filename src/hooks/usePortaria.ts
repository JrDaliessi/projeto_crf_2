import { useState, useCallback } from 'react';
import { 
  validateAccess, 
  registerExit, 
  getAccessLogs, 
  getCurrentlyInClub 
} from '../services/portariaService';

// Hook para gerenciar operações da portaria
export function usePortaria() {
  const [accessResult, setAccessResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const [currentUsers, setCurrentUsers] = useState<any[]>([]);
  const [isLoadingCurrentUsers, setIsLoadingCurrentUsers] = useState<boolean>(false);
  const [currentUsersError, setCurrentUsersError] = useState<string | null>(null);
  
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(false);
  const [logsError, setLogsError] = useState<string | null>(null);
  
  // Validar acesso de um usuário
  const handleValidateAccess = useCallback(async (userId: string) => {
    setIsValidating(true);
    setValidationError(null);
    
    try {
      const result = await validateAccess(userId);
      setAccessResult(result);
      return result;
    } catch (error: any) {
      setValidationError(error.message);
      console.error('Erro ao validar acesso:', error);
      return { canAccess: false, reason: error.message };
    } finally {
      setIsValidating(false);
    }
  }, []);
  
  // Registrar saída de um usuário
  const handleRegisterExit = useCallback(async (userId: string) => {
    try {
      const success = await registerExit(userId);
      
      // Atualizar lista de pessoas no clube se bem-sucedido
      if (success) {
        await fetchCurrentlyInClub();
      }
      
      return success;
    } catch (error: any) {
      console.error('Erro ao registrar saída:', error);
      return false;
    }
  }, []);
  
  // Buscar pessoas que estão atualmente no clube
  const fetchCurrentlyInClub = useCallback(async () => {
    setIsLoadingCurrentUsers(true);
    setCurrentUsersError(null);
    
    try {
      const users = await getCurrentlyInClub();
      setCurrentUsers(users);
    } catch (error: any) {
      setCurrentUsersError(error.message);
      console.error('Erro ao buscar pessoas no clube:', error);
    } finally {
      setIsLoadingCurrentUsers(false);
    }
  }, []);
  
  // Buscar logs de acesso
  const fetchAccessLogs = useCallback(async (
    startDate?: string, 
    endDate?: string, 
    userId?: string,
    limit: number = 100
  ) => {
    setIsLoadingLogs(true);
    setLogsError(null);
    
    try {
      const logs = await getAccessLogs(startDate, endDate, userId, limit);
      setLogs(logs);
    } catch (error: any) {
      setLogsError(error.message);
      console.error('Erro ao buscar logs de acesso:', error);
    } finally {
      setIsLoadingLogs(false);
    }
  }, []);
  
  return {
    // Validação de acesso
    accessResult,
    isValidating,
    validationError,
    handleValidateAccess,
    
    // Registro de saída
    handleRegisterExit,
    
    // Pessoas no clube
    currentUsers,
    isLoadingCurrentUsers,
    currentUsersError,
    fetchCurrentlyInClub,
    
    // Logs de acesso
    logs,
    isLoadingLogs,
    logsError,
    fetchAccessLogs
  };
} 