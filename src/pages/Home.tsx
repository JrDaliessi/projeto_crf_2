import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user, isAdmin, isEmployee, isAssociate } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">Bem-vindo ao Clube CRF</h1>
        <p className="text-lg text-gray-700">Olá, {user?.name || 'Visitante'}!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Acesso Rápido</h2>
          <div className="flex flex-col space-y-3">
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-center transition">
              Fazer Login
            </Link>
            <Link to="/style-demo" className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md text-center transition">
              Demonstração de Estilos
            </Link>
            <Link to="/virtual-lists" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-center transition">
              Listas Virtualizadas
            </Link>
          </div>
        </div>
        
        {user && isAdmin && isAdmin() && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Área Administrativa</h2>
            <p className="text-gray-600 mb-4">Acesse as funcionalidades administrativas do clube.</p>
            <div className="flex flex-col space-y-3">
              <Link to="/admin" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-center transition">
                Painel Administrativo
              </Link>
            </div>
          </div>
        )}
        
        {user && isEmployee && isEmployee() && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Área de Funcionários</h2>
            <p className="text-gray-600 mb-4">Acesse as funcionalidades para funcionários do clube.</p>
            <div className="flex flex-col space-y-3">
              <Link to="/bar" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-center transition">
                Módulo Bar
              </Link>
              <Link to="/portaria" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-center transition">
                Módulo Portaria
              </Link>
            </div>
          </div>
        )}
        
        {user && isAssociate && isAssociate() && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Área do Associado</h2>
            <p className="text-gray-600 mb-4">Acesse as funcionalidades exclusivas para associados.</p>
            <div className="flex flex-col space-y-3">
              <Link to="/reservas/churrasqueira" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-center transition">
                Reservar Churrasqueira
              </Link>
              <Link to="/reservas/eventos" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-center transition">
                Reservar Eventos
              </Link>
              <Link to="/conta/saldo" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-center transition">
                Gerenciar Saldo
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Informações do Clube</h2>
        <div className="space-y-2 text-gray-700">
          <p className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Horário de funcionamento: Segunda a Domingo, das 8h às 22h
          </p>
          <p className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Endereço: Av. Principal, 1000 - Bairro Central
          </p>
          <p className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Telefone: (11) 1234-5678
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home; 