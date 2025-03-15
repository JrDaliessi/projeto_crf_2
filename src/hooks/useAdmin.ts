import { useState, useCallback } from 'react';
import { 
  generateFinancialReport, 
  generateAccessReport, 
  createUser,
  getDefaulters,
  exportDatabaseBackup,
  updateUserRole
} from '../services/adminService';
import { User } from '../types';

// Hook para gerenciar funções administrativas
export function useAdmin() {
  const [financialReport, setFinancialReport] = useState<any>(null);
  const [isLoadingFinancialReport, setIsLoadingFinancialReport] = useState<boolean>(false);
  const [financialReportError, setFinancialReportError] = useState<string | null>(null);
  
  const [accessReport, setAccessReport] = useState<any>(null);
  const [isLoadingAccessReport, setIsLoadingAccessReport] = useState<boolean>(false);
  const [accessReportError, setAccessReportError] = useState<string | null>(null);
  
  const [defaulters, setDefaulters] = useState<any[]>([]);
  const [isLoadingDefaulters, setIsLoadingDefaulters] = useState<boolean>(false);
  const [defaultersError, setDefaultersError] = useState<string | null>(null);
  
  // Gerar relatório financeiro
  const handleGenerateFinancialReport = useCallback(async (startDate: string, endDate: string) => {
    setIsLoadingFinancialReport(true);
    setFinancialReportError(null);
    
    try {
      const report = await generateFinancialReport(startDate, endDate);
      setFinancialReport(report);
      return report;
    } catch (error: any) {
      setFinancialReportError(error.message);
      console.error('Erro ao gerar relatório financeiro:', error);
      return null;
    } finally {
      setIsLoadingFinancialReport(false);
    }
  }, []);
  
  // Gerar relatório de acesso
  const handleGenerateAccessReport = useCallback(async (startDate: string, endDate: string) => {
    setIsLoadingAccessReport(true);
    setAccessReportError(null);
    
    try {
      const report = await generateAccessReport(startDate, endDate);
      setAccessReport(report);
      return report;
    } catch (error: any) {
      setAccessReportError(error.message);
      console.error('Erro ao gerar relatório de acesso:', error);
      return null;
    } finally {
      setIsLoadingAccessReport(false);
    }
  }, []);
  
  // Criar um novo usuário
  const handleCreateUser = useCallback(async (userData: Partial<User>) => {
    try {
      const result = await createUser(userData);
      return result;
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      return { success: false, error: error.message };
    }
  }, []);
  
  // Buscar usuários inadimplentes
  const fetchDefaulters = useCallback(async () => {
    setIsLoadingDefaulters(true);
    setDefaultersError(null);
    
    try {
      const data = await getDefaulters();
      setDefaulters(data);
      return data;
    } catch (error: any) {
      setDefaultersError(error.message);
      console.error('Erro ao buscar inadimplentes:', error);
      return [];
    } finally {
      setIsLoadingDefaulters(false);
    }
  }, []);
  
  // Exportar backup do banco de dados
  const handleExportBackup = useCallback(async () => {
    try {
      const result = await exportDatabaseBackup();
      return result;
    } catch (error: any) {
      console.error('Erro ao exportar backup:', error);
      return { success: false, error: error.message };
    }
  }, []);
  
  // Atualizar role de um usuário
  const handleUpdateUserRole = useCallback(async (userId: string, roleId: number) => {
    try {
      const success = await updateUserRole(userId, roleId);
      return { success };
    } catch (error: any) {
      console.error('Erro ao atualizar role do usuário:', error);
      return { success: false, error: error.message };
    }
  }, []);
  
  return {
    // Relatório financeiro
    financialReport,
    isLoadingFinancialReport,
    financialReportError,
    handleGenerateFinancialReport,
    
    // Relatório de acesso
    accessReport,
    isLoadingAccessReport,
    accessReportError,
    handleGenerateAccessReport,
    
    // Inadimplentes
    defaulters,
    isLoadingDefaulters,
    defaultersError,
    fetchDefaulters,
    
    // Operações
    handleCreateUser,
    handleExportBackup,
    handleUpdateUserRole
  };
} 