# Documentação de Funcionalidades Offline (PWA)

Este documento explica como o aplicativo foi configurado para suportar funcionalidades offline através da implementação de PWA (Progressive Web App) e Service Worker.

## Visão Geral

O aplicativo agora possui recursos PWA que permitem:

1. **Instalação como aplicativo nativo** - Em dispositivos móveis e desktops
2. **Funcionamento offline** - Acesso a recursos críticos mesmo sem internet
3. **Cache inteligente** - Políticas de cache específicas por tipo de dados e perfil de usuário
4. **Atualização automática** - Detecção de novas versões e atualização da aplicação

## Requisitos Técnicos

- **HTTPS**: Em produção, o aplicativo deve ser servido em HTTPS para que o Service Worker funcione
- **Compatibilidade**: Navegadores modernos (Chrome, Firefox, Safari, Edge)
- **Imagens PWA**: Ícones em tamanhos apropriados (192x192, 512x512, etc.)

## Como Foi Implementado

### 1. Configuração do PWA

O projeto utiliza o `vite-plugin-pwa` para gerenciar o PWA. A configuração está em `vite.config.ts`:

```typescript
// Trecho do vite.config.ts
plugins: [
  react(),
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
    manifest: {
      name: 'Clube CRF App',
      short_name: 'CRF App',
      description: 'Aplicativo do Clube CRF com suporte offline',
      theme_color: '#e40016',
      icons: [...]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'],
      runtimeCaching: [...]
    }
  })
]
```

### 2. Gerenciamento de Cache

O sistema implementa um gerenciador de cache inteligente (`src/utils/cacheManager.ts`) que define políticas de acesso a dados offline com base no perfil do usuário:

- **Administradores**: Acesso a dados de administração, porém com restrições de tempo
- **Funcionários (Bar/Portaria)**: Acesso a dados essenciais para operação
- **Associados**: Acesso a seus próprios dados (saldo, reservas, etc.)

As políticas definem:
- Tempo de expiração do cache
- Se é válido em modo offline mesmo expirado
- Quais perfis têm acesso ao cache

### 3. Hook para Dados Offline

O hook `useOfflineData` (`src/hooks/useOfflineData.ts`) fornece uma interface para componentes React usarem dados com suporte offline:

```typescript
// Exemplo de uso
const { 
  data,          // Dados carregados (do cache ou online)
  isLoading,     // Indicador de carregamento
  error,         // Erro, se houver
  isOffline,     // Status da conexão
  lastUpdated,   // Quando os dados foram atualizados pela última vez
  isStale        // Se os dados estão desatualizados
} = useOfflineData(fetchData, { 
  cacheType: 'user_reservations', 
  userRole: 'ASSOCIADO',
  userId: '123'
});
```

### 4. Componente de Indicação Offline

O componente `OfflineIndicator` (`src/components/OfflineIndicator.tsx`) mostra uma indicação visual quando o usuário está offline, para melhorar a experiência do usuário.

## Tipos de Cache Disponíveis

O sistema define vários tipos de cache, cada um com suas próprias políticas:

| Tipo de Cache | Perfis Permitidos | Expiração | Válido Offline |
|---------------|-------------------|-----------|----------------|
| user_profile | ADMIN, FUNCIONARIO, ASSOCIADO | 1 hora | Sim |
| user_balance | ASSOCIADO, ADMIN | 30 minutos | Sim |
| user_reservations | ASSOCIADO, ADMIN, FUNCIONARIO | 1 hora | Sim |
| reservation_availability | ASSOCIADO, ADMIN, FUNCIONARIO | 15 minutos | Não |
| bar_financial | FUNCIONARIO, ADMIN | 15 minutos | Não |
| reports | ADMIN | 2 horas | Sim |
| app_settings | Todos | 24 horas | Sim |

## Como Testar

Para testar as funcionalidades offline:

1. Acesse a aplicação normalmente em um navegador compatível
2. Navegue para a página de exemplo em `/offline-exemplo`
3. Abra as Ferramentas de Desenvolvedor (F12)
4. Na aba "Application" > "Service Workers", verifique se o SW está ativo
5. Na aba "Network", ative o modo "Offline"
6. Recarregue a página e observe o comportamento offline

## Expandindo a Funcionalidade

### Adicionando Novos Tipos de Cache

Para adicionar um novo tipo de cache, edite o arquivo `src/utils/cacheManager.ts`:

```typescript
// Exemplo de adição de novo tipo de cache
const CACHE_POLICIES: CachePolicies = {
  // ... políticas existentes ...
  
  // Nova política para notificações
  'notifications': {
    maxAge: 12 * 60 * 60 * 1000, // 12 horas
    validOffline: true,
    allowedRoles: ['ADMIN', 'FUNCIONARIO', 'ASSOCIADO']
  },
}
```

### Implementando em Novos Componentes

Para usar o sistema de cache em um novo componente:

1. Importe o hook `useOfflineData`
2. Configure as opções de cache adequadas ao seu caso de uso
3. Utilize os dados e estados retornados para gerenciar a interface

```typescript
// Exemplo de implementação em um novo componente
import useOfflineData from '../hooks/useOfflineData';

const MinhasReservas = () => {
  const { data, isLoading, error, isOffline } = useOfflineData(
    () => fetchMinhasReservas(userId), 
    { 
      cacheType: 'user_reservations',
      userId,
      userRole: 'ASSOCIADO'
    }
  );
  
  // Renderize seu componente usando os dados...
}
```

## Considerações de Segurança

- **Dados sensíveis**: Nunca armazene dados altamente sensíveis no cache do navegador
- **Validação de servidor**: Sempre valide transações críticas no servidor quando o usuário estiver online
- **Expiração**: Use tempos de expiração adequados para cada tipo de dado
- **Remoção de cache**: Limpe o cache quando o usuário fizer logout com `cacheManager.clearUserCache(userId)`

## Solução de Problemas

- **Service Worker não registra**: Verifique se está em HTTPS ou localhost
- **Dados não aparecem offline**: Verifique as políticas de cache para o perfil do usuário
- **Problemas após atualização**: Tente limpar o cache do service worker nas Ferramentas de Desenvolvedor

## Referências

- [Documentação do vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- [MDN Web Docs: Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Google Developers: Progressive Web Apps](https://developers.google.com/web/progressive-web-apps) 