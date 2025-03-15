# Estrutura do Banco de Dados

## Visão Geral

O sistema utiliza o Supabase como plataforma de banco de dados, que é baseado em PostgreSQL. A estrutura do banco foi projetada para atender às necessidades de um clube com foco em reservas, controle financeiro e gestão de associados.

## Principais Tabelas

### users
- Armazena informações de todos os usuários do sistema
- Integrada com a autenticação do Supabase
- Campos principais: id, email, full_name, role, phone, created_at, updated_at

### profiles
- Estende as informações de usuários com dados adicionais
- Campos principais: id, user_id, address, document_number, birth_date, profile_picture_url

### memberships
- Registra a associação dos usuários ao clube
- Campos principais: id, user_id, membership_type, status, start_date, end_date, monthly_fee

### transactions
- Registra todas as transações financeiras
- Campos principais: id, user_id, amount, type, status, description, payment_method, created_at

### balances
- Mantém o saldo atual de cada usuário
- Campos principais: id, user_id, amount, last_updated

### areas
- Cataloga áreas reserváveis do clube (churrasqueiras, salões, etc.)
- Campos principais: id, name, description, capacity, price, image_url, is_active

### area_reservations
- Registra reservas de áreas pelos usuários
- Campos principais: id, area_id, user_id, start_time, end_time, status, total_price, created_at

### events
- Armazena eventos organizados pelo clube
- Campos principais: id, name, description, start_date, end_date, capacity, price, location, created_by

### event_registrations
- Registra inscrições de usuários em eventos
- Campos principais: id, event_id, user_id, status, payment_status, created_at

## Relacionamentos

- Um usuário (users) pode ter um perfil (profiles) - Relação 1:1
- Um usuário (users) pode ter uma ou várias associações (memberships) ao longo do tempo - Relação 1:N
- Um usuário (users) pode fazer várias transações (transactions) - Relação 1:N
- Um usuário (users) tem um saldo (balances) - Relação 1:1
- Uma área (areas) pode ter várias reservas (area_reservations) - Relação 1:N
- Um evento (events) pode ter várias inscrições (event_registrations) - Relação 1:N

## Índices Importantes

- users(email) - Busca rápida de usuários por email
- transactions(user_id, created_at) - Histórico de transações por usuário
- area_reservations(area_id, start_time, end_time) - Verificação de disponibilidade de áreas
- event_registrations(event_id) - Contagem de inscrições por evento

## Configuração Inicial no Supabase

1. Crie um novo projeto no Supabase
2. Use o script SQL disponível em `/scripts/db_setup.sql` para criar as tabelas
3. Configure as RLS (Row Level Security) para proteger os dados
4. Configure buckets no Storage para armazenamento de imagens

## Políticas de Segurança (RLS)

- Usuários só podem ver e editar seus próprios dados
- Administradores têm acesso total a todas as tabelas
- Funcionários têm acesso limitado conforme sua função
- Dados financeiros têm proteção extra

## Backups

- Backups automáticos diários (configurados no Supabase)
- Retenção de 7 dias para backups diários
- Backup mensal armazenado por 1 ano 