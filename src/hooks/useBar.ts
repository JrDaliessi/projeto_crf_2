import { useState, useEffect, useCallback } from 'react';
import { 
  getUserBalance, 
  addBalance, 
  registerPurchase, 
  getUserPurchaseHistory,
  getAvailableProducts
} from '../services/barService';
import { Product } from '../types';

// Hook para gerenciar saldo e operações do bar
export function useBar(userId: string) {
  const [balance, setBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  
  const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  
  // Buscar saldo do usuário
  const fetchBalance = useCallback(async () => {
    if (!userId) return;
    
    setIsLoadingBalance(true);
    setBalanceError(null);
    
    try {
      const balance = await getUserBalance(userId);
      setBalance(balance);
    } catch (error: any) {
      setBalanceError(error.message);
      console.error('Erro ao buscar saldo:', error);
    } finally {
      setIsLoadingBalance(false);
    }
  }, [userId]);
  
  // Adicionar saldo
  const handleAddBalance = useCallback(async (amount: number, paymentMethod: string) => {
    if (!userId) return;
    
    setIsLoadingBalance(true);
    setBalanceError(null);
    
    try {
      const newBalance = await addBalance(userId, amount, paymentMethod);
      setBalance(newBalance);
      return { success: true, newBalance };
    } catch (error: any) {
      setBalanceError(error.message);
      console.error('Erro ao adicionar saldo:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoadingBalance(false);
    }
  }, [userId]);
  
  // Registrar compra
  const handlePurchase = useCallback(async (items: { productId: string; quantity: number }[]) => {
    if (!userId || items.length === 0) return;
    
    setIsLoadingBalance(true);
    
    try {
      const result = await registerPurchase(userId, items);
      if (result.success) {
        setBalance(result.newBalance);
        await fetchBalance(); // Atualiza o saldo
        await fetchPurchaseHistory(); // Atualiza o histórico
        return { success: true, newBalance: result.newBalance };
      }
    } catch (error: any) {
      setBalanceError(error.message);
      console.error('Erro ao registrar compra:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoadingBalance(false);
    }
  }, [userId, fetchBalance]);
  
  // Buscar histórico de compras
  const fetchPurchaseHistory = useCallback(async (limit: number = 10) => {
    if (!userId) return;
    
    setIsLoadingHistory(true);
    setHistoryError(null);
    
    try {
      const history = await getUserPurchaseHistory(userId, limit);
      setPurchaseHistory(history);
    } catch (error: any) {
      setHistoryError(error.message);
      console.error('Erro ao buscar histórico de compras:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [userId]);
  
  // Buscar produtos disponíveis
  const fetchProducts = useCallback(async (category?: string) => {
    setIsLoadingProducts(true);
    setProductsError(null);
    
    try {
      const products = await getAvailableProducts(category);
      setProducts(products);
    } catch (error: any) {
      setProductsError(error.message);
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);
  
  // Carregar saldo e histórico ao inicializar
  useEffect(() => {
    if (userId) {
      fetchBalance();
      fetchPurchaseHistory();
      fetchProducts();
    }
  }, [userId, fetchBalance, fetchPurchaseHistory, fetchProducts]);
  
  return {
    // Saldo
    balance,
    isLoadingBalance,
    balanceError,
    fetchBalance,
    handleAddBalance,
    
    // Produtos
    products,
    isLoadingProducts,
    productsError,
    fetchProducts,
    
    // Compras
    purchaseHistory,
    isLoadingHistory,
    historyError,
    fetchPurchaseHistory,
    handlePurchase
  };
} 