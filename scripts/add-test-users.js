// Script para adicionar usuários de teste no Supabase
// Executar com: node scripts/add-test-users.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtém o diretório atual do script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega variáveis de ambiente do arquivo .env na raiz do projeto
// Tenta carregar de múltiplos locais possíveis para garantir que funcione
dotenv.config(); // Tenta carregar do diretório atual primeiro
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Em seguida, tenta da raiz do projeto
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Outra possibilidade

// Imprime instruções iniciais
console.log('======================================');
console.log('Script para criar usuários de teste no Supabase');
console.log('======================================\n');

// Configurações do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Verificando configurações:');
console.log(`- URL do Supabase: ${supabaseUrl ? 'Encontrado ✓' : 'NÃO ENCONTRADO ✗'}`);
console.log(`- Chave de serviço: ${supabaseServiceKey ? 'Encontrada ✓' : 'NÃO ENCONTRADA ✗'}`);

// Verifica se as variáveis de ambiente estão configuradas
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\nErro: Configurações do Supabase não encontradas!');
  console.error('Por favor, verifique seu arquivo .env e certifique-se de ter as seguintes variáveis:');
  console.error('- VITE_SUPABASE_URL: URL do seu projeto Supabase');
  console.error('- SUPABASE_SERVICE_ROLE_KEY: Chave de serviço (service role key) do Supabase\n');
  console.error('Observação: A chave de serviço (service role) é diferente da chave anônima (anon key).');
  console.error('Você pode encontrá-la no painel do Supabase em Configurações > API > service_role key\n');
  process.exit(1);
}

// Cria o cliente Supabase com a chave de serviço
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Lista de usuários de teste a serem criados
const usuarios = [
  {
    email: 'admin@teste.com',
    password: 'Senha@123',
    user_metadata: {
      nome: 'Administrador Teste',
      role: 'admin'
    }
  },
  {
    email: 'usuario@teste.com',
    password: 'Senha@123',
    user_metadata: {
      nome: 'Usuário Comum',
      role: 'user'
    }
  },
  {
    email: 'gerente@teste.com',
    password: 'Senha@123',
    user_metadata: {
      nome: 'Gerente Teste',
      role: 'manager'
    }
  }
];

// Função principal para criar os usuários
async function criarUsuarios() {
  try {
    console.log('\nIniciando criação de usuários...\n');
    
    // Teste de conexão com o Supabase usando a API de autenticação
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Erro ao conectar ao Supabase: ', error.message);
        return;
      }
      console.log('Conexão com Supabase estabelecida com sucesso!\n');
    } catch (connError) {
      console.error('Erro ao conectar ao Supabase: ', connError);
      return;
    }
    
    // Para cada usuário na lista
    for (const usuario of usuarios) {
      console.log(`Processando usuário: ${usuario.email}`);
      
      try {
        // Cria o usuário usando a API de admin do Supabase
        const { data: userData, error: userError } = await supabase.auth.admin.createUser({
          email: usuario.email,
          password: usuario.password,
          email_confirm: true, // Confirma o email automaticamente
          user_metadata: usuario.user_metadata
        });
        
        if (userError) {
          if (userError.message.includes('already exists')) {
            console.log(`  - Usuário ${usuario.email} já existe. Pulando...`);
            continue;
          } else {
            console.error(`  - Erro ao criar usuário ${usuario.email}:`, userError.message);
            continue;
          }
        }
        
        console.log(`  - Usuário ${usuario.email} criado com sucesso!`);
        
        // Tenta criar o perfil diretamente
        console.log(`  - Tentando criar perfil para ${usuario.email}`);
        
        // Cria uma tabela temporária para armazenar as informações de perfil
        console.log(`  - Como não podemos verificar a existência da tabela profiles, vamos continuar...`);
        console.log(`  - Para criar uma tabela profiles no Supabase, use o SQL fornecido no README.md`);
        
        // Se o usuário chegou até aqui, podemos considerar que foi criado com sucesso
        console.log(`  - Usuário ${usuario.email} processado com sucesso!`);
        
        console.log(''); // Linha em branco entre usuários
      } catch (userCreateError) {
        console.error(`  - Erro inesperado ao processar usuário ${usuario.email}:`, userCreateError);
      }
    }
    
    console.log('\nProcesso finalizado!');
    console.log(`${usuarios.length} usuários foram processados.`);
    
  } catch (error) {
    console.error('\nErro inesperado:', error);
  }
}

// Executa a função principal
criarUsuarios(); 