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
    console.log(`Tentando login para ${email}`);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Erro no Supabase login:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data?.user) {
      console.error('Login sem erro, mas sem dados de usuário');
      return {
        success: false,
        error: 'Credenciais inválidas',
      };
    }

    console.log(`Login bem-sucedido para ${email}`);
    
    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error('Exceção ao fazer login:', err);
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
      console.error('Erro ao fazer logout:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (err) {
    console.error('Exceção ao fazer logout:', err);
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
      console.log('Sem sessão ativa ou erro de sessão:', sessionError?.message);
      return {
        success: false,
        error: sessionError?.message || 'Sem sessão ativa',
      };
    }

    // Obter dados do usuário
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      console.error('Erro ao obter usuário ou usuário não encontrado:', error?.message);
      return {
        success: false,
        error: error?.message || 'Usuário não encontrado',
      };
    }

    console.log('Usuário autenticado:', data.user.email);

    // Buscar informações adicionais do usuário (role, etc.) da tabela de perfis
    const { data: profileData, error: profileError } = await supabase
      .from('perfis')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      // PGRST116 é o código para "nenhum resultado encontrado"
      console.error('Erro ao buscar perfil:', profileError);
    }

    let role = 'ASSOCIADO'; // Perfil padrão
    let userName = data.user.user_metadata?.name || data.user.email?.split('@')[0];

    if (profileData) {
      role = profileData.tipo;
      userName = profileData.nome;
      console.log('Perfil encontrado:', { role, userName });
    } else {
      console.warn('Nenhum perfil encontrado para o usuário. Usando valores padrão.');
      
      // Tenta criar um perfil básico se não existir
      try {
        const { error: insertError } = await supabase.from('perfis').insert([
          {
            user_id: data.user.id,
            nome: userName,
            tipo: role,
          },
        ]);
        
        if (insertError) {
          console.error('Erro ao criar perfil básico:', insertError);
        } else {
          console.log('Perfil básico criado com sucesso');
        }
      } catch (e) {
        console.error('Exceção ao tentar criar perfil básico:', e);
      }
    }

    // Montar objeto de usuário completo
    const userData: User = {
      id: data.user.id,
      email: data.user.email!,
      name: userName,
      roles: {
        role_name: role as 'ADMIN' | 'FUNCIONARIO' | 'ASSOCIADO',
      },
      avatar_url: data.user.user_metadata?.avatar_url,
      created_at: data.user.created_at,
    };

    return {
      success: true,
      user: userData,
    };
  } catch (err) {
    console.error('Exceção ao obter usuário atual:', err);
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
    console.log('Tentando registrar novo usuário:', email);
    
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
      console.error('Erro ao registrar usuário:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    // Se o registro foi bem-sucedido e temos um usuário
    if (data.user) {
      console.log('Usuário registrado com sucesso. Criando perfil...');
      
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
      } else {
        console.log('Perfil criado com sucesso');
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
    console.error('Exceção ao registrar usuário:', err);
    return {
      success: false,
      error: 'Erro ao registrar usuário',
    };
  }
}; 