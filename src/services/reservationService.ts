import { supabase } from './supabaseClient';
import { Reservation } from '../types';
import { checkMembershipStatus } from './userService';
import { getUserBalance } from './barService';

interface ReservationPayload {
  resourceId: string;        // ID da churrasqueira ou mesa de evento
  userId: string;            // ID do usuário que está reservando
  dateStart: string;         // Data/hora início
  dateEnd: string;           // Data/hora fim
  notes?: string;            // Observações adicionais
  guests?: number;           // Número de convidados
}

// Verificar disponibilidade de uma churrasqueira ou mesa em determinada data
export async function checkAvailability(
  resourceId: string, 
  dateStart: string, 
  dateEnd: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('reservations')
    .select('id')
    .eq('resource_id', resourceId)
    .eq('status', 'CONFIRMADA')
    .or(`dateStart.lte.${dateEnd},dateEnd.gte.${dateStart}`);
  
  if (error) {
    console.error('Erro ao verificar disponibilidade:', error.message);
    throw new Error(`Erro ao verificar disponibilidade: ${error.message}`);
  }
  
  // Se não houver dados, significa que está disponível
  return data.length === 0;
}

// Obter recursos (churrasqueiras, mesas, etc) disponíveis
export async function getResources(type: 'CHURRASQUEIRA' | 'MESA' | 'OUTRO'): Promise<any[]> {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('type', type)
    .eq('active', true)
    .order('name');
  
  if (error) {
    console.error('Erro ao buscar recursos:', error.message);
    throw new Error(`Erro ao buscar recursos: ${error.message}`);
  }
  
  return data || [];
}

// Fazer uma reserva
export async function createReservation(reservation: ReservationPayload): Promise<{ 
  success: boolean; 
  data?: any; 
  error?: string;
}> {
  try {
    // 1. Verificar se o usuário está em dia com a mensalidade
    const { isActive } = await checkMembershipStatus(reservation.userId);
    if (!isActive) {
      return { 
        success: false, 
        error: 'Não é possível fazer reservas com a mensalidade em atraso' 
      };
    }
    
    // 2. Verificar se o usuário está bloqueado
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('is_blocked')
      .eq('id', reservation.userId)
      .single();
    
    if (userError) {
      return { success: false, error: `Erro ao verificar usuário: ${userError.message}` };
    }
    
    if (userData.is_blocked) {
      return { success: false, error: 'Usuário bloqueado não pode fazer reservas' };
    }
    
    // 3. Verificar disponibilidade do recurso
    const isAvailable = await checkAvailability(
      reservation.resourceId, 
      reservation.dateStart, 
      reservation.dateEnd
    );
    
    if (!isAvailable) {
      return { 
        success: false, 
        error: 'Recurso não disponível na data/horário selecionado' 
      };
    }
    
    // 4. Obter informações do recurso (preço, tipo)
    const { data: resourceData, error: resourceError } = await supabase
      .from('resources')
      .select('*')
      .eq('id', reservation.resourceId)
      .single();
    
    if (resourceError) {
      return { 
        success: false, 
        error: `Erro ao buscar informações do recurso: ${resourceError.message}` 
      };
    }
    
    // 5. Calcular preço da reserva
    const reservationPrice = resourceData.price_per_hour || 0;
    
    // 6. Verificar saldo (se for cobrado)
    if (reservationPrice > 0) {
      const balance = await getUserBalance(reservation.userId);
      if (balance < reservationPrice) {
        return { 
          success: false, 
          error: `Saldo insuficiente. Saldo atual: R$ ${balance.toFixed(2)}, Preço da reserva: R$ ${reservationPrice.toFixed(2)}` 
        };
      }
    }
    
    // 7. Criar a reserva
    const { data, error } = await supabase
      .from('reservations')
      .insert({
        user_id: reservation.userId,
        resource_id: reservation.resourceId,
        resource_type: resourceData.type,
        date_start: reservation.dateStart,
        date_end: reservation.dateEnd,
        status: 'CONFIRMADA',
        price: reservationPrice,
        notes: reservation.notes || '',
        guests: reservation.guests || 0,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      return { success: false, error: `Erro ao criar reserva: ${error.message}` };
    }
    
    // 8. Se tiver preço, debitar do saldo (chamada ao serviço de saldo)
    if (reservationPrice > 0) {
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: reservation.userId,
          amount: -reservationPrice, // negativo pois é um débito
          type: 'RESERVA',
          description: `Reserva de ${resourceData.name} - ${new Date(reservation.dateStart).toLocaleDateString()}`,
          created_at: new Date().toISOString(),
          reference_id: data.id
        });
      
      if (transactionError) {
        console.error('Erro ao registrar transação:', transactionError.message);
        // Mesmo com erro na transação, a reserva foi criada
      }
      
      // Atualizar saldo
      const { error: balanceError } = await supabase.rpc(
        'update_user_balance', 
        { 
          p_user_id: reservation.userId,
          p_amount: -reservationPrice
        }
      );
      
      if (balanceError) {
        console.error('Erro ao atualizar saldo:', balanceError.message);
      }
    }
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Erro ao criar reserva:', error.message);
    return { success: false, error: `Erro ao criar reserva: ${error.message}` };
  }
}

