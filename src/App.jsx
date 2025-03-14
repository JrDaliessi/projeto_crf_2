import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';

// Páginas de exemplo
const Home = () => <div>Página Inicial</div>;
const Admin = () => <div>Área Administrativa</div>;
const ProfilePage = () => <div>Perfil do Usuário</div>;

// Componente para proteger rotas
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isLoading, user, isAdmin, isEmployee, isAssociate } = useAuth();
  
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
  
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Admin />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App; 