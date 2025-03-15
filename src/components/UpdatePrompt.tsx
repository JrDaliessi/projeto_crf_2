import React, { useState, useEffect } from 'react';

/**
 * Componente para informar ao usuário que há uma nova versão do aplicativo disponível
 * Utilizado em conjunto com o vite-plugin-pwa para gerenciar atualizações do PWA
 */
const UpdatePrompt: React.FC = () => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  useEffect(() => {
    // Verificar se o evento personalizado de atualização está disponível
    // Este evento é disparado pelo vite-plugin-pwa quando uma nova versão é detectada
    if ('serviceWorker' in navigator) {
      window.addEventListener('sw-update-available', () => {
        setShowUpdatePrompt(true);
      });
    }
  }, []);

  // Função para atualizar o aplicativo
  const updateApp = () => {
    // Em produção, o navegador atualiza automaticamente ao recarregar a página
    // após uma nova versão ter sido detectada
    window.location.reload();
  };

  // Se não há atualização disponível, não renderizar nada
  if (!showUpdatePrompt) return null;

  return (
    <div className="fixed bottom-20 right-4 bg-white shadow-lg rounded-lg p-4 max-w-sm z-50 border border-blue-100">
      <div className="flex items-start">
        <div className="flex-shrink-0 text-blue-500">
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <h3 className="text-sm font-medium text-gray-900">Nova versão disponível</h3>
          <p className="mt-1 text-sm text-gray-500">
            Uma nova versão do aplicativo está disponível. Atualize para obter as últimas melhorias e correções.
          </p>
          <div className="mt-3 flex space-x-2">
            <button
              type="button"
              onClick={updateApp}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Atualizar agora
            </button>
            <button
              type="button"
              onClick={() => setShowUpdatePrompt(false)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Mais tarde
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePrompt; 