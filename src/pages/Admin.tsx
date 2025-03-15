import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { getAllUsers } from '../services/userService';
import UserList from '../components/UserList';
import TransactionList from '../components/TransactionList';
import AccessLogList from '../components/AccessLogList';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';

// Interface para os dados de transação
interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  created_at: string;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'cancelled';
}

// Interface para os logs de acesso
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

// Tipos de dados mock para demonstração
const mockTransactions: Transaction[] = Array.from({ length: 1000 }, (_, i) => ({
  id: `trans-${i}`,
  user_id: `user-${Math.floor(Math.random() * 20)}`,
  amount: Math.random() * 1000 - 500,
  description: `Transação ${i + 1}`,
  created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  type: Math.random() > 0.5 ? 'credit' : 'debit',
  status: ['completed', 'pending', 'cancelled'][Math.floor(Math.random() * 3)] as 'completed' | 'pending' | 'cancelled',
}));

const mockAccessLogs: AccessLog[] = Array.from({ length: 1000 }, (_, i) => ({
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

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedLog, setSelectedLog] = useState<AccessLog | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    // Implementar lógica de exibição de detalhes do usuário
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    // Implementar lógica de exibição de detalhes da transação
  };

  const handleLogClick = (log: AccessLog) => {
    setSelectedLog(log);
    // Implementar lógica de exibição de detalhes do log
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>
      <p className="mb-4">Bem-vindo, {user?.name}! Gerencie o sistema a partir deste painel.</p>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-4">
          <Tab
            className={({ selected }: { selected: boolean }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Usuários
          </Tab>
          <Tab
            className={({ selected }: { selected: boolean }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Transações
          </Tab>
          <Tab
            className={({ selected }: { selected: boolean }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Logs de Acesso
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel className="rounded-xl bg-white p-3">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium">Lista de Usuários</h2>
                <p className="text-sm text-gray-500">Total: {users.length} usuários</p>
              </div>
              <div className="p-2">
                {isLoadingUsers ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <UserList
                    users={users}
                    onUserClick={handleUserClick}
                    height={500}
                  />
                )}
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel className="rounded-xl bg-white p-3">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium">Histórico de Transações</h2>
                <p className="text-sm text-gray-500">Total: {mockTransactions.length} transações</p>
              </div>
              <div className="p-2">
                <TransactionList
                  transactions={mockTransactions}
                  onTransactionClick={handleTransactionClick}
                  height={500}
                />
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel className="rounded-xl bg-white p-3">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium">Logs de Acesso</h2>
                <p className="text-sm text-gray-500">Total: {mockAccessLogs.length} registros</p>
              </div>
              <div className="p-2">
                <AccessLogList
                  logs={mockAccessLogs}
                  onLogClick={handleLogClick}
                  height={500}
                />
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Admin; 