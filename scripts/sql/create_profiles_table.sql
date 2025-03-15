-- Criar a tabela de perfis para armazenar informações adicionais dos usuários
CREATE TABLE IF NOT EXISTS public.perfis (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('ADMIN', 'FUNCIONARIO', 'ASSOCIADO')),
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adiciona índice para melhorar a performance das consultas por user_id
CREATE INDEX IF NOT EXISTS idx_perfis_user_id ON public.perfis(user_id);

-- Adiciona políticas de segurança RLS (Row Level Security)
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;

-- Qualquer usuário pode ver seu próprio perfil
CREATE POLICY "Usuários podem ver seus próprios perfis"
ON public.perfis
FOR SELECT
USING (auth.uid() = user_id);

-- Administradores podem ver todos os perfis
CREATE POLICY "Administradores podem ver todos os perfis"
ON public.perfis
FOR SELECT
USING ((SELECT tipo FROM public.perfis WHERE user_id = auth.uid()) = 'ADMIN');

-- Usuários podem atualizar apenas seus próprios perfis
CREATE POLICY "Usuários podem atualizar seus próprios perfis"
ON public.perfis
FOR UPDATE
USING (auth.uid() = user_id);

-- Administradores podem atualizar todos os perfis
CREATE POLICY "Administradores podem atualizar todos os perfis"
ON public.perfis
FOR UPDATE
USING ((SELECT tipo FROM public.perfis WHERE user_id = auth.uid()) = 'ADMIN');

-- Adicionar dados iniciais para os usuários de teste já criados

-- Adicionar perfil para admin@teste.com (substitua o ID pelo correto)
INSERT INTO public.perfis (user_id, nome, tipo, telefone)
SELECT id, 'Administrador Teste', 'ADMIN', '(11) 99999-9999'
FROM auth.users 
WHERE email = 'admin@teste.com'
ON CONFLICT (id) DO NOTHING;

-- Adicionar perfil para usuario@teste.com
INSERT INTO public.perfis (user_id, nome, tipo, telefone)
SELECT id, 'Usuário Comum', 'ASSOCIADO', '(11) 88888-8888'
FROM auth.users 
WHERE email = 'usuario@teste.com'
ON CONFLICT (id) DO NOTHING;

-- Adicionar perfil para gerente@teste.com
INSERT INTO public.perfis (user_id, nome, tipo, telefone)
SELECT id, 'Gerente Teste', 'FUNCIONARIO', '(11) 77777-7777'
FROM auth.users 
WHERE email = 'gerente@teste.com'
ON CONFLICT (id) DO NOTHING; 