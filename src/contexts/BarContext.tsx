import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import supabase from '../lib/supabaseClient';
import { useAuth } from './AuthContext';
import { useUser } from './UserContext';
import { Product } from '../types';

// Interface para carrinho de compras
export interface CartItem {
  product: Product;
  quantity: number;
}

// Interface para o contexto do Bar
export interface BarContextType {
  products: Product[];
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: (category?: string) => Promise<void>;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: () => Promise<boolean>;
  totalCartValue: number;
}

// Props para o provider
interface BarProviderProps {
  children: ReactNode;
}

// Criando o contexto
const BarContext = createContext<BarContextType | null>(null);

export const BarProvider: React.FC<BarProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { profile, addBalance } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Calcular valor total do carrinho
  const totalCartValue = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // Carregar produtos quando o componente montar
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  // Buscar produtos disponíveis
  const fetchProducts = async (category?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('produtos')
        .select('*')
        .eq('disponivel', true);
      
      // Filtrar por categoria se especificada
      if (category) {
        query = query.eq('categoria', category);
      }
      
      const { data, error } = await query.order('nome');
      
      if (error) throw error;
      
      // Mapear dados para o formato da interface Product
      const productList: Product[] = data.map((item: any) => ({
        id: item.id,
        name: item.nome,
        description: item.descricao,
        price: item.preco,
        category: item.categoria,
        available: item.disponivel,
        image: item.imagem,
      }));
      
      setProducts(productList);
    } catch (err: any) {
      console.error('Erro ao buscar produtos:', err);
      setError(err.message || 'Erro ao buscar produtos');
    } finally {
      setIsLoading(false);
    }
  };

  // Adicionar produto ao carrinho
  const addToCart = (product: Product, quantity: number = 1): void => {
    setCart(prevCart => {
      // Verificar se o produto já está no carrinho
      const existingItemIndex = prevCart.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Atualizar quantidade se já existir
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Adicionar novo item se não existir
        return [...prevCart, { product, quantity }];
      }
    });
  };

  // Remover produto do carrinho
  const removeFromCart = (productId: string): void => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  // Atualizar quantidade de um item no carrinho
  const updateCartItemQuantity = (productId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.product.id === productId) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  // Limpar carrinho
  const clearCart = (): void => {
    setCart([]);
  };

  // Finalizar compra
  const checkout = async (): Promise<boolean> => {
    if (!user || !profile || cart.length === 0) return false;
    
    // Verificar se o usuário tem saldo suficiente
    if (profile.balance < totalCartValue) {
      setError('Saldo insuficiente para concluir a compra');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Criar descrição da compra
      const description = cart.map(item => 
        `${item.quantity}x ${item.product.name}`
      ).join(', ');
      
      // Registrar transação (valor negativo para compra)
      const success = await addBalance(-totalCartValue, `Compra: ${description}`);
      
      if (!success) {
        throw new Error('Erro ao processar pagamento');
      }
      
      // Registrar itens comprados
      const { error } = await supabase
        .from('compras_itens')
        .insert(
          cart.map(item => ({
            user_id: user.id,
            produto_id: item.product.id,
            quantidade: item.quantity,
            valor_unitario: item.product.price,
            valor_total: item.product.price * item.quantity,
          }))
        );
      
      if (error) throw error;
      
      // Limpar carrinho após compra bem-sucedida
      clearCart();
      
      return true;
    } catch (err: any) {
      console.error('Erro ao finalizar compra:', err);
      setError(err.message || 'Erro ao finalizar compra');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: BarContextType = {
    products,
    cart,
    isLoading,
    error,
    fetchProducts,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    checkout,
    totalCartValue,
  };

  return <BarContext.Provider value={value}>{children}</BarContext.Provider>;
};

// Hook personalizado para usar o contexto
export const useBar = (): BarContextType => {
  const context = useContext(BarContext);
  if (!context) {
    throw new Error('useBar deve ser usado dentro de um BarProvider');
  }
  return context;
}; 