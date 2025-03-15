import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import PrivateRoute from './components/PrivateRoute';
import UserForm from './pages/UserForm';

// Outras páginas que podem ser mantidas
import AcessoNegado from './pages/AcessoNegado';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota pública */}
          <Route path="/login" element={<Login />} />
          
          {/* Rotas protegidas */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/usuarios" 
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/usuarios/novo" 
            element={
              <PrivateRoute>
                <UserForm />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/usuarios/:id/editar" 
            element={
              <PrivateRoute>
                <UserForm />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/acesso-negado" 
            element={<AcessoNegado />} 
          />
          
          {/* Rota padrão redireciona para o dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Rota para capturar qualquer caminho não definido */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App; 