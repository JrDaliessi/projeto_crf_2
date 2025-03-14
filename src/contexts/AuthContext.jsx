import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, signIn, signOut } from '../services/authService';
import supabase from '../lib/supabaseClient';

// Criando o contexto
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar usuário na inicialização
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const { success, user: userData, error } = await getCurrentUser();
      
      if (success && userData) {
        setUser(userData);
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
          if (success) setUser(userData);
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
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    const { success, data, error } = await signIn(email, password);
    
    if (success) {
      const { success: userSuccess, user: userData } = await getCurrentUser();
      if (userSuccess) setUser(userData);
    } else {
      setError(error);
    }
    
    setIsLoading(false);
    return { success };
  };

  // Função de logout
  const logout = async () => {
    setIsLoading(true);
    const { success, error } = await signOut();
    
    if (success) {
      setUser(null);
    } else {
      setError(error);
    }
    
    setIsLoading(false);
    return { success };
  };

  // Verificar se o usuário tem determinado perfil
  const hasRole = (roleName) => {
    if (!user || !user.roles) return false;
    return user.roles.role_name === roleName;
  };

  const isAdmin = () => hasRole('ADMIN');
  const isEmployee = () => hasRole('FUNCIONARIO');
  const isAssociate = () => hasRole('ASSOCIADO');

  const value = {
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
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 