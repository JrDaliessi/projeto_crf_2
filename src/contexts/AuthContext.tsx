import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { getCurrentUser, signIn, signOut } from '../services/authService';
import supabase from '../lib/supabaseClient';
import { User } from '../types';

// Interface para o contexto de autenticação
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean }>;
  logout: () => Promise<{ success: boolean }>;
  isAuthenticated: boolean;
  isAdmin: () => boolean;
  isEmployee: () => boolean;
  isAssociate: () => boolean;
}

// Criando o contexto
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar usuário na inicialização
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const { success, user: userData, error } = await getCurrentUser();
      
      if (success && userData) {
        setUser(userData as User);
      } else {
        setUser(null);
        if (error) setError(error);
      }
      
      setIsLoading(false);
    };

    fetchUser();

    // Configurar listener para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { success, user: userData } = await getCurrentUser();
          if (success) setUser(userData as User);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Limpar listener ao desmontar
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Função de login
  const login = async (email: string, password: string): Promise<{ success: boolean }> => {
    setIsLoading(true);
    setError(null);
    
    const { success, data, error } = await signIn(email, password);
    
    if (success) {
      const { success: userSuccess, user: userData } = await getCurrentUser();
      if (userSuccess) setUser(userData as User);
    } else {
      setError(error || 'Erro ao fazer login');
    }
    
    setIsLoading(false);
    return { success };
  };

  // Função de logout
  const logout = async (): Promise<{ success: boolean }> => {
    setIsLoading(true);
    const { success, error } = await signOut();
    
    if (success) {
      setUser(null);
    } else {
      setError(error || 'Erro ao fazer logout');
    }
    
    setIsLoading(false);
    return { success };
  };

  // Verificar se o usuário tem determinado perfil
  const hasRole = (roleName: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.role_name === roleName;
  };

  const isAdmin = (): boolean => hasRole('ADMIN');
  const isEmployee = (): boolean => hasRole('FUNCIONARIO');
  const isAssociate = (): boolean => hasRole('ASSOCIADO');

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin,
    isEmployee,
    isAssociate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar o contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 