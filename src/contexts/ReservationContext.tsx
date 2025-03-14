import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import supabase from '../lib/supabaseClient';
import { useAuth } from './AuthContext';
import { Reservation } from '../types';

// Interface para recursos disponíveis para reserva
export interface Resource {
  id: string;
  name: string;
  type: 'CHURRASQUEIRA' | 'MESA' | 'SALAO' | 'OUTRO';
  description?: string;
  capacity: number;
  price: number;
  available: boolean;
  image?: string;
}

// Interface para o contexto de reservas
export interface ReservationContextType {
  userReservations: Reservation[];
  availableResources: Resource[];
  isLoading: boolean;
  error: string | null;
  createReservation: (resourceId: string, dateStart: string, dateEnd: string) => Promise<boolean>;
  cancelReservation: (reservationId: string) => Promise<boolean>;
  getResourceAvailability: (resourceId: string, date: string) => Promise<{ timeSlots: string[], isAvailable: boolean }>;
  fetchUserReservations: () => Promise<void>;
  fetchAvailableResources: () => Promise<void>;
}

// Props para o provider
interface ReservationProviderProps {
  children: ReactNode;
}

// Criando o contexto
const ReservationContext = createContext<ReservationContextType | null>(null);

export const ReservationProvider: React.FC<ReservationProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [userReservations, setUserReservations] = useState<Reservation[]>([]);
  const [availableResources, setAvailableResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar reservas do usuário quando autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserReservations();
      fetchAvailableResources();
    } else {
      setUserReservations([]);
      setAvailableResources([]);
    }
  }, [isAuthenticated, user]);

  // Buscar reservas do usuário
  const fetchUserReservations = async (): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('reservas')
        .select(`
          *,
          recursos:resource_id (
            id,
            nome,
            tipo,
            descricao,
            capacidade,
            preco
          )
        `)
        .eq('user_id', user.id)
        .order('data_inicio', { ascending: true });
      
      if (error) throw error;
      
      // Mapear dados para o formato da interface Reservation
      const reservations: Reservation[] = data.map((item: any) => ({
        id: item.id,
        userId: item.user_id,
        resourceId: item.resource_id,
        dateStart: item.data_inicio,
        dateEnd: item.data_fim,
        status: item.status,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        resource: item.recursos ? {
          id: item.recursos.id,
          name: item.recursos.nome,
          type: item.recursos.tipo,
          description: item.recursos.descricao,
          capacity: item.recursos.capacidade,
          price: item.recursos.preco,
        } : undefined,
      }));
      
      setUserReservations(reservations);
    } catch (err: any) {
      console.error('Erro ao buscar reservas:', err);
      setError(err.message || 'Erro ao buscar reservas');
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar recursos disponíveis
  const fetchAvailableResources = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('recursos')
        .select('*')
        .eq('disponivel', true)
        .order('nome');
      
      if (error) throw error;
      
      // Mapear dados para o formato da interface Resource
      const resources: Resource[] = data.map((item: any) => ({
        id: item.id,
        name: item.nome,
        type: item.tipo,
        description: item.descricao,
        capacity: item.capacidade,
        price: item.preco,
        available: item.disponivel,
        image: item.imagem,
      }));
      
      setAvailableResources(resources);
    } catch (err: any) {
      console.error('Erro ao buscar recursos:', err);
      setError(err.message || 'Erro ao buscar recursos disponíveis');
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar disponibilidade de um recurso em uma data específica
  const getResourceAvailability = async (
    resourceId: string,
    date: string
  ): Promise<{ timeSlots: string[], isAvailable: boolean }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Buscar reservas existentes para o recurso na data especificada
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const { data, error } = await supabase
        .from('reservas')
        .select('data_inicio, data_fim')
        .eq('resource_id', resourceId)
        .gte('data_inicio', startOfDay.toISOString())
        .lte('data_inicio', endOfDay.toISOString())
        .not('status', 'eq', 'CANCELADA');
      
      if (error) throw error;
      
      // Gerar slots de tempo disponíveis (exemplo: de hora em hora)
      const allTimeSlots = [];
      const bookedSlots = new Set();
      
      // Horário de funcionamento: 8h às 22h
      for (let hour = 8; hour < 22; hour++) {
        allTimeSlots.push(`${hour}:00`);
      }
      
      // Marcar slots já reservados
      data.forEach((reservation: any) => {
        const start = new Date(reservation.data_inicio);
        const end = new Date(reservation.data_fim);
        
        for (let hour = start.getHours(); hour <= end.getHours(); hour++) {
          bookedSlots.add(`${hour}:00`);
        }
      });
      
      // Filtrar slots disponíveis
      const availableSlots = allTimeSlots.filter(slot => !bookedSlots.has(slot));
      
      return {
        timeSlots: availableSlots,
        isAvailable: availableSlots.length > 0,
      };
    } catch (err: any) {
      console.error('Erro ao verificar disponibilidade:', err);
      setError(err.message || 'Erro ao verificar disponibilidade');
      return {
        timeSlots: [],
        isAvailable: false,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Criar uma nova reserva
  const createReservation = async (
    resourceId: string,
    dateStart: string,
    dateEnd: string
  ): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Verificar se o recurso está disponível no período
      const startDate = new Date(dateStart);
      const date = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`;
      
      const { isAvailable } = await getResourceAvailability(resourceId, date);
      
      if (!isAvailable) {
        setError('Recurso não disponível no período selecionado');
        return false;
      }
      
      // Buscar preço do recurso
      const resource = availableResources.find(r => r.id === resourceId);
      
      if (!resource) {
        setError('Recurso não encontrado');
        return false;
      }
      
      // Criar reserva
      const { data, error } = await supabase
        .from('reservas')
        .insert({
          user_id: user.id,
          resource_id: resourceId,
          data_inicio: dateStart,
          data_fim: dateEnd,
          status: 'PENDENTE',
          valor: resource.price,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Atualizar lista de reservas
      await fetchUserReservations();
      
      return true;
    } catch (err: any) {
      console.error('Erro ao criar reserva:', err);
      setError(err.message || 'Erro ao criar reserva');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Cancelar uma reserva
  const cancelReservation = async (reservationId: string): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('reservas')
        .update({ status: 'CANCELADA' })
        .eq('id', reservationId)
        .eq('user_id', user.id); // Garantir que o usuário só cancele suas próprias reservas
      
      if (error) throw error;
      
      // Atualizar lista de reservas
      await fetchUserReservations();
      
      return true;
    } catch (err: any) {
      console.error('Erro ao cancelar reserva:', err);
      setError(err.message || 'Erro ao cancelar reserva');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: ReservationContextType = {
    userReservations,
    availableResources,
    isLoading,
    error,
    createReservation,
    cancelReservation,
    getResourceAvailability,
    fetchUserReservations,
    fetchAvailableResources,
  };

  return <ReservationContext.Provider value={value}>{children}</ReservationContext.Provider>;
};

// Hook personalizado para usar o contexto
export const useReservation = (): ReservationContextType => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservation deve ser usado dentro de um ReservationProvider');
  }
  return context;
}; 