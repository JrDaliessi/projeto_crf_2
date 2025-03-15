# Documentação do Código

## Padrões de Código

Este projeto segue os seguintes padrões:
- TypeScript para tipagem estática
- ESLint para linting
- Prettier para formatação
- Jest para testes

## Documentação JSDoc

Todas as funções e componentes devem ser documentados usando JSDoc. Exemplo:

```typescript
/**
 * Componente que renderiza uma área de login
 * 
 * @param {object} props - Propriedades do componente
 * @param {Function} props.onSuccess - Função chamada após login bem-sucedido
 * @returns {JSX.Element} Formulário de login
 */
export const LoginForm = ({ onSuccess }: LoginFormProps): JSX.Element => {
  // implementação
}
```

## Swagger/OpenAPI

A documentação da API está disponível em `/docs/api`. Para atualizá-la, execute:

```bash
npm run generate-api-docs
```

## Storybook

Para iniciar o Storybook e visualizar os componentes:

```bash
npm run storybook
```

Novos componentes devem incluir stories para demonstrar seu uso. 