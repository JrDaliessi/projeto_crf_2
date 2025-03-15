import React from 'react';
import { Link } from 'react-router-dom';
import TransactionList from '../components/TransactionList';
import AccessLogList from '../components/AccessLogList';
import ReservationList from '../components/ReservationList';

// Interfaces
interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  created_at: string;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'cancelled';
}

interface AccessLog {
  id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  access_type: 'entrada' | 'saida';
  access_method: 'carteirinha' | 'biometria' | 'facial' | 'manual';
  timestamp: string;
  location: string;
  status: 'success' | 'denied' | 'pending';
  operator_id?: string;
  operator_name?: string;
  notes?: string;
}

interface Reservation {
  id: string;
  user_id: string;
  facility_id: string;
  facility_name: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  status: 'approved' | 'pending' | 'cancelled';
  created_at: string;
  price?: number;
  observations?: string;
}

// Dados de exemplo para transações
const demoTransactions: Transaction[] = Array.from({ length: 1000 }, (_, i) => ({
  id: `trans-${i}`,
  user_id: `user-${Math.floor(Math.random() * 20)}`,
  amount: Math.random() * 1000 - 500,
  description: `Transação ${i + 1}`,
  created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  type: Math.random() > 0.5 ? 'credit' : 'debit',
  status: ['completed', 'pending', 'cancelled'][Math.floor(Math.random() * 3)] as 'completed' | 'pending' | 'cancelled',
}));

// Dados de exemplo para logs de acesso
const demoAccessLogs: AccessLog[] = Array.from({ length: 1000 }, (_, i) => ({
  id: `log-${i}`,
  user_id: `user-${Math.floor(Math.random() * 20)}`,
  user_name: `Usuário ${Math.floor(Math.random() * 20) + 1}`,
  user_email: `user${Math.floor(Math.random() * 20) + 1}@exemplo.com`,
  access_type: Math.random() > 0.5 ? 'entrada' : 'saida',
  access_method: ['carteirinha', 'biometria', 'facial', 'manual'][Math.floor(Math.random() * 4)] as 'carteirinha' | 'biometria' | 'facial' | 'manual',
  timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  location: ['Portaria Principal', 'Entrada Lateral', 'Entrada Piscina', 'Entrada Academia'][Math.floor(Math.random() * 4)],
  status: ['success', 'denied', 'pending'][Math.floor(Math.random() * 3)] as 'success' | 'denied' | 'pending',
  operator_id: Math.random() > 0.7 ? `op-${Math.floor(Math.random() * 5)}` : undefined,
  operator_name: Math.random() > 0.7 ? `Operador ${Math.floor(Math.random() * 5) + 1}` : undefined,
}));

// Dados de exemplo para reservas
const demoReservations: Reservation[] = Array.from({ length: 1000 }, (_, i) => ({
  id: `res-${i}`,
  user_id: `user-${Math.floor(Math.random() * 20)}`,
  facility_id: `fac-${Math.floor(Math.random() * 5)}`,
  facility_name: ['Churrasqueira 1', 'Churrasqueira 2', 'Salão de Festas', 'Quadra', 'Piscina'][Math.floor(Math.random() * 5)],
  reservation_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  start_time: ['08:00', '09:00', '10:00', '14:00', '16:00'][Math.floor(Math.random() * 5)],
  end_time: ['12:00', '13:00', '15:00', '18:00', '22:00'][Math.floor(Math.random() * 5)],
  status: ['approved', 'pending', 'cancelled'][Math.floor(Math.random() * 3)] as 'approved' | 'pending' | 'cancelled',
  created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  price: Math.random() > 0.3 ? Math.floor(Math.random() * 300) + 50 : undefined,
  observations: Math.random() > 0.6 ? `Observação para reserva ${i}` : undefined,
}));

const VirtualListDemo: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">Demonstração de Listas Virtualizadas</h1>
        <p className="text-gray-700 mb-4">
          Esta página demonstra o uso de listas virtualizadas para renderizar grandes volumes de dados
          de forma eficiente.
        </p>
        <div className="flex space-x-4">
          <Link 
            to="/" 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
          >
            Voltar para Home
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 bg-blue-50 border-b">
            <h2 className="text-xl font-bold text-blue-800">Transações</h2>
            <p className="text-sm text-gray-600">Lista com {demoTransactions.length} transações</p>
          </div>
          <div className="h-[500px]">
            <TransactionList 
              transactions={demoTransactions} 
              height="100%"
            />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 bg-blue-50 border-b">
            <h2 className="text-xl font-bold text-blue-800">Logs de Acesso</h2>
            <p className="text-sm text-gray-600">Lista com {demoAccessLogs.length} logs</p>
          </div>
          <div className="h-[500px]">
            <AccessLogList 
              logs={demoAccessLogs} 
              height="100%"
            />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden lg:col-span-2">
          <div className="p-4 bg-blue-50 border-b">
            <h2 className="text-xl font-bold text-blue-800">Reservas</h2>
            <p className="text-sm text-gray-600">Lista com {demoReservations.length} reservas</p>
          </div>
          <div className="h-[500px]">
            <ReservationList 
              reservations={demoReservations} 
              height="100%"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold text-blue-800 mb-4">Como funciona?</h2>
        <p className="text-gray-700 mb-2">
          As listas virtualizadas renderizam apenas os elementos visíveis na janela de visualização, 
          melhorando significativamente a performance quando há muitos itens para exibir.
        </p>
        <p className="text-gray-700 mb-2">
          Isso é especialmente útil em áreas administrativas onde grandes volumes de dados precisam 
          ser apresentados sem comprometer a experiência do usuário.
        </p>
        <ul className="list-disc pl-5 text-gray-700 mb-4 space-y-1">
          <li>Renderização mais rápida de grandes listas</li>
          <li>Menor uso de memória do navegador</li>
          <li>Rolagem suave mesmo com milhares de itens</li>
          <li>Experiência do usuário melhorada</li>
        </ul>
      </div>
    </div>
  );
};

export default VirtualListDemo; 