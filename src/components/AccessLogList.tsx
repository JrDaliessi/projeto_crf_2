import React from 'react';
import VirtualizedList from './VirtualizedList';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

interface AccessLogListProps {
  logs: AccessLog[];
  onLogClick?: (log: AccessLog) => void;
  className?: string;
  height?: number | string;
}

const AccessLogList: React.FC<AccessLogListProps> = ({
  logs,
  onLogClick,
  className = '',
  height = 400,
}) => {
  const renderAccessLog = (log: AccessLog, index: number, style: React.CSSProperties) => {
    const formattedDate = format(new Date(log.timestamp), "dd/MM/yyyy HH:mm:ss", { locale: ptBR });
    
    const getAccessMethodIcon = (method: string) => {
      switch (method) {
        case 'carteirinha':
          return (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          );
        case 'biometria':
          return (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          );
        case 'facial':
          return (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          );
        case 'manual':
          return (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          );
        default:
          return null;
      }
    };
    
    return (
      <div
        key={log.id}
        style={style}
        className="flex p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
        onClick={() => onLogClick && onLogClick(log)}
      >
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
          ${log.status === 'success' ? 'bg-green-100 text-green-600' : 
            log.status === 'denied' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}
        >
          {log.access_type === 'entrada' ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          )}
        </div>
        
        <div className="ml-4 flex-grow">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-900">
              {log.user_name || log.user_email || 'Usuário não identificado'}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              log.status === 'success' ? 'bg-green-100 text-green-800' : 
              log.status === 'denied' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {log.status === 'success' ? 'Aprovado' : 
               log.status === 'denied' ? 'Negado' : 'Pendente'}
            </span>
          </div>
          
          <div className="flex items-center mt-1">
            <span className="text-xs text-gray-500 mr-2">{formattedDate}</span>
            <span className="text-xs text-gray-500">{log.location}</span>
          </div>
          
          <div className="flex items-center mt-1">
            <div className="flex items-center text-xs text-gray-500 mr-3">
              {getAccessMethodIcon(log.access_method)}
              <span className="ml-1">{
                log.access_method === 'carteirinha' ? 'Carteirinha' :
                log.access_method === 'biometria' ? 'Biometria' :
                log.access_method === 'facial' ? 'Facial' : 'Manual'
              }</span>
            </div>
            
            {log.operator_name && (
              <div className="text-xs text-gray-500">
                <span>Operador: {log.operator_name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <VirtualizedList
      items={logs}
      rowHeight={84} // Altura de cada linha em pixels
      renderItem={renderAccessLog}
      className={className}
      height={height}
    />
  );
};

export default AccessLogList; 