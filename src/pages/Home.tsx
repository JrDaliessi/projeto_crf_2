import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user, isAdmin, isEmployee, isAssociate } = useAuth();

  return (
    <div className="container">
      <h1>Bem-vindo ao Clube CRF</h1>
      
      {user && (
        <div className="user-welcome">
          <p>Olá, {user.name || user.email}!</p>
          
          {isAdmin() && (
            <div className="admin-section">
              <h2>Área Administrativa</h2>
              <p>Você tem acesso a todos os recursos administrativos.</p>
              <div className="action-buttons">
                <button onClick={() => window.location.href = '/admin'}>
                  Painel Administrativo
                </button>
              </div>
            </div>
          )}
          
          {isEmployee() && (
            <div className="employee-section">
              <h2>Área de Funcionários</h2>
              <p>Você tem acesso às funcionalidades de funcionário.</p>
              <div className="action-buttons">
                <button onClick={() => window.location.href = '/funcionario/bar'}>
                  Módulo Bar
                </button>
                <button onClick={() => window.location.href = '/funcionario/portaria'}>
                  Módulo Portaria
                </button>
              </div>
            </div>
          )}
          
          {isAssociate() && (
            <div className="associate-section">
              <h2>Área do Associado</h2>
              <p>Bem-vindo à sua área de associado.</p>
              <div className="action-buttons">
                <button onClick={() => window.location.href = '/reservas/churrasqueira'}>
                  Reservar Churrasqueira
                </button>
                <button onClick={() => window.location.href = '/reservas/eventos'}>
                  Participar de Eventos
                </button>
                <button onClick={() => window.location.href = '/conta/saldo'}>
                  Meu Saldo
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="club-info">
        <h2>Sobre o Clube</h2>
        <p>Espaço dedicado para atividades de lazer, recreação e confraternização.</p>
        <p>Aproveite todas as nossas instalações e eventos exclusivos para associados.</p>
      </div>
    </div>
  );
};

export default Home; 