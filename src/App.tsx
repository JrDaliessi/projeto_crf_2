import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { defaultTheme } from './theme';
import Login from './components/Login';
import Home from './pages/Home';
import StyleDemo from './pages/StyleDemo';

// Interface para a rota protegida
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'FUNCIONARIO' | 'ASSOCIADO';
}

// Componente para proteger rotas
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, isLoading, isAdmin, isEmployee, isAssociate } = useAuth();
  
  if (isLoading) {
    return <div>Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Verificar se o usuário tem o papel necessário, se especificado
  if (requiredRole) {
    if (
      (requiredRole === 'ADMIN' && !isAdmin()) ||
      (requiredRole === 'FUNCIONARIO' && !isEmployee()) ||
      (requiredRole === 'ASSOCIADO' && !isAssociate())
    ) {
      return <Navigate to="/" />;
    }
  }
  
  return <>{children}</>;
};

// Componentes das páginas (Placeholder)
const AdminPage: React.FC = () => <div>Área Administrativa</div>;
const BarPage: React.FC = () => <div>Módulo Bar</div>;
const PortariaPage: React.FC = () => <div>Módulo Portaria</div>;
const ChurrasqueiraPage: React.FC = () => <div>Reservas de Churrasqueira</div>;
const EventosPage: React.FC = () => <div>Reservas de Eventos</div>;
const SaldoPage: React.FC = () => <div>Gerenciamento de Saldo</div>;
const PerfilPage: React.FC = () => <div>Perfil do Usuário</div>;

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={defaultTheme}>
        <BrowserRouter>
          <Routes>
            {/* Rota pública */}
            <Route path="/login" element={<Login />} />
            
            {/* Rotas protegidas */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas de administrador */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas de funcionário */}
            <Route 
              path="/funcionario/bar" 
              element={
                <ProtectedRoute requiredRole="FUNCIONARIO">
                  <BarPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/funcionario/portaria" 
              element={
                <ProtectedRoute requiredRole="FUNCIONARIO">
                  <PortariaPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas de associado */}
            <Route 
              path="/reservas/churrasqueira" 
              element={
                <ProtectedRoute requiredRole="ASSOCIADO">
                  <ChurrasqueiraPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/reservas/eventos" 
              element={
                <ProtectedRoute requiredRole="ASSOCIADO">
                  <EventosPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/conta/saldo" 
              element={
                <ProtectedRoute requiredRole="ASSOCIADO">
                  <SaldoPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/perfil" 
              element={
                <ProtectedRoute>
                  <PerfilPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/style-demo" 
              element={
                <ProtectedRoute>
                  <StyleDemo />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App; 