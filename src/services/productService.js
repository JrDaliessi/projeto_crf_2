import supabase from '../lib/supabaseClient';

/**
 * Busca todos os produtos ativos
 * @returns {Promise<Object>} Lista de produtos
 */
export const getActiveProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('name');
      
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar produtos:', error.message);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Busca todos os produtos (ativos e inativos)
 * @returns {Promise<Object>} Lista de produtos
 */
export const getAllProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
      
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar produtos:', error.message);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Busca um produto pelo ID
 * @param {string} id ID do produto
 * @returns {Promise<Object>} Dados do produto
 */
export const getProductById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error(`Erro ao buscar produto com ID ${id}:`, error.message);
    return { success: false, error: error.message, data: null };
  }
};

/**
 * Cria um novo produto
 * @param {Object} product Dados do produto
 * @returns {Promise<Object>} Produto criado
 */
export const createProduct = async (product) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name: product.name,
          description: product.description,
          price: product.price,
          is_active: product.isActive !== undefined ? product.isActive : true
        }
      ])
      .select();
      
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Erro ao criar produto:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Atualiza um produto existente
 * @param {string} id ID do produto
 * @param {Object} updates Atualizações a serem feitas
 * @returns {Promise<Object>} Produto atualizado
 */
export const updateProduct = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: updates.name,
        description: updates.description,
        price: updates.price,
        is_active: updates.isActive,
        updated_at: new Date()
      })
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error(`Erro ao atualizar produto com ID ${id}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Define um produto como ativo ou inativo (sem excluir)
 * @param {string} id ID do produto
 * @param {boolean} isActive Status de ativação
 * @returns {Promise<Object>} Resultado da operação
 */
export const toggleProductStatus = async (id, isActive) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ 
        is_active: isActive,
        updated_at: new Date()
      })
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error(`Erro ao alterar status do produto com ID ${id}:`, error.message);
    return { success: false, error: error.message };
  }
}; 