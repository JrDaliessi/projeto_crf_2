import React, { useState } from 'react';
import useOfflineData from '../hooks/useOfflineData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Exemplo de serviço que busca dados
const fetchExampleData = async () => {
  // Simulação de uma chamada de API
  // Na implementação real, isso usaria axios ou fetch para uma API real
  return new Promise<Array<{id: number, nome: string, data: string}>>((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, nome: 'Dado de exemplo 1', data: new Date().toISOString() },
        { id: 2, nome: 'Dado de exemplo 2', data: new Date().toISOString() },
        { id: 3, nome: 'Dado de exemplo 3', data: new Date().toISOString() },
      ]);
    }, 1000);
  });
};

// Tipos de perfil para demonstração
type UserRole = 'ADMIN' | 'FUNCIONARIO' | 'ASSOCIADO' | 'ANONIMO';

const ExemploOffline: React.FC = () => {
  // Estado para mudar o perfil na demonstração
  const [userRole, setUserRole] = useState<UserRole>('ASSOCIADO');
  
  const { 
    data, 
    isLoading, 
    error, 
    isOffline, 
    lastUpdated,
    isStale
  } = useOfflineData(fetchExampleData, { 
    cacheType: 'user_reservations', 
    userRole,
    userId: '123' // Id do usuário de exemplo
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Exemplo de Funcionalidade Offline</h1>
      
      {/* Seletor de perfil para teste */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Simular perfil de usuário:</label>
        <div className="flex gap-2">
          {(['ADMIN', 'FUNCIONARIO', 'ASSOCIADO', 'ANONIMO'] as UserRole[]).map(role => (
            <button
              key={role}
              onClick={() => setUserRole(role)}
              className={`px-3 py-1 rounded text-sm ${
                userRole === role 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Perfil atual: <span className="font-medium">{userRole}</span>
        </p>
      </div>
      
      {/* Indicador de status online/offline */}
      <div className={`p-3 rounded-md mb-6 ${isOffline ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isOffline ? 'bg-red-500' : 'bg-green-500'}`}></div>
          <p className="font-medium">
            {isOffline 
              ? 'Você está offline. Exibindo dados do cache local.' 
              : 'Você está online. Dados sincronizados com o servidor.'}
          </p>
        </div>
        
        {lastUpdated && (
          <p className="text-sm mt-1 flex items-center">
            <span>Última atualização: {lastUpdated}</span>
            {isStale && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                Dados antigos
              </span>
            )}
          </p>
        )}
      </div>

      {/* Conteúdo principal */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Dados de Reservas (Exemplo)</h2>
        
        {isLoading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md">
            <p>Erro ao carregar dados: {error.message}</p>
          </div>
        )}
        
        {data && (
          <div>
            <ul className="divide-y">
              {data.map(item => (
                <li key={item.id} className="py-3">
                  <p className="font-medium">{item.nome}</p>
                  <p className="text-sm text-gray-600">
                    Data: {format(new Date(item.data), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-6">
          <h3 className="font-medium mb-2">Como funciona:</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Os dados são armazenados localmente com políticas de cache específicas por tipo de dado</li>
            <li>Perfis diferentes têm acesso a diferentes tipos de cache (ex: saldo, reservas)</li>
            <li>Quando você está offline, o app exibe os dados mais recentes do cache</li>
            <li>Dados desatualizados são marcados como "Dados antigos"</li>
            <li>Experimente desativar sua conexão de rede e recarregar a página</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-8 bg-blue-50 p-4 rounded-md">
        <h3 className="font-medium text-blue-800 mb-2">Dica para testar o modo offline:</h3>
        <p className="text-sm text-blue-700">
          No Chrome, você pode simular o modo offline abrindo as Ferramentas de Desenvolvedor (F12), 
          indo para a aba "Network" e selecionando "Offline" no dropdown de conexão.
        </p>
      </div>
    </div>
  );
};

export default ExemploOffline; 