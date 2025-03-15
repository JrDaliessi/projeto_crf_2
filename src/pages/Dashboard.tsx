import React from 'react';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  DoughnutChart 
} from '../components/charts';
import { useReportData } from '../contexts/ReportContext';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { 
    monthlySales, 
    expenseCategories, 
    weeklyAccess, 
    reservationsByArea,
    totalUsers,
    activeUsers,
    totalRevenue,
    pendingPayments,
    isLoadingStats
  } = useReportData();
  
  const { user } = useAuth();
  
  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Cards de estatísticas
  const StatCard = ({ title, value, icon }: { title: string, value: string | number, icon?: React.ReactNode }) => (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <p className="text-xl font-bold">{value}</p>
        </div>
        {icon && <div className="text-blue-500 text-2xl">{icon}</div>}
      </div>
    </div>
  );
  
  if (!user || !(user.roles.role_name === 'ADMIN' || user.roles.role_name === 'FUNCIONARIO')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Acesso Negado</h1>
          <p>Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Usuários Cadastrados" 
          value={isLoadingStats ? 'Carregando...' : totalUsers.toString()} 
        />
        <StatCard 
          title="Usuários Ativos (30 dias)" 
          value={isLoadingStats ? 'Carregando...' : activeUsers.toString()} 
        />
        <StatCard 
          title="Receita (30 dias)" 
          value={isLoadingStats ? 'Carregando...' : formatCurrency(totalRevenue)} 
        />
        <StatCard 
          title="Pagamentos Pendentes" 
          value={isLoadingStats ? 'Carregando...' : formatCurrency(pendingPayments)} 
        />
      </div>
      
      {/* Gráficos em grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vendas Mensais */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Vendas Mensais</h2>
          <div className="h-64">
            {monthlySales.loading ? (
              <div className="h-full flex items-center justify-center">
                <p>Carregando dados...</p>
              </div>
            ) : (
              <BarChart data={monthlySales.data} height={250} />
            )}
          </div>
        </div>
        
        {/* Categorias de Despesas */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Despesas por Categoria</h2>
          <div className="h-64">
            {expenseCategories.loading ? (
              <div className="h-full flex items-center justify-center">
                <p>Carregando dados...</p>
              </div>
            ) : (
              <PieChart data={expenseCategories.data} height={250} />
            )}
          </div>
        </div>
        
        {/* Acessos Semanais */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Acessos por Dia da Semana</h2>
          <div className="h-64">
            {weeklyAccess.loading ? (
              <div className="h-full flex items-center justify-center">
                <p>Carregando dados...</p>
              </div>
            ) : (
              <LineChart data={weeklyAccess.data} height={250} />
            )}
          </div>
        </div>
        
        {/* Reservas por Área */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Reservas por Área</h2>
          <div className="h-64">
            {reservationsByArea.loading ? (
              <div className="h-full flex items-center justify-center">
                <p>Carregando dados...</p>
              </div>
            ) : (
              <DoughnutChart data={reservationsByArea.data} height={250} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 