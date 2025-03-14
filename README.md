# Clube App - Conexão com Supabase

Este projeto implementa a integração com o Supabase para gerenciar o banco de dados do sistema de gerenciamento do clube.

## Pré-requisitos

- Node.js (versão 14+)
- NPM ou Yarn
- Um projeto criado no Supabase (https://supabase.com)

## Configuração do Projeto

### 1. Instalar Dependências

```bash
npm install
# ou
yarn
```

### 2. Configurar Variáveis de Ambiente

Renomeie o arquivo `.env.local` para `.env` e preencha com suas credenciais do Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-public
```

Para obter estas credenciais:
1. Acesse o painel administrativo do Supabase
2. Clique em "Project Settings" (Configurações do Projeto)
3. Navegue até a seção "API"
4. Copie a "URL" e a "anon key" para suas variáveis de ambiente

### 3. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

## Estrutura do Projeto

- `/src/lib/supabaseClient.js` - Cliente do Supabase para conexão com o banco de dados
- `/src/services/` - Serviços para interagir com as tabelas do banco de dados
- `/src/contexts/AuthContext.jsx` - Contexto de autenticação para gerenciar login/logout
- `/src/types/` - Definições de tipos TypeScript para as tabelas
- `/src/components/` - Componentes React, incluindo um exemplo de login

## Como Usar

### Autenticação

```javascript
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  
  const handleLogin = async (email, password) => {
    const { success } = await login(email, password);
    if (success) {
      // Usuário autenticado com sucesso
    }
  };
  
  // ...
};
```

### Consulta de Dados

```javascript
import supabase from '../lib/supabaseClient';

const buscarProdutos = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');
    
  if (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
  
  return data;
};
```

### Inserção de Dados

```javascript
import supabase from '../lib/supabaseClient';

const criarReserva = async (reserva) => {
  const { data, error } = await supabase
    .from('area_reservations')
    .insert([
      {
        area_id: reserva.areaId,
        user_id: reserva.userId,
        start_time: reserva.startTime,
        end_time: reserva.endTime,
        status: 'RESERVED'
      }
    ])
    .select();
    
  if (error) {
    console.error('Erro ao criar reserva:', error);
    return null;
  }
  
  return data[0];
};
```

## Documentação Adicional

- [Documentação do Supabase](https://supabase.com/docs)
- [API do Supabase JS](https://supabase.com/docs/reference/javascript/introduction)
- [Autenticação do Supabase](https://supabase.com/docs/guides/auth) 