// Cancelar uma reserva
export async function cancelReservation(
  reservationId: string, 
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Buscar a reserva para validação
    const { data: reservation, error: fetchError } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .single();
    
    if (fetchError) {
      return { success: false, error: `Erro ao buscar reserva: ${fetchError.message}` };
    }
    
    // 2. Verificar se a reserva pertence ao usuário ou se é admin
    const { data: userData } = await supabase
      .from('users')
      .select(`
        id,
        roles (
          role_name
        )
      `)
      .eq('id', userId)
      .single();
    
    const isAdmin = userData?.roles?.[0]?.role_name === 'ADMIN';
    
    if (reservation.user_id !== userId && !isAdmin) {
      return { success: false, error: 'Você não tem permissão para cancelar esta reserva' };
    }
    
    // 3. Verificar se a reserva já aconteceu
    const reservationDate = new Date(reservation.date_start);
    const now = new Date();
    
    if (reservationDate < now) {
      return { success: false, error: 'Não é possível cancelar reservas que já ocorreram' };
    }
    
    // 4. Cancelar a reserva
    const { error: cancelError } = await supabase
      .from('reservations')
      .update({ status: 'CANCELADA' })
      .eq('id', reservationId);
    
    if (cancelError) {
      return { success: false, error: `Erro ao cancelar reserva: ${cancelError.message}` };
    }
    
    // 5. Se houver valor, estornar para o saldo do usuário
    if (reservation.price > 0) {
      // Atualizar saldo
      const { error: balanceError } = await supabase.rpc(
        'update_user_balance', 
        { 
          p_user_id: reservation.user_id,
          p_amount: reservation.price // positivo pois é um estorno
        }
      );
      
      if (balanceError) {
        console.error('Erro ao atualizar saldo (estorno):', balanceError.message);
      }
      
      // Registrar transação de estorno
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: reservation.user_id,
          amount: reservation.price,
          type: 'ESTORNO',
          description: `Estorno de reserva cancelada - ${reservationId}`,
          created_at: new Date().toISOString(),
          reference_id: reservationId
        });
      
      if (transactionError) {
        console.error('Erro ao registrar transação de estorno:', transactionError.message);
      }
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao cancelar reserva:', error.message);
    return { success: false, error: `Erro ao cancelar reserva: ${error.message}` };
  }
}

// Obter reservas do usuário
export async function getUserReservations(
  userId: string, 
  status?: 'PENDENTE' | 'CONFIRMADA' | 'CANCELADA',
  limit: number = 10
): Promise<any[]> {
  let query = supabase
    .from('reservations')
    .select(`
      *,
      resources (
        name,
        type,
        description
      )
    `)
    .eq('user_id', userId)
    .order('date_start', { ascending: false })
    .limit(limit);
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Erro ao buscar reservas do usuário:', error.message);
    throw new Error(`Erro ao buscar reservas: ${error.message}`);
  }
  
  return data || [];
}

// Obter todas as reservas (para administradores)
export async function getAllReservations(
  startDate?: string,
  endDate?: string,
  resourceType?: 'CHURRASQUEIRA' | 'MESA' | 'OUTRO',
  status?: 'PENDENTE' | 'CONFIRMADA' | 'CANCELADA',
  limit: number = 100
): Promise<any[]> {
  let query = supabase
    .from('reservations')
    .select(`
      *,
      users (
        name,
        email
      ),
      resources (
        name,
        type
      )
    `)
    .order('date_start', { ascending: false })
    .limit(limit);
  
  if (startDate) {
    query = query.gte('date_start', startDate);
  }
  
  if (endDate) {
    query = query.lte('date_start', endDate);
  }
  
  if (resourceType) {
    query = query.eq('resource_type', resourceType);
  }
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Erro ao buscar todas as reservas:', error.message);
    throw new Error(`Erro ao buscar reservas: ${error.message}`);
  }
  
  return data || [];
} 