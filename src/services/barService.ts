import { supabase } from './supabaseClient';
import { Product, Transaction } from '../types';

// Obter saldo atual do usuário
export async function getUserBalance(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('user_balances')
    .select('balance')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Erro ao buscar saldo:', error.message);
    throw new Error(`Erro ao buscar saldo: ${error.message}`);
  }
  
  return data?.balance || 0;
}

// Adicionar saldo à conta do usuário
export async function addBalance(userId: string, amount: number, paymentMethod: string): Promise<number> {
  // Buscar saldo atual
  const currentBalance = await getUserBalance(userId);
  const newBalance = currentBalance + amount;
  
  // Atualizar saldo na tabela user_balances
  const { error } = await supabase
    .from('user_balances')
    .upsert({ 
      user_id: userId, 
      balance: newBalance,
      updated_at: new Date().toISOString()
    });
  
  if (error) {
    console.error('Erro ao adicionar saldo:', error.message);
    throw new Error(`Erro ao adicionar saldo: ${error.message}`);
  }
  
  // Registrar a transação
  const { error: transactionError } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      amount: amount,
      type: 'DEPOSITO',
      description: `Adição de saldo via ${paymentMethod}`,
      created_at: new Date().toISOString()
    });
  
  if (transactionError) {
    console.error('Erro ao registrar transação:', transactionError.message);
    throw new Error(`Erro ao registrar transação: ${transactionError.message}`);
  }
  
  return newBalance;
}

// Registrar compra de produtos e debitar o saldo
export async function registerPurchase(
  userId: string, 
  items: { productId: string; quantity: number }[]
): Promise<{ success: boolean; newBalance: number; purchase: any }> {
  // 1. Obter detalhes dos produtos
  const productIds = items.map(item => item.productId);
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, price')
    .in('id', productIds);
  
  if (productsError) {
    console.error('Erro ao buscar produtos:', productsError.message);
    throw new Error(`Erro ao buscar produtos: ${productsError.message}`);
  }
  
  // 2. Calcular valor total
  let totalAmount = 0;
  const itemsWithDetails = items.map(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) {
      throw new Error(`Produto não encontrado: ${item.productId}`);
    }
    const itemTotal = product.price * item.quantity;
    totalAmount += itemTotal;
    
    return {
      product_id: item.productId,
      product_name: product.name,
      quantity: item.quantity,
      unit_price: product.price,
      total_price: itemTotal
    };
  });
  
  // 3. Verificar saldo suficiente
  const currentBalance = await getUserBalance(userId);
  if (currentBalance < totalAmount) {
    throw new Error(`Saldo insuficiente. Saldo atual: R$ ${currentBalance.toFixed(2)}, Valor da compra: R$ ${totalAmount.toFixed(2)}`);
  }
  
  // 4. Atualizar saldo
  const newBalance = currentBalance - totalAmount;
  const { error: balanceError } = await supabase
    .from('user_balances')
    .upsert({ 
      user_id: userId, 
      balance: newBalance,
      updated_at: new Date().toISOString()
    });
  
  if (balanceError) {
    console.error('Erro ao atualizar saldo:', balanceError.message);
    throw new Error(`Erro ao atualizar saldo: ${balanceError.message}`);
  }
  
  // 5. Registrar a compra
  const { data: purchase, error: purchaseError } = await supabase
    .from('purchases')
    .insert({
      user_id: userId,
      total_amount: totalAmount,
      items: itemsWithDetails,
      created_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (purchaseError) {
    console.error('Erro ao registrar compra:', purchaseError.message);
    throw new Error(`Erro ao registrar compra: ${purchaseError.message}`);
  }
  
  // 6. Registrar a transação
  const { error: transactionError } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      amount: -totalAmount, // valor negativo para representar débito
      type: 'COMPRA',
      description: `Compra no bar - ${itemsWithDetails.length} itens`,
      created_at: new Date().toISOString(),
      reference_id: purchase.id
    });
  
  if (transactionError) {
    console.error('Erro ao registrar transação:', transactionError.message);
    throw new Error(`Erro ao registrar transação: ${transactionError.message}`);
  }
  
  return {
    success: true,
    newBalance,
    purchase
  };
}

// Obter histórico de compras do usuário
export async function getUserPurchaseHistory(userId: string, limit: number = 10): Promise<any[]> {
  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Erro ao buscar histórico de compras:', error.message);
    throw new Error(`Erro ao buscar histórico de compras: ${error.message}`);
  }
  
  return data || [];
}

// Obter produtos disponíveis para venda no bar
export async function getAvailableProducts(category?: string): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*')
    .eq('available', true);
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query.order('name');
  
  if (error) {
    console.error('Erro ao buscar produtos:', error.message);
    throw new Error(`Erro ao buscar produtos: ${error.message}`);
  }
  
  return data || [];
} 