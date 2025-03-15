# Scripts para Supabase

Este diretório contém scripts úteis para gerenciar dados no Supabase.

## Script de Adição de Usuários de Teste

O script `add-test-users.js` permite adicionar usuários de teste ao Supabase facilmente.

### Pré-requisitos

1. Acesso ao painel administrativo do Supabase
2. Chave de serviço (service role key) do Supabase

### Configuração

1. **Configure as variáveis de ambiente**

   Abra o arquivo `.env` na raiz do projeto e adicione sua chave de serviço:

   ```
   SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_aqui
   ```

   > **Importante**: A chave de serviço (service role key) é diferente da chave anônima (anon key). 
   > Você pode encontrá-la no painel do Supabase em: Configurações > API > service_role key

2. **Crie a tabela de profiles (opcional)**

   Se você ainda não tem uma tabela `profiles` no seu banco de dados, o script tentará criá-la automaticamente. Para isso funcionar, crie uma função SQL no Supabase:

   a. Acesse o painel do Supabase e vá para "SQL Editor"
   b. Crie uma nova função "create_profiles_table" com o seguinte SQL:

   ```sql
   CREATE OR REPLACE FUNCTION create_profiles_table()
   RETURNS void
   LANGUAGE plpgsql
   SECURITY DEFINER
   AS $$
   BEGIN
     -- Cria a tabela profiles se não existir
     CREATE TABLE IF NOT EXISTS public.profiles (
       id UUID PRIMARY KEY REFERENCES auth.users(id),
       nome TEXT,
       role TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
     );

     -- Adiciona políticas de segurança para a tabela
     ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

     -- Permite que usuários vejam seus próprios perfis
     CREATE POLICY "Usuários podem ver seus próprios perfis"
       ON public.profiles
       FOR SELECT
       USING (auth.uid() = id);

     -- Permite que administradores vejam todos os perfis
     CREATE POLICY "Admins podem ver todos os perfis"
       ON public.profiles
       FOR SELECT
       USING (auth.jwt() ->> 'role' = 'admin');
   END;
   $$;
   ```

3. **Instale as dependências**

   ```bash
   # Na pasta scripts
   npm install
   ```

### Uso

Execute o script com:

```bash
# Na pasta scripts
npm run add-users
```

Ou diretamente com Node:

```bash
# Na raiz do projeto 
node scripts/add-test-users.js
```

### Problemas Comuns

**Erro: "Cannot find module '@supabase/supabase-js'"**

Se você encontrar este erro, instale as dependências do script:

```bash
cd scripts
npm install
```

**Erro: "Função create_profiles_table não existe"**

Este erro ocorre quando você não criou a função SQL no Supabase. Siga o passo 2 da seção de Configuração.

**Erro: "Configurações do Supabase não encontradas"**

Verifique se as variáveis de ambiente estão corretas no arquivo `.env`. Execute o script a partir da raiz do projeto ou da pasta `scripts`.

### Usuários Criados

O script criará os seguintes usuários:

1. **Administrador**
   - Email: admin@teste.com
   - Senha: Senha@123
   - Perfil: admin

2. **Usuário Comum**
   - Email: usuario@teste.com
   - Senha: Senha@123
   - Perfil: user

3. **Gerente**
   - Email: gerente@teste.com
   - Senha: Senha@123
   - Perfil: manager

### Personalização

Para adicionar ou modificar usuários, edite a lista `usuarios` no arquivo `add-test-users.js`. 