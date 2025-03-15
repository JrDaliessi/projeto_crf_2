import { useState, useCallback, useEffect } from 'react';
import { 
  getAllEvents, 
  getEventById, 
  getAvailableTables,
  reserveEventTable,
  cancelEventReservation,
  getUserEventReservations
} from '../services/eventService';
import { Event } from '../types';

// Hook para gerenciar eventos
export function useEvent(userId?: string) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoadingEventDetails, setIsLoadingEventDetails] = useState<boolean>(false);
  const [eventDetailsError, setEventDetailsError] = useState<string | null>(null);
  
  const [availableTables, setAvailableTables] = useState<any[]>([]);
  const [isLoadingTables, setIsLoadingTables] = useState<boolean>(false);
  const [tablesError, setTablesError] = useState<string | null>(null);
  
  const [userReservations, setUserReservations] = useState<any[]>([]);
  const [isLoadingUserReservations, setIsLoadingUserReservations] = useState<boolean>(false);
  const [userReservationsError, setUserReservationsError] = useState<string | null>(null);
  
  // Buscar todos os eventos
  const fetchEvents = useCallback(async (onlyFuture: boolean = true, limit: number = 20) => {
    setIsLoadingEvents(true);
    setEventsError(null);
    
    try {
      const eventsData = await getAllEvents(onlyFuture, limit);
      setEvents(eventsData);
    } catch (error: any) {
      setEventsError(error.message);
      console.error('Erro ao buscar eventos:', error);
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);
  
  // Buscar detalhes de um evento
  const fetchEventDetails = useCallback(async (eventId: string) => {
    setIsLoadingEventDetails(true);
    setEventDetailsError(null);
    
    try {
      const eventData = await getEventById(eventId);
      setSelectedEvent(eventData);
      return eventData;
    } catch (error: any) {
      setEventDetailsError(error.message);
      console.error('Erro ao buscar detalhes do evento:', error);
      return null;
    } finally {
      setIsLoadingEventDetails(false);
    }
  }, []);
  
  // Buscar mesas disponíveis para um evento
  const fetchAvailableTables = useCallback(async (eventId: string) => {
    setIsLoadingTables(true);
    setTablesError(null);
    
    try {
      const tables = await getAvailableTables(eventId);
      setAvailableTables(tables);
      return tables;
    } catch (error: any) {
      setTablesError(error.message);
      console.error('Erro ao buscar mesas disponíveis:', error);
      return [];
    } finally {
      setIsLoadingTables(false);
    }
  }, []);
  
  // Reservar mesa em evento
  const handleReserveTable = useCallback(async (eventId: string, tableId: string) => {
    if (!userId) return { success: false, error: 'Usuário não autenticado' };
    
    try {
      const result = await reserveEventTable(eventId, tableId, userId);
      
      if (result.success) {
        // Atualizar mesas disponíveis e reservas do usuário
        await fetchAvailableTables(eventId);
        await fetchUserEventReservations();
      }
      
      return result;
    } catch (error: any) {
      console.error('Erro ao reservar mesa:', error);
      return { success: false, error: error.message };
    }
  }, [userId, fetchAvailableTables]);
  
  // Cancelar reserva em evento
  const handleCancelReservation = useCallback(async (reservationId: string) => {
    if (!userId) return { success: false, error: 'Usuário não autenticado' };
    
    try {
      const result = await cancelEventReservation(reservationId, userId);
      
      if (result.success) {
        // Atualizar lista de reservas do usuário
        await fetchUserEventReservations();
        
        // Se houver um evento selecionado, atualizar as mesas disponíveis
        if (selectedEvent) {
          await fetchAvailableTables(selectedEvent.id);
        }
      }
      
      return result;
    } catch (error: any) {
      console.error('Erro ao cancelar reserva:', error);
      return { success: false, error: error.message };
    }
  }, [userId, selectedEvent, fetchAvailableTables]);
  
  // Buscar reservas de eventos do usuário
  const fetchUserEventReservations = useCallback(async () => {
    if (!userId) return;
    
    setIsLoadingUserReservations(true);
    setUserReservationsError(null);
    
    try {
      const reservations = await getUserEventReservations(userId);
      setUserReservations(reservations);
      return reservations;
    } catch (error: any) {
      setUserReservationsError(error.message);
      console.error('Erro ao buscar reservas de eventos:', error);
      return [];
    } finally {
      setIsLoadingUserReservations(false);
    }
  }, [userId]);
  
  // Carregar eventos ao inicializar
  useEffect(() => {
    fetchEvents();
    
    if (userId) {
      fetchUserEventReservations();
    }
  }, [userId, fetchEvents, fetchUserEventReservations]);
  
  return {
    // Eventos
    events,
    isLoadingEvents,
    eventsError,
    fetchEvents,
    
    // Detalhes do evento
    selectedEvent,
    isLoadingEventDetails,
    eventDetailsError,
    fetchEventDetails,
    
    // Mesas disponíveis
    availableTables,
    isLoadingTables,
    tablesError,
    fetchAvailableTables,
    
    // Reservas do usuário
    userReservations,
    isLoadingUserReservations,
    userReservationsError,
    fetchUserEventReservations,
    
    // Operações
    handleReserveTable,
    handleCancelReservation
  };
} 