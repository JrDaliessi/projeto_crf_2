import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiUsers, FiCalendar, FiCreditCard, FiTrendingUp, FiBarChart2, FiRefreshCw } from 'react-icons/fi';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

// Componentes estilizados
const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatsCard = styled(Card)`
  height: 100%;
`;

const StatsHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const IconContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background-color: ${props => `rgba(var(--${props.color}-rgb), 0.1)`};
  color: ${props => `var(--color-${props.color})`};
  margin-right: 1rem;
`;

const StatsValueContainer = styled.div`
  flex: 1;
`;

const StatsTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-light);
  margin: 0;
`;

const StatsValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
`;

const StatsChange = styled.div<{ positive: boolean }>`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: ${props => props.positive ? 'var(--color-success)' : 'var(--color-error)'};
  margin-top: 0.25rem;
  
  svg {
    margin-right: 0.25rem;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const ChartCard = styled(Card)`
  min-height: 300px;
`;

const ChartPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 230px;
  background-color: var(--color-background);
  border-radius: 0.5rem;
  color: var(--color-text-light);
  border: 1px dashed var(--color-border);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
`;

const LastUpdate = styled.div`
  font-size: 0.75rem;
  color: var(--color-text-light);
  margin-top: 0.5rem;
`;

const ActivityListContainer = styled.div`
  margin-top: 1rem;
`;

const ActivityItem = styled.div`
  display: flex;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div<{ bg: string }>`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: ${props => props.bg};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-weight: 500;
  color: var(--color-text);
`;

const ActivityTime = styled.div`
  font-size: 0.75rem;
  color: var(--color-text-light);
  margin-top: 0.25rem;
`;

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  
  // Dados simulados para o dashboard
  const statsData = [
    { 
      id: 1, 
      title: 'Usuários Ativos', 
      value: '245', 
      change: '+12.5%', 
      positive: true, 
      icon: <FiUsers size={20} />,
      color: 'primary'
    },
    { 
      id: 2, 
      title: 'Reservas Hoje', 
      value: '15', 
      change: '+5.2%', 
      positive: true, 
      icon: <FiCalendar size={20} />,
      color: 'secondary'
    },
    { 
      id: 3, 
      title: 'Transações', 
      value: 'R$ 8.540', 
      change: '-2.3%', 
      positive: false, 
      icon: <FiCreditCard size={20} />,
      color: 'warning'
    },
    { 
      id: 4, 
      title: 'Crescimento', 
      value: '12.5%', 
      change: '+8.4%', 
      positive: true, 
      icon: <FiTrendingUp size={20} />,
      color: 'success'
    }
  ];
  
  const recentActivities = [
    {
      id: 1,
      title: 'João Silva fez uma reserva no Salão de Festas',
      time: 'Há 35 minutos',
      icon: <FiCalendar size={16} />,
      bg: 'var(--color-primary)'
    },
    {
      id: 2,
      title: 'Maria Santos registrou entrada na portaria',
      time: 'Há 1 hora',
      icon: <FiUsers size={16} />,
      bg: 'var(--color-success)'
    },
    {
      id: 3,
      title: 'Pedro Oliveira fez um pagamento de R$ 150,00',
      time: 'Há 2 horas',
      icon: <FiCreditCard size={16} />,
      bg: 'var(--color-warning)'
    },
    {
      id: 4,
      title: 'Ana Pereira atualizou seus dados cadastrais',
      time: 'Há 4 horas',
      icon: <FiUsers size={16} />,
      bg: 'var(--color-info)'
    }
  ];
  
  const refreshData = () => {
    setIsLoading(true);
    // Simular carregamento de dados
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsLoading(false);
    }, 1000);
  };
  
  useEffect(() => {
    refreshData();
  }, []);
  
  return (
    <Layout>
      <CardHeader>
        <div>
          <CardTitle>Visão Geral</CardTitle>
          <LastUpdate>
            Última atualização: {lastUpdate.toLocaleString()}
          </LastUpdate>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          leftIcon={<FiRefreshCw />}
          onClick={refreshData}
          isLoading={isLoading}
        >
          Atualizar
        </Button>
      </CardHeader>
      
      <DashboardGrid>
        {statsData.map(stat => (
          <StatsCard key={stat.id}>
            <StatsHeader>
              <IconContainer color={stat.color}>
                {stat.icon}
              </IconContainer>
              <StatsValueContainer>
                <StatsTitle>{stat.title}</StatsTitle>
                <StatsValue>{stat.value}</StatsValue>
                <StatsChange positive={stat.positive}>
                  {stat.positive ? <FiTrendingUp size={14} /> : <FiTrendingUp size={14} style={{ transform: 'rotate(180deg)' }} />}
                  {stat.change}
                </StatsChange>
              </StatsValueContainer>
            </StatsHeader>
          </StatsCard>
        ))}
      </DashboardGrid>
      
      <ChartsGrid>
        <ChartCard title="Análise de Atividade" subtitle="Últimos 30 dias">
          <ChartPlaceholder>
            <FiBarChart2 size={48} />
          </ChartPlaceholder>
        </ChartCard>
        
        <Card title="Atividades Recentes">
          <ActivityListContainer>
            {recentActivities.map(activity => (
              <ActivityItem key={activity.id}>
                <ActivityIcon bg={activity.bg}>
                  {activity.icon}
                </ActivityIcon>
                <ActivityContent>
                  <ActivityTitle>{activity.title}</ActivityTitle>
                  <ActivityTime>{activity.time}</ActivityTime>
                </ActivityContent>
              </ActivityItem>
            ))}
          </ActivityListContainer>
        </Card>
      </ChartsGrid>
    </Layout>
  );
};

export default Dashboard; 