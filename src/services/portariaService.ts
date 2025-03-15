import { supabase } from './supabaseClient';
import { checkMembershipStatus } from './userService';

// Verificar acesso do associado 
export async function validateAccess(userId: string): Promise<{ 
  canAccess: boolean; 
  reason?: string;
  userData?: any;
}> {
  try {
    // 1. Verificar se o usuário existe e não está bloqueado
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        id, 
        name, 
        email, 
        is_blocked,
        roles (
          role_name
        )
      `)
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.error('Erro ao buscar dados do usuário:', userError.message);
      return { canAccess: false, reason: 'Usuário não encontrado' };
    }
    
    if (userData.is_blocked) {
      return { 
        canAccess: false, 
        reason: 'Usuário bloqueado no sistema', 
        userData 
      };
    }

    // 2. Verificar se o associado está com a mensalidade em dia
    const { isActive } = await checkMembershipStatus(userId);
    
    if (!isActive) {
      return { 
        canAccess: false, 
        reason: 'Mensalidade não está em dia', 
        userData 
      };
    }
    
    // 3. Registrar entrada no histórico
    const { error: logError } = await supabase
      .from('access_logs')
      .insert({
        user_id: userId,
        action: 'ENTRADA',
        timestamp: new Date().toISOString()
      });
    
    if (logError) {
      console.error('Erro ao registrar entrada no log:', logError.message);
    }
    
    return { 
      canAccess: true,
      userData
    };
  } catch (error: any) {
    console.error('Erro ao validar acesso:', error.message);
    return { 
      canAccess: false, 
      reason: `Erro ao validar acesso: ${error.message}`
    };
  }
}

// Registrar saída do clube
export async function registerExit(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('access_logs')
      .insert({
        user_id: userId,
        action: 'SAIDA',
        timestamp: new Date().toISOString()
      });
    
    if (error) {
      console.error('Erro ao registrar saída:', error.message);
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.error('Erro ao registrar saída:', error.message);
    return false;
  }
}

// Obter registros de acesso (para relatórios)
export async function getAccessLogs(
  startDate?: string, 
  endDate?: string, 
  userId?: string,
  limit: number = 100
): Promise<any[]> {
  try {
    let query = supabase
      .from('access_logs')
      .select(`
        id,
        user_id,
        action,
        timestamp,
        users (
          name,
          email
        )
      `)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (startDate) {
      query = query.gte('timestamp', startDate);
    }
    
    if (endDate) {
      query = query.lte('timestamp', endDate);
    }
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erro ao buscar logs de acesso:', error.message);
      throw new Error(`Erro ao buscar logs de acesso: ${error.message}`);
    }
    
    return data || [];
  } catch (error: any) {
    console.error('Erro ao buscar logs de acesso:', error.message);
    return [];
  }
}

// Verificar quem está no clube no momento (para segurança e controle)
export async function getCurrentlyInClub(): Promise<any[]> {
  const today = new Date().toISOString().split('T')[0]; // Data atual no formato YYYY-MM-DD
  
  try {
    // Lógica: pessoas que têm registro de entrada hoje, mas não têm saída posterior
    const { data, error } = await supabase.rpc('get_currently_in_club');
    
    if (error) {
      console.error('Erro ao buscar pessoas no clube:', error.message);
      throw new Error(`Erro ao buscar pessoas no clube: ${error.message}`);
    }
    
    return data || [];
  } catch (error: any) {
    console.error('Erro ao buscar pessoas no clube:', error.message);
    return [];
  }
} 