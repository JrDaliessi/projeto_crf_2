import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import supabase from '../lib/supabaseClient';
import { 
  useMonthlySalesData,
  useExpenseCategoriesData, 
  useWeeklyAccessData,
  useReservationsByAreaData
} from '../hooks/useChartData';
import { useAuth } from './AuthContext';

interface ReportContextType {
  // Dados financeiros
  monthlySales: {
    data: any;
    loading: boolean;
  };
  expenseCategories: {
    data: any;
    loading: boolean;
  };
  
  // Dados de acesso
  weeklyAccess: {
    data: any;
    loading: boolean;
  };
  
  // Dados de reservas
  reservationsByArea: {
    data: any;
    loading: boolean;
  };

  // Outras estatísticas
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  pendingPayments: number;
  isLoadingStats: boolean;
}

const ReportContext = createContext<ReportContextType>({
  monthlySales: { data: null, loading: true },
  expenseCategories: { data: null, loading: true },
  weeklyAccess: { data: null, loading: true },
  reservationsByArea: { data: null, loading: true },
  totalUsers: 0,
  activeUsers: 0,
  totalRevenue: 0,
  pendingPayments: 0,
  isLoadingStats: true
});

export const ReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Hooks de dados para os gráficos
  const monthlySales = useMonthlySalesData();
  const expenseCategories = useExpenseCategoriesData();
  const weeklyAccess = useWeeklyAccessData();
  const reservationsByArea = useReservationsByAreaData();
  
  // Estatísticas gerais
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  
  const { user } = useAuth();
  
  useEffect(() => {
    // Só busca estatísticas se o usuário estiver autenticado e tiver papel de admin ou funcionário
    if (user && user.roles && (user.roles.role_name === 'ADMIN' || user.roles.role_name === 'FUNCIONARIO')) {
      const fetchStats = async () => {
        setIsLoadingStats(true);
        try {
          // Buscar estatísticas do banco
          // Estes são exemplos e devem ser substituídos por chamadas reais ao Supabase
          
          // Total de usuários
          const { count: userCount, error: userError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });
          
          if (!userError && userCount !== null) {
            setTotalUsers(userCount);
          }
          
          // Usuários ativos (usuários que acessaram o clube no último mês)
          const { count: activeCount, error: activeError } = await supabase
            .from('access_logs')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
          
          if (!activeError && activeCount !== null) {
            setActiveUsers(activeCount);
          }
          
          // Total de receita (último mês)
          const { data: revenueData, error: revenueError } = await supabase
            .from('transactions')
            .select('amount')
            .eq('type', 'credit')
            .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
          
          if (!revenueError && revenueData) {
            const total = revenueData.reduce((sum, item) => sum + (item.amount || 0), 0);
            setTotalRevenue(total);
          }
          
          // Pagamentos pendentes
          const { data: pendingData, error: pendingError } = await supabase
            .from('invoices')
            .select('amount')
            .eq('status', 'pending');
          
          if (!pendingError && pendingData) {
            const total = pendingData.reduce((sum, item) => sum + (item.amount || 0), 0);
            setPendingPayments(total);
          }
          
        } catch (error) {
          console.error('Erro ao buscar estatísticas:', error);
        } finally {
          setIsLoadingStats(false);
        }
      };
      
      fetchStats();
    }
  }, [user]);
  
  return (
    <ReportContext.Provider value={{
      monthlySales,
      expenseCategories,
      weeklyAccess,
      reservationsByArea,
      totalUsers,
      activeUsers,
      totalRevenue,
      pendingPayments,
      isLoadingStats
    }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReportData = () => useContext(ReportContext);

export default ReportContext; 