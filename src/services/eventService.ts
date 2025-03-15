import { supabase } from './supabaseClient';
import { Event } from '../types';

// Obter todos os eventos
export async function getAllEvents(
  onlyFuture: boolean = true,
  limit: number = 20
): Promise<Event[]> {
  let query = supabase
    .from('events')
    .select('*')
    .order('date_start', { ascending: true })
    .limit(limit);
  
  // Se for para buscar apenas eventos futuros
  if (onlyFuture) {
    const today = new Date().toISOString();
    query = query.gte('date_start', today);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Erro ao buscar eventos:', error.message);
    throw new Error(`Erro ao buscar eventos: ${error.message}`);
  }
  
  return data || [];
}

// Obter detalhes de um evento específico
export async function getEventById(eventId: string): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      event_tables(*)
    `)
    .eq('id', eventId)
    .single();
  
  if (error) {
    console.error('Erro ao buscar evento:', error.message);
    throw new Error(`Erro ao buscar evento: ${error.message}`);
  }
  
  return data;
}

// Verificar disponibilidade de mesas para um evento
export async function getAvailableTables(eventId: string): Promise<any[]> {
  // 1. Buscar todas as mesas para o evento
  const { data: allTables, error: tablesError } = await supabase
    .from('event_tables')
    .select('*')
    .eq('event_id', eventId);
  
  if (tablesError) {
    console.error('Erro ao buscar mesas:', tablesError.message);
    throw new Error(`Erro ao buscar mesas: ${tablesError.message}`);
  }
  
  // 2. Buscar mesas já reservadas
  const { data: reservedTables, error: reservedError } = await supabase
    .from('event_reservations')
    .select('table_id')
    .eq('event_id', eventId)
    .eq('status', 'CONFIRMADA');
  
  if (reservedError) {
    console.error('Erro ao buscar reservas:', reservedError.message);
    throw new Error(`Erro ao buscar reservas: ${reservedError.message}`);
  }
  
  // 3. Marcar mesas como disponíveis ou ocupadas
  const reservedTableIds = reservedTables?.map(res => res.table_id) || [];
  
  const tablesWithStatus = allTables?.map(table => ({
    ...table,
    is_available: !reservedTableIds.includes(table.id)
  })) || [];
  
  return tablesWithStatus;
}

// Criar um novo evento (administrativo)
export async function createEvent(eventData: Partial<Event>): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .insert({
      title: eventData.title,
      description: eventData.description || '',
      date_start: eventData.dateStart,
      date_end: eventData.dateEnd || eventData.dateStart, // Se não tiver data fim, usa a data início
      capacity: eventData.capacity || 0,
      price: eventData.price || 0,
      image: eventData.image || null,
      created_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('Erro ao criar evento:', error.message);
    throw new Error(`Erro ao criar evento: ${error.message}`);
  }
  
  return data;
}

// Atualizar evento (administrativo)
export async function updateEvent(eventId: string, eventData: Partial<Event>): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .update({
      title: eventData.title,
      description: eventData.description,
      date_start: eventData.dateStart,
      date_end: eventData.dateEnd,
      capacity: eventData.capacity,
      price: eventData.price,
      image: eventData.image,
      updated_at: new Date().toISOString()
    })
    .eq('id', eventId)
    .select()
    .single();
  
  if (error) {
    console.error('Erro ao atualizar evento:', error.message);
    throw new Error(`Erro ao atualizar evento: ${error.message}`);
  }
  
  return data;
}

// Reservar mesa em evento
export async function reserveEventTable(
  eventId: string, 
  tableId: string, 
  userId: string
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    // 1. Verificar se o evento existe
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
    
    if (eventError) {
      return { success: false, error: `Evento não encontrado: ${eventError.message}` };
    }
    
    // 2. Verificar se a mesa existe e está disponível para o evento
    const { data: table, error: tableError } = await supabase
      .from('event_tables')
      .select('*')
      .eq('id', tableId)
      .eq('event_id', eventId)
      .single();
    
    if (tableError) {
      return { success: false, error: `Mesa não encontrada: ${tableError.message}` };
    }
    
    // 3. Verificar se a mesa já está reservada
    const { data: existingReservation, error: reservationError } = await supabase
      .from('event_reservations')
      .select('*')
      .eq('event_id', eventId)
      .eq('table_id', tableId)
      .eq('status', 'CONFIRMADA');
    
    if (reservationError) {
      return { success: false, error: `Erro ao verificar disponibilidade: ${reservationError.message}` };
    }
    
    if (existingReservation && existingReservation.length > 0) {
      return { success: false, error: 'Esta mesa já está reservada' };
    }
    
    // 4. Criar a reserva
    const { data: reservation, error: createError } = await supabase
      .from('event_reservations')
      .insert({
        event_id: eventId,
        table_id: tableId,
        user_id: userId,
        status: 'CONFIRMADA',
        price: table.price || event.price || 0,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (createError) {
      return { success: false, error: `Erro ao criar reserva: ${createError.message}` };
    }
    
    // 5. Se houver valor, registrar a transação
    if (reservation.price > 0) {
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          amount: -reservation.price,
          type: 'EVENTO',
          description: `Reserva para o evento: ${event.title}`,
          created_at: new Date().toISOString(),
          reference_id: reservation.id
        });
      
      if (transactionError) {
        console.error('Erro ao registrar transação:', transactionError.message);
        // Continua mesmo com erro na transação
      }
      
      // Atualizar saldo do usuário
      const { error: balanceError } = await supabase.rpc(
        'update_user_balance', 
        { 
          p_user_id: userId,
          p_amount: -reservation.price
        }
      );
      
      if (balanceError) {
        console.error('Erro ao atualizar saldo:', balanceError.message);
      }
    }
    
    return { success: true, data: reservation };
  } catch (error: any) {
    console.error('Erro ao reservar mesa:', error.message);
    return { success: false, error: `Erro ao reservar mesa: ${error.message}` };
  }
}

// Cancelar reserva em evento
export async function cancelEventReservation(
  reservationId: string, 
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Verificar se a reserva existe e pertence ao usuário
    const { data: reservation, error: fetchError } = await supabase
      .from('event_reservations')
      .select(`
        *,
        events(date_start)
      `)
      .eq('id', reservationId)
      .single();
    
    if (fetchError) {
      return { success: false, error: `Reserva não encontrada: ${fetchError.message}` };
    }
    
    // 2. Verificar se o usuário é dono da reserva ou admin
    const { data: userData } = await supabase
      .from('users')
      .select(`
        id,
        roles(
          role_name
        )
      `)
      .eq('id', userId)
      .single();
    
    const isAdmin = userData?.roles?.[0]?.role_name === 'ADMIN';
    
    if (reservation.user_id !== userId && !isAdmin) {
      return { success: false, error: 'Você não tem permissão para cancelar esta reserva' };
    }
    
    // 3. Verificar se o evento já ocorreu
    const eventDate = new Date(reservation.events.date_start);
    const now = new Date();
    
    if (eventDate < now) {
      return { success: false, error: 'Não é possível cancelar reservas para eventos que já ocorreram' };
    }
    
    // 4. Cancelar a reserva
    const { error: cancelError } = await supabase
      .from('event_reservations')
      .update({ status: 'CANCELADA' })
      .eq('id', reservationId);
    
    if (cancelError) {
      return { success: false, error: `Erro ao cancelar reserva: ${cancelError.message}` };
    }
    
    // 5. Se houver valor, estornar
    if (reservation.price > 0) {
      // Registrar transação de estorno
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: reservation.user_id,
          amount: reservation.price,
          type: 'ESTORNO',
          description: 'Estorno de reserva de evento cancelada',
          created_at: new Date().toISOString(),
          reference_id: reservationId
        });
      
      if (transactionError) {
        console.error('Erro ao registrar estorno:', transactionError.message);
      }
      
      // Atualizar saldo
      const { error: balanceError } = await supabase.rpc(
        'update_user_balance', 
        { 
          p_user_id: reservation.user_id,
          p_amount: reservation.price
        }
      );
      
      if (balanceError) {
        console.error('Erro ao atualizar saldo (estorno):', balanceError.message);
      }
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao cancelar reserva de evento:', error.message);
    return { success: false, error: `Erro ao cancelar reserva: ${error.message}` };
  }
}

// Buscar reservas de eventos do usuário
export async function getUserEventReservations(userId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('event_reservations')
    .select(`
      *,
      events(
        id,
        title,
        description,
        date_start,
        date_end,
        image
      ),
      event_tables(
        name,
        capacity,
        location
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Erro ao buscar reservas de eventos:', error.message);
    throw new Error(`Erro ao buscar reservas: ${error.message}`);
  }
  
  return data || [];
} 