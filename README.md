# CRF Clube App

Sistema de gerenciamento para clube com funcionalidades de controle de acesso, pagamentos e reservas de espaços.

## Requisitos de Sistema

- Node.js (versão 16+)
- NPM ou Yarn

## Instalação

1. Clone o repositório
```bash
git clone [url-do-repositorio]
cd projeto_crf_2
```

2. Instale as dependências
```bash
npm install
# ou
yarn
```

3. Configuração do Supabase

Este projeto utiliza o Supabase como banco de dados e autenticação. Você precisará:
- Criar uma conta no [Supabase](https://supabase.com)
- Criar um novo projeto
- Configurar as tabelas necessárias (veja documentação em `/docs/database.md`)

4. Configure as variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env.local`
```bash
cp .env.example .env.local
```
- Preencha as variáveis com seus dados do Supabase:
```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Compila o projeto para produção
- `npm run preview`: Visualiza a versão compilada localmente
- `npm run lint`: Executa verificação de código
- `npm run format`: Formata o código conforme padrões configurados

## Deploy

### Deploy na Vercel

1. Conecte seu repositório GitHub na Vercel
2. Configure as variáveis de ambiente na interface da Vercel
3. A Vercel detectará automaticamente que é um projeto Vite e configurará o build

### Deploy em outros ambientes

1. Execute `npm run build` para gerar os arquivos estáticos
2. Faça o upload do conteúdo da pasta `dist` para seu servidor web

## Estrutura do Projeto

- `/src/components/`: Componentes React reutilizáveis
- `/src/contexts/`: Contextos React para gerenciamento de estado global
- `/src/hooks/`: Hooks personalizados
- `/src/lib/`: Utilitários e configurações (inclui conexão Supabase)
- `/src/pages/`: Páginas da aplicação
- `/src/services/`: Serviços de API e lógica de negócios
- `/src/styles/`: Estilos e temas
- `/src/types/`: Definições de tipos TypeScript
- `/src/utils/`: Funções utilitárias

## Documentação

A documentação completa está disponível na pasta `/docs`:

- [Documentação de Código](/docs/code-documentation.md): Padrões e convenções
- [Banco de Dados](/docs/database.md): Estrutura e relacionamentos
- [Perfis de Acesso](/docs/user-roles.md): Níveis de permissão
- [Funcionalidades](/docs/core-features.md): Principais recursos
- [Tecnologias](/docs/technologies.md): Stack tecnológico
- [Monitoramento](/docs/monitoring.md): Ferramentas de monitoramento
- [Manutenção](/docs/maintenance.md): Fluxo de trabalho e boas práticas
- [Backlog](/docs/backlog.md): Roadmap e gestão de tarefas

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

## Contribuição

1. Faça um fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/nome-da-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nome-da-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.

## Contato

Para suporte ou dúvidas, entre em contato via email: suporte@crfclube.com.br 