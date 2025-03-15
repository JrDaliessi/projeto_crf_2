import { useState, useCallback, useEffect } from 'react';
import { 
  getResources, 
  checkAvailability, 
  createReservation, 
  cancelReservation, 
  getUserReservations 
} from '../services/reservationService';

interface ReservationPayload {
  resourceId: string;
  userId: string;
  dateStart: string;
  dateEnd: string;
  notes?: string;
  guests?: number;
}

// Hook para gerenciar reservas
export function useReservation(userId: string) {
  const [resources, setResources] = useState<any[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState<boolean>(false);
  const [resourcesError, setResourcesError] = useState<string | null>(null);
  
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState<boolean>(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  
  const [userReservations, setUserReservations] = useState<any[]>([]);
  const [isLoadingUserReservations, setIsLoadingUserReservations] = useState<boolean>(false);
  const [userReservationsError, setUserReservationsError] = useState<string | null>(null);
  
  // Buscar recursos disponíveis
  const fetchResources = useCallback(async (type: 'CHURRASQUEIRA' | 'MESA' | 'OUTRO') => {
    setIsLoadingResources(true);
    setResourcesError(null);
    
    try {
      const data = await getResources(type);
      setResources(data);
    } catch (error: any) {
      setResourcesError(error.message);
      console.error('Erro ao buscar recursos:', error);
    } finally {
      setIsLoadingResources(false);
    }
  }, []);
  
  // Verificar disponibilidade de um recurso
  const checkResourceAvailability = useCallback(async (
    resourceId: string, 
    dateStart: string, 
    dateEnd: string
  ) => {
    setIsCheckingAvailability(true);
    setAvailabilityError(null);
    
    try {
      const available = await checkAvailability(resourceId, dateStart, dateEnd);
      setIsAvailable(available);
      return available;
    } catch (error: any) {
      setAvailabilityError(error.message);
      console.error('Erro ao verificar disponibilidade:', error);
      return false;
    } finally {
      setIsCheckingAvailability(false);
    }
  }, []);
  
  // Criar uma reserva
  const handleCreateReservation = useCallback(async (reservation: Omit<ReservationPayload, 'userId'>) => {
    if (!userId) return { success: false, error: 'Usuário não autenticado' };
    
    try {
      const result = await createReservation({
        ...reservation,
        userId
      });
      
      if (result.success) {
        await fetchUserReservations(); // Atualizar lista de reservas do usuário
      }
      
      return result;
    } catch (error: any) {
      console.error('Erro ao criar reserva:', error);
      return { success: false, error: error.message };
    }
  }, [userId]);
  
  // Cancelar uma reserva
  const handleCancelReservation = useCallback(async (reservationId: string) => {
    if (!userId) return { success: false, error: 'Usuário não autenticado' };
    
    try {
      const result = await cancelReservation(reservationId, userId);
      
      if (result.success) {
        await fetchUserReservations(); // Atualizar lista de reservas do usuário
      }
      
      return result;
    } catch (error: any) {
      console.error('Erro ao cancelar reserva:', error);
      return { success: false, error: error.message };
    }
  }, [userId]);
  
  // Buscar reservas do usuário
  const fetchUserReservations = useCallback(async (
    status?: 'PENDENTE' | 'CONFIRMADA' | 'CANCELADA',
    limit: number = 10
  ) => {
    if (!userId) return;
    
    setIsLoadingUserReservations(true);
    setUserReservationsError(null);
    
    try {
      const reservations = await getUserReservations(userId, status, limit);
      setUserReservations(reservations);
    } catch (error: any) {
      setUserReservationsError(error.message);
      console.error('Erro ao buscar reservas do usuário:', error);
    } finally {
      setIsLoadingUserReservations(false);
    }
  }, [userId]);
  
  // Carregar reservas do usuário ao inicializar
  useEffect(() => {
    if (userId) {
      fetchUserReservations();
    }
  }, [userId, fetchUserReservations]);
  
  return {
    // Recursos
    resources,
    isLoadingResources,
    resourcesError,
    fetchResources,
    
    // Verificação de disponibilidade
    isAvailable,
    isCheckingAvailability,
    availabilityError,
    checkResourceAvailability,
    
    // Reservas do usuário
    userReservations,
    isLoadingUserReservations,
    userReservationsError,
    fetchUserReservations,
    
    // Operações
    handleCreateReservation,
    handleCancelReservation
  };
} 