import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user, isAdmin, isEmployee, isAssociate } = useAuth();

  return (
    <div className="container">
      <div className="user-welcome">
        <h1>Bem-vindo ao Clube CRF</h1>
        <p>Olá, {user?.name || 'Usuário'}!</p>
      </div>
      
      <div className="action-buttons">
        <Link to="/style-demo" className="btn btn-primary">
          Ver Demonstração de Estilos
        </Link>
      </div>
      
      {isAdmin() && (
        <div className="admin-section">
          <h2>Área Administrativa</h2>
          <p>Acesse as funcionalidades administrativas do clube.</p>
          <div className="action-buttons">
            <Link to="/admin" className="btn btn-primary">Painel Administrativo</Link>
          </div>
        </div>
      )}
      
      {isEmployee() && (
        <div className="employee-section">
          <h2>Área de Funcionários</h2>
          <p>Acesse as funcionalidades para funcionários do clube.</p>
          <div className="action-buttons">
            <Link to="/funcionario/bar" className="btn btn-primary">Módulo Bar</Link>
            <Link to="/funcionario/portaria" className="btn btn-primary">Módulo Portaria</Link>
          </div>
        </div>
      )}
      
      {isAssociate() && (
        <div className="associate-section">
          <h2>Área do Associado</h2>
          <p>Acesse as funcionalidades exclusivas para associados.</p>
          <div className="action-buttons">
            <Link to="/reservas/churrasqueira" className="btn btn-primary">Reservar Churrasqueira</Link>
            <Link to="/reservas/eventos" className="btn btn-primary">Reservar Eventos</Link>
            <Link to="/conta/saldo" className="btn btn-primary">Gerenciar Saldo</Link>
          </div>
        </div>
      )}
      
      <div className="club-info">
        <h2>Informações do Clube</h2>
        <p>Horário de funcionamento: Segunda a Domingo, das 8h às 22h</p>
        <p>Endereço: Av. Principal, 1000 - Bairro Central</p>
        <p>Telefone: (11) 1234-5678</p>
      </div>
    </div>
  );
};

export default Home; 