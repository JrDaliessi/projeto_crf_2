import { supabase } from './supabaseClient';
import { User } from '../types';

// Gerar relatório financeiro 
export async function generateFinancialReport(
  startDate: string, 
  endDate: string
): Promise<any> {
  try {
    // Obter transações no período
    const { data: transactions, error: transactionError } = await supabase
      .from('transactions')
      .select(`
        id,
        user_id,
        amount,
        type,
        description,
        created_at,
        users (
          name,
          email
        )
      `)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });
    
    if (transactionError) {
      console.error('Erro ao buscar transações:', transactionError.message);
      throw new Error(`Erro ao buscar transações: ${transactionError.message}`);
    }
    
    // Calcular totais por tipo
    const summary = {
      total_entrada: 0,
      total_saida: 0,
      total_mensalidades: 0,
      total_bar: 0,
      total_reservas: 0,
      total_eventos: 0,
      count_transactions: transactions?.length || 0
    };
    
    transactions?.forEach(transaction => {
      // Soma totais de entrada e saída
      if (transaction.amount > 0) {
        summary.total_entrada += transaction.amount;
      } else {
        summary.total_saida += Math.abs(transaction.amount);
      }
      
      // Soma por categoria
      switch (transaction.type) {
        case 'MENSALIDADE':
          summary.total_mensalidades += Math.abs(transaction.amount);
          break;
        case 'COMPRA':
          summary.total_bar += Math.abs(transaction.amount);
          break;
        case 'RESERVA':
          summary.total_reservas += Math.abs(transaction.amount);
          break;
        case 'EVENTO':
          summary.total_eventos += Math.abs(transaction.amount);
          break;
      }
    });
    
    return {
      summary,
      transactions: transactions || []
    };
  } catch (error: any) {
    console.error('Erro ao gerar relatório financeiro:', error.message);
    throw new Error(`Erro ao gerar relatório financeiro: ${error.message}`);
  }
}

// Gerar relatório de acesso
export async function generateAccessReport(
  startDate: string, 
  endDate: string
): Promise<any> {
  try {
    // Obter logs de acesso no período
    const { data: logs, error: logsError } = await supabase
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
      .gte('timestamp', startDate)
      .lte('timestamp', endDate)
      .order('timestamp', { ascending: false });
    
    if (logsError) {
      console.error('Erro ao buscar logs de acesso:', logsError.message);
      throw new Error(`Erro ao buscar logs de acesso: ${logsError.message}`);
    }
    
    // Calcular estatísticas
    const summary = {
      total_acessos: logs?.filter(log => log.action === 'ENTRADA')?.length || 0,
      total_saidas: logs?.filter(log => log.action === 'SAIDA')?.length || 0,
      usuarios_unicos: new Set(logs?.map(log => log.user_id) || []).size
    };
    
    // Agrupar por dia para análise de fluxo
    const dailyStats: Record<string, { entradas: number; saidas: number }> = {};
    
    logs?.forEach(log => {
      const date = new Date(log.timestamp).toISOString().split('T')[0];
      
      if (!dailyStats[date]) {
        dailyStats[date] = { entradas: 0, saidas: 0 };
      }
      
      if (log.action === 'ENTRADA') {
        dailyStats[date].entradas += 1;
      } else if (log.action === 'SAIDA') {
        dailyStats[date].saidas += 1;
      }
    });
    
    return {
      summary,
      daily_stats: Object.entries(dailyStats).map(([date, stats]) => ({
        date,
        entradas: stats.entradas,
        saidas: stats.saidas
      })),
      logs: logs || []
    };
  } catch (error: any) {
    console.error('Erro ao gerar relatório de acesso:', error.message);
    throw new Error(`Erro ao gerar relatório de acesso: ${error.message}`);
  }
}

// Criar novo usuário (administrativo)
export async function createUser(userData: Partial<User>): Promise<any> {
  try {
    // 1. Criar usuário na autenticação do Supabase
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.email?.split('@')[0] + '123', // Senha temporária
      email_confirm: true
    });
    
    if (authError) {
      console.error('Erro ao criar usuário na autenticação:', authError.message);
      throw new Error(`Erro ao criar usuário na autenticação: ${authError.message}`);
    }
    
    // 2. Inserir dados adicionais na tabela de usuários
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        id: authUser.user.id,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role_id: userData.roles?.role_name === 'ADMIN' ? 1 : (userData.roles?.role_name === 'FUNCIONARIO' ? 2 : 3),
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (userError) {
      console.error('Erro ao inserir dados do usuário:', userError.message);
      throw new Error(`Erro ao inserir dados do usuário: ${userError.message}`);
    }
    
    // 3. Inicializar saldo do usuário
    const { error: balanceError } = await supabase
      .from('user_balances')
      .insert({
        user_id: authUser.user.id,
        balance: 0,
        created_at: new Date().toISOString()
      });
    
    if (balanceError) {
      console.error('Erro ao inicializar saldo do usuário:', balanceError.message);
      // Não interrompe o fluxo, apenas loga o erro
    }
    
    return {
      success: true,
      data: user
    };
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Obter lista de usuários inadimplentes
export async function getDefaulters(): Promise<any[]> {
  try {
    const today = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('memberships')
      .select(`
        user_id,
        expires_at,
        last_payment_date,
        users (
          name,
          email,
          phone
        )
      `)
      .lt('expires_at', today)
      .eq('is_active', false);
    
    if (error) {
      console.error('Erro ao buscar inadimplentes:', error.message);
      throw new Error(`Erro ao buscar inadimplentes: ${error.message}`);
    }
    
    return data || [];
  } catch (error: any) {
    console.error('Erro ao buscar inadimplentes:', error.message);
    return [];
  }
}

// Backup dos dados (exportação)
export async function exportDatabaseBackup(): Promise<any> {
  // Esta função seria melhor implementada no backend para segurança e desempenho
  // Este é apenas um exemplo de como poderia ser feito usando funções RPC do Supabase
  
  try {
    const { data, error } = await supabase.rpc('export_database_backup');
    
    if (error) {
      console.error('Erro ao exportar backup:', error.message);
      throw new Error(`Erro ao exportar backup: ${error.message}`);
    }
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Erro ao exportar backup:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Gerenciar roles de usuários
export async function updateUserRole(userId: string, roleId: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .update({ role_id: roleId })
      .eq('id', userId);
    
    if (error) {
      console.error('Erro ao atualizar role do usuário:', error.message);
      throw new Error(`Erro ao atualizar role: ${error.message}`);
    }
    
    return true;
  } catch (error: any) {
    console.error('Erro ao atualizar role do usuário:', error.message);
    return false;
  }
} 