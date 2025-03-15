import { supabase } from './supabaseClient';
import { User } from '../types';

// Buscar dados do usuário pelo ID
export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      roles (
        role_name
      )
    `)
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Erro ao buscar usuário:', error.message);
    throw new Error(`Erro ao buscar usuário: ${error.message}`);
  }
  
  return data;
}

// Buscar todos os usuários (para administradores)
export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      roles (
        role_name
      )
    `)
    .order('name');
  
  if (error) {
    console.error('Erro ao buscar usuários:', error.message);
    throw new Error(`Erro ao buscar usuários: ${error.message}`);
  }
  
  return data || [];
}

// Atualizar dados do usuário
export async function updateUser(userId: string, userData: Partial<User>): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Erro ao atualizar usuário:', error.message);
    throw new Error(`Erro ao atualizar usuário: ${error.message}`);
  }
  
  return data;
}

// Bloquear/Desbloquear usuário (para administradores)
export async function toggleUserBlock(userId: string, isBlocked: boolean): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ is_blocked: isBlocked })
    .eq('id', userId);
  
  if (error) {
    console.error('Erro ao alterar status de bloqueio do usuário:', error.message);
    throw new Error(`Erro ao alterar status de bloqueio: ${error.message}`);
  }
}

// Verificar status da mensalidade
export async function checkMembershipStatus(userId: string): Promise<{ isActive: boolean, expiresAt?: string }> {
  const { data, error } = await supabase
    .from('memberships')
    .select('expires_at, is_active')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Erro ao verificar status da mensalidade:', error.message);
    throw new Error(`Erro ao verificar status da mensalidade: ${error.message}`);
  }
  
  return {
    isActive: data?.is_active || false,
    expiresAt: data?.expires_at
  };
}

// Registrar pagamento de mensalidade
export async function registerMembershipPayment(userId: string, months: number = 1): Promise<void> {
  // Primeiro, verificamos o status atual
  const { data: currentMembership, error: fetchError } = await supabase
    .from('memberships')
    .select('expires_at, is_active')
    .eq('user_id', userId)
    .single();
  
  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = registro não encontrado
    console.error('Erro ao buscar mensalidade:', fetchError.message);
    throw new Error(`Erro ao buscar mensalidade: ${fetchError.message}`);
  }
  
  // Calcula nova data de expiração
  const now = new Date();
  let newExpiryDate: Date;
  
  if (currentMembership?.expires_at && new Date(currentMembership.expires_at) > now) {
    // Se ainda estiver ativa, adiciona meses à data atual de expiração
    newExpiryDate = new Date(currentMembership.expires_at);
  } else {
    // Se expirada ou não existir, começa da data atual
    newExpiryDate = now;
  }
  
  // Adiciona os meses
  newExpiryDate.setMonth(newExpiryDate.getMonth() + months);
  
  // Atualiza ou insere o registro
  const { error: upsertError } = await supabase
    .from('memberships')
    .upsert({
      user_id: userId,
      is_active: true,
      expires_at: newExpiryDate.toISOString(),
      last_payment_date: new Date().toISOString()
    });
  
  if (upsertError) {
    console.error('Erro ao registrar pagamento:', upsertError.message);
    throw new Error(`Erro ao registrar pagamento: ${upsertError.message}`);
  }
  
  // Registra a transação
  const { error: transactionError } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      amount: months * 100, // assumindo que a mensalidade seja R$ 100,00
      type: 'MENSALIDADE',
      description: `Pagamento de ${months} ${months === 1 ? 'mês' : 'meses'} de mensalidade`,
      created_at: new Date().toISOString()
    });
  
  if (transactionError) {
    console.error('Erro ao registrar transação de mensalidade:', transactionError.message);
    throw new Error(`Erro ao registrar transação: ${transactionError.message}`);
  }
} 