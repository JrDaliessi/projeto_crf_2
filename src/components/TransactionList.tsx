import React from 'react';
import VirtualizedList from './VirtualizedList';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  created_at: string;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'cancelled';
}

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
  className?: string;
  height?: number | string;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onTransactionClick,
  className = '',
  height = 400,
}) => {
  const renderTransaction = (transaction: Transaction, index: number, style: React.CSSProperties) => {
    const formattedDate = format(new Date(transaction.created_at), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
    
    return (
      <div
        key={transaction.id}
        style={style}
        className="flex items-center p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
        onClick={() => onTransactionClick && onTransactionClick(transaction)}
      >
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
          ${transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
        >
          <span className="text-lg font-bold">
            {transaction.type === 'credit' ? '+' : '-'}
          </span>
        </div>
        <div className="ml-4 flex-grow">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-900">{transaction.description}</span>
            <span className={`text-sm font-semibold ${
              transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
            }`}>
              R$ {Math.abs(transaction.amount).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">{formattedDate}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
              transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {transaction.status === 'completed' ? 'Concluído' : 
               transaction.status === 'pending' ? 'Pendente' : 'Cancelado'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <VirtualizedList
      items={transactions}
      rowHeight={76} // Altura de cada linha em pixels
      renderItem={renderTransaction}
      className={className}
      height={height}
    />
  );
};

export default TransactionList; 