import supabase from '../lib/supabaseClient';
import { User } from '../types';

interface AuthResponse {
  success: boolean;
  user?: User;
  data?: any;
  error?: string;
}

/**
 * Realiza o login de um usuário
 * @param email Email do usuário
 * @param password Senha do usuário
 * @returns Resposta com status de sucesso, dados do usuário ou erro
 */
export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    return {
      success: false,
      error: 'Erro ao realizar autenticação',
    };
  }
};

/**
 * Realiza o logout do usuário atual
 * @returns Resposta com status de sucesso ou erro
 */
export const signOut = async (): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (err) {
    console.error('Erro ao fazer logout:', err);
    return {
      success: false,
      error: 'Erro ao realizar logout',
    };
  }
};

/**
 * Obtém os dados do usuário atualmente autenticado
 * @returns Resposta com dados do usuário ou erro
 */
export const getCurrentUser = async (): Promise<AuthResponse> => {
  try {
    // Obter a sessão atual
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !sessionData?.session) {
      return {
        success: false,
        error: sessionError?.message || 'Sem sessão ativa',
      };
    }

    // Obter dados do usuário
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return {
        success: false,
        error: error?.message || 'Usuário não encontrado',
      };
    }

    // Buscar informações adicionais do usuário (role, etc.) da tabela de perfis
    const { data: profileData, error: profileError } = await supabase
      .from('perfis')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (profileError) {
      console.error('Erro ao buscar perfil:', profileError);
    }

    // Montar objeto de usuário completo
    const userData: User = {
      id: data.user.id,
      email: data.user.email!,
      name: profileData?.nome || data.user.user_metadata?.name,
      roles: {
        role_name: profileData?.tipo || 'ASSOCIADO', // Default para associado
      },
      avatar_url: data.user.user_metadata?.avatar_url,
      created_at: data.user.created_at,
    };

    return {
      success: true,
      user: userData,
    };
  } catch (err) {
    console.error('Erro ao obter usuário atual:', err);
    return {
      success: false,
      error: 'Erro ao obter dados do usuário',
    };
  }
};

/**
 * Registra um novo usuário
 * @param email Email do usuário
 * @param password Senha do usuário
 * @param userData Dados adicionais do usuário
 * @returns Resposta com status de sucesso, dados do usuário ou erro
 */
export const registerUser = async (
  email: string,
  password: string,
  userData: {
    name: string;
    role?: 'ADMIN' | 'FUNCIONARIO' | 'ASSOCIADO';
    phone?: string;
  }
): Promise<AuthResponse> => {
  try {
    // Registrar no Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          phone: userData.phone,
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Se o registro foi bem-sucedido e temos um usuário
    if (data.user) {
      // Criar perfil na tabela de perfis
      const { error: profileError } = await supabase.from('perfis').insert([
        {
          user_id: data.user.id,
          nome: userData.name,
          tipo: userData.role || 'ASSOCIADO',
          telefone: userData.phone,
        },
      ]);

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        // Continuar mesmo com erro no perfil, já que o usuário foi criado
      }

      return {
        success: true,
        data,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error('Erro ao registrar usuário:', err);
    return {
      success: false,
      error: 'Erro ao registrar usuário',
    };
  }
}; 