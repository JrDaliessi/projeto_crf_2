import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from './theme';

// Importar estilos CSS
import './index.css';
import './styles/global.css';

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
      <ThemeProvider theme={defaultTheme}>
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
      </ThemeProvider>
    </React.StrictMode>
  );
} else {
  console.error('Elemento root não encontrado no DOM');
} 