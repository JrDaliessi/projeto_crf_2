import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Importar estilos de teste em vez dos estilos globais com Tailwind
import './styles/test.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
} else {
  console.error('Elemento root não encontrado no DOM');
} 