import React from 'react';
import VirtualizedList from './VirtualizedList';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

interface ReservationListProps {
  reservations: Reservation[];
  onReservationClick?: (reservation: Reservation) => void;
  className?: string;
  height?: number | string;
}

const ReservationList: React.FC<ReservationListProps> = ({
  reservations,
  onReservationClick,
  className = '',
  height = 400,
}) => {
  const renderReservation = (reservation: Reservation, index: number, style: React.CSSProperties) => {
    const formattedDate = format(new Date(reservation.reservation_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    
    return (
      <div
        key={reservation.id}
        style={style}
        className="flex flex-col p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
        onClick={() => onReservationClick && onReservationClick(reservation)}
      >
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-900">{reservation.facility_name}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            reservation.status === 'approved' ? 'bg-green-100 text-green-800' : 
            reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {reservation.status === 'approved' ? 'Aprovada' : 
             reservation.status === 'pending' ? 'Pendente' : 'Cancelada'}
          </span>
        </div>
        
        <div className="mt-2 flex items-center">
          <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs text-gray-500">{formattedDate}</span>
          
          <svg className="h-4 w-4 text-gray-500 ml-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-gray-500">{reservation.start_time} - {reservation.end_time}</span>
        </div>
        
        {reservation.price && (
          <div className="mt-1">
            <span className="text-sm font-medium text-gray-700">
              R$ {reservation.price.toFixed(2)}
            </span>
          </div>
        )}
        
        {reservation.observations && (
          <div className="mt-1">
            <span className="text-xs text-gray-600 line-clamp-1">{reservation.observations}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <VirtualizedList
      items={reservations}
      rowHeight={100} // Altura de cada linha em pixels
      renderItem={renderReservation}
      className={className}
      height={height}
    />
  );
};

export default ReservationList; 