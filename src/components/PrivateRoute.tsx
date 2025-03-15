import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  // Se estiver carregando, pode mostrar um spinner ou similar
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'var(--color-text)'
      }}>
        Carregando...
      </div>
    );
  }
  
  // Se não estiver autenticado, redirecionar para login
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Se estiver autenticado, renderizar o componente filho
  return <>{children}</>;
};

export default PrivateRoute; 