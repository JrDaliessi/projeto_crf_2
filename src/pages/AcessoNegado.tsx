import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AcessoNegado: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md">
        <div className="mb-6 flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <h1 className="mb-4 text-2xl font-bold text-gray-800">Acesso Negado</h1>
        
        <p className="mb-6 text-gray-600">
          Você não tem permissão para acessar esta página. Esta área é restrita para usuários com perfil específico.
        </p>
        
        {user && (
          <p className="mb-6 text-sm text-gray-500">
            Seu perfil atual: <span className="font-semibold">{user.roles.role_name}</span>
          </p>
        )}
        
        <div className="flex flex-col space-y-2">
          <Link
            to="/"
            className="rounded-md bg-blue-600 py-2 px-4 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Voltar para a página inicial
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Voltar para a página anterior
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcessoNegado; 