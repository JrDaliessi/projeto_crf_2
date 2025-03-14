import supabase from '../lib/supabaseClient';

/**
 * Registra um novo usuário no sistema
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @param {Object} userData - Dados adicionais do usuário
 * @returns {Promise<Object>} - Resultado da operação
 */
export const registerUser = async (email, password, userData) => {
  try {
    // 1. Registrar o usuário no sistema de autenticação
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) throw authError;
    
    // 2. Inserir os dados complementares na tabela users
    if (authData?.user) {
      const { data, error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            full_name: userData.fullName,
            email: email,
            role_id: userData.roleId,
            phone: userData.phone,
            membership_title: userData.membershipTitle,
            is_active: true
          }
        ])
        .select();
        
      if (profileError) throw profileError;
      return { success: true, data };
    }
    
    return { success: false, error: 'Erro ao criar usuário' };
  } catch (error) {
    console.error('Erro ao registrar usuário:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Realiza login do usuário
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise<Object>} - Dados do usuário logado
 */
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao fazer login:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Realiza logout do usuário
 * @returns {Promise<Object>} - Resultado da operação
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Erro ao fazer logout:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Recupera o usuário atualmente logado
 * @returns {Promise<Object>} - Dados do usuário atual
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    if (user) {
      // Buscar os dados completos do usuário na tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*, roles(role_name)')
        .eq('id', user.id)
        .single();
        
      if (userError) throw userError;
      
      return { success: true, user: userData };
    }
    
    return { success: false, user: null };
  } catch (error) {
    console.error('Erro ao recuperar usuário atual:', error.message);
    return { success: false, error: error.message, user: null };
  }
};

/**
 * Atualiza a senha do usuário
 * @param {string} password - Nova senha
 * @returns {Promise<Object>} - Resultado da operação
 */
export const updatePassword = async (password) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password
    });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar senha:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Envia email para recuperação de senha
 * @param {string} email - Email do usuário
 * @returns {Promise<Object>} - Resultado da operação
 */
export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Erro ao solicitar redefinição de senha:', error.message);
    return { success: false, error: error.message };
  }
}; 