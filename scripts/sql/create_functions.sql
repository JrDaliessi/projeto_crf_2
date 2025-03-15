-- Função para criar a tabela profiles e suas políticas de segurança
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
    
  -- Permite que usuários atualizem seus próprios perfis
  CREATE POLICY "Usuários podem atualizar seus próprios perfis"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);
    
  -- Permite que administradores atualizem qualquer perfil
  CREATE POLICY "Admins podem atualizar qualquer perfil"
    ON public.profiles
    FOR UPDATE
    USING (auth.jwt() ->> 'role' = 'admin');
    
  RAISE NOTICE 'Tabela profiles criada ou já existente com sucesso!';
END;
$$;

-- Função para verificar e adicionar funções de autenticação básicas
CREATE OR REPLACE FUNCTION setup_auth_functions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Função para verificar se um usuário é administrador
  CREATE OR REPLACE FUNCTION is_admin()
  RETURNS boolean
  LANGUAGE sql
  SECURITY DEFINER
  AS $$
    SELECT (auth.jwt() ->> 'role')::text = 'admin';
  $$;

  -- Função para obter o ID do usuário atual
  CREATE OR REPLACE FUNCTION current_user_id()
  RETURNS uuid
  LANGUAGE sql
  SECURITY DEFINER
  AS $$
    SELECT auth.uid();
  $$;
  
  RAISE NOTICE 'Funções de autenticação configuradas com sucesso!';
END;
$$; 