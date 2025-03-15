import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from './theme';

// Páginas
import TestPage from './pages/TestPage';
import StyleDemo from './pages/StyleDemo';
import SimpleStyleDemo from './pages/SimpleStyleDemo';
import Login from './pages/Login';
import AcessoNegado from './pages/AcessoNegado';
import Admin from './pages/Admin';
import Home from './pages/Home';
import VirtualListDemo from './pages/VirtualListDemo';
import Dashboard from './pages/Dashboard';
import ExemploOffline from './pages/ExemploOffline';

// Componentes
import { ProtectedRoute } from './components/ProtectedRoute';
// Componentes PWA temporariamente desativados
// import OfflineIndicator from './components/OfflineIndicator';
// import UpdatePrompt from './components/UpdatePrompt';

// Registrar o service worker (apenas na produção)
const registerServiceWorker = () => {
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // O plugin vite-plugin-pwa gerencia o registro do SW
      console.log('Service Worker gerenciado pelo vite-plugin-pwa');
    });
  }
};

// Temporariamente desativado
// registerServiceWorker();

const App: React.FC = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        {/* Componentes PWA desativados temporariamente */}
        {/* <OfflineIndicator /> */}
        {/* <UpdatePrompt /> */}
        
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/acesso-negado" element={<AcessoNegado />} />
          <Route path="/" element={<Home />} />
          <Route path="/virtual-lists" element={<VirtualListDemo />} />
          <Route path="/offline-exemplo" element={<ExemploOffline />} />
          
          {/* Rotas protegidas para qualquer usuário autenticado */}
          <Route element={<ProtectedRoute />}>
            <Route path="/test" element={<TestPage />} />
            <Route path="/style-demo" element={<StyleDemo />} />
            <Route path="/simple-demo" element={<SimpleStyleDemo />} />
          </Route>
          
          {/* Rotas protegidas para Administradores */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/*" element={<Admin />} />
          </Route>
          
          {/* Rotas protegidas para Funcionários e Administradores */}
          <Route element={<ProtectedRoute allowedRoles={['FUNCIONARIO', 'ADMIN']} />}>
            <Route path="/bar/*" element={<div>Módulo do Bar</div>} />
            <Route path="/portaria/*" element={<div>Módulo da Portaria</div>} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          
          {/* Rotas protegidas para Associados */}
          <Route element={<ProtectedRoute allowedRoles={['ASSOCIADO', 'ADMIN']} />}>
            <Route path="/reservas/*" element={<div>Módulo de Reservas</div>} />
            <Route path="/perfil/*" element={<div>Perfil do Usuário</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App; 