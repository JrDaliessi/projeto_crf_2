import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import supabase from '../lib/supabaseClient';
import { useAuth } from './AuthContext';
import { User } from '../types';

// Interface para dados do perfil do usuário
export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  memberSince?: string;
  membershipStatus?: 'ATIVO' | 'INATIVO' | 'PENDENTE';
  balance: number;
  preferences?: {
    notifications?: boolean;
    theme?: 'light' | 'dark';
    language?: string;
  };
}

// Interface para o contexto do usuário
export interface UserContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updatePreferences: (preferences: Partial<UserProfile['preferences']>) => Promise<boolean>;
  addBalance: (amount: number, description: string) => Promise<boolean>;
  getTransactionHistory: () => Promise<any[]>;
}

// Props para o provider
interface UserProviderProps {
  children: ReactNode;
}

// Criando o contexto
const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar perfil do usuário quando autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserProfile();
    } else {
      setProfile(null);
    }
  }, [isAuthenticated, user]);

  // Buscar perfil do usuário
  const fetchUserProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Buscar dados do perfil na tabela perfis
      const { data, error } = await supabase
        .from('perfis')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      // Buscar saldo do usuário
      const { data: balanceData, error: balanceError } = await supabase
        .from('saldos')
        .select('valor')
        .eq('user_id', user.id)
        .single();
      
      if (balanceError && balanceError.code !== 'PGRST116') {
        // PGRST116 é o código para "nenhum resultado encontrado"
        console.error('Erro ao buscar saldo:', balanceError);
      }
      
      // Montar objeto de perfil
      const userProfile: UserProfile = {
        id: data.id,
        userId: data.user_id,
        name: data.nome || user.name || '',
        phone: data.telefone,
        address: data.endereco,
        birthDate: data.data_nascimento,
        memberSince: data.data_associacao,
        membershipStatus: data.status || 'ATIVO',
        balance: balanceData?.valor || 0,
        preferences: data.preferencias || {
          notifications: true,
          theme: 'light',
          language: 'pt-BR',
        },
      };
      
      setProfile(userProfile);
    } catch (err: any) {
      console.error('Erro ao buscar perfil:', err);
      setError(err.message || 'Erro ao buscar dados do perfil');
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar perfil do usuário
  const updateProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    if (!user || !profile) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('perfis')
        .update({
          nome: data.name,
          telefone: data.phone,
          endereco: data.address,
          data_nascimento: data.birthDate,
          status: data.membershipStatus,
          // Não atualizamos o saldo aqui, isso é feito em transações separadas
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Atualizar estado local
      setProfile(prev => prev ? { ...prev, ...data } : null);
      
      return true;
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err);
      setError(err.message || 'Erro ao atualizar perfil');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar preferências do usuário
  const updatePreferences = async (preferences: Partial<UserProfile['preferences']>): Promise<boolean> => {
    if (!user || !profile) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Mesclar preferências existentes com as novas
      const updatedPreferences = {
        ...profile.preferences,
        ...preferences,
      };
      
      const { error } = await supabase
        .from('perfis')
        .update({
          preferencias: updatedPreferences,
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Atualizar estado local
      setProfile(prev => prev ? {
        ...prev,
        preferences: updatedPreferences,
      } : null);
      
      return true;
    } catch (err: any) {
      console.error('Erro ao atualizar preferências:', err);
      setError(err.message || 'Erro ao atualizar preferências');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Adicionar saldo ao usuário
  const addBalance = async (amount: number, description: string): Promise<boolean> => {
    if (!user || !profile) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Iniciar transação
      const { data: transactionData, error: transactionError } = await supabase
        .from('transacoes')
        .insert({
          user_id: user.id,
          valor: amount,
          tipo: amount > 0 ? 'DEPOSITO' : 'COMPRA',
          descricao: description,
        })
        .select()
        .single();
      
      if (transactionError) throw transactionError;
      
      // Atualizar saldo
      const newBalance = profile.balance + amount;
      
      const { error: balanceError } = await supabase
        .from('saldos')
        .upsert({
          user_id: user.id,
          valor: newBalance,
        });
      
      if (balanceError) throw balanceError;
      
      // Atualizar estado local
      setProfile(prev => prev ? {
        ...prev,
        balance: newBalance,
      } : null);
      
      return true;
    } catch (err: any) {
      console.error('Erro ao adicionar saldo:', err);
      setError(err.message || 'Erro ao processar transação');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Obter histórico de transações
  const getTransactionHistory = async (): Promise<any[]> => {
    if (!user) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('transacoes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (err: any) {
      console.error('Erro ao buscar histórico de transações:', err);
      setError(err.message || 'Erro ao buscar histórico');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const value: UserContextType = {
    profile,
    isLoading,
    error,
    updateProfile,
    updatePreferences,
    addBalance,
    getTransactionHistory,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Hook personalizado para usar o contexto
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
}; 