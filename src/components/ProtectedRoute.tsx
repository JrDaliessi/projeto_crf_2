import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: ('ADMIN' | 'FUNCIONARIO' | 'ASSOCIADO')[];
  redirectPath?: string;
}

/**
 * Componente para proteger rotas baseado em autenticação e perfis
 * @param allowedRoles Array de perfis permitidos para acessar a rota
 * @param redirectPath Caminho para redirecionar caso não tenha permissão
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectPath = '/login',
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Aguardar carregamento da autenticação
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // Se não estiver autenticado, redirecionar para login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Se não houver restrição de perfil, permitir acesso
  if (!allowedRoles || allowedRoles.length === 0) {
    return <Outlet />;
  }

  // Verificar se o usuário tem um dos perfis permitidos
  const hasAllowedRole = user?.roles?.role_name && allowedRoles.includes(user.roles.role_name as any);

  if (!hasAllowedRole) {
    // Redirecionar para página de acesso negado ou home
    return <Navigate to="/acesso-negado" replace />;
  }

  // Permitir acesso à rota
  return <Outlet />;
};

/**
 * Componente para verificar se o usuário tem um perfil específico
 */
interface RequireRoleProps {
  role: 'ADMIN' | 'FUNCIONARIO' | 'ASSOCIADO';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RequireRole: React.FC<RequireRoleProps> = ({
  role,
  children,
  fallback = null,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // Verificar se o usuário tem o perfil requerido
  const hasRole = user?.roles?.role_name === role;

  if (hasRole) {
    return <>{children}</>;
  }

  // Retornar fallback ou null se não tiver o perfil
  return <>{fallback}</>;
}; 