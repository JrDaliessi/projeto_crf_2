import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Importar estilos de teste em vez dos estilos globais com Tailwind
import './styles/test.css';
// Importar TailwindCSS
import './index.css';

// Importar contextos
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { ReservationProvider } from './contexts/ReservationContext';
import { BarProvider } from './contexts/BarContext';
import { ReportProvider } from './contexts/ReportContext';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AuthProvider>
        <UserProvider>
          <ReservationProvider>
            <BarProvider>
              <ReportProvider>
                <App />
              </ReportProvider>
            </BarProvider>
          </ReservationProvider>
        </UserProvider>
      </AuthProvider>
    </React.StrictMode>
  );
} else {
  console.error('Elemento root não encontrado no DOM');
} 