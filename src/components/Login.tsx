import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import styled from 'styled-components';

// Estilos para o componente de login
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--color-background);
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 450px;
  padding: 2rem;
  background-color: var(--color-card-background);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    color: var(--color-primary);
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--color-text-light);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text);
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-card-background);
  overflow: hidden;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
  }
`;

const InputIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  color: var(--color-text-light);
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: transparent;
  color: var(--color-text);
  font-size: 1rem;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: var(--color-text-lighter);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  background-color: rgba(var(--color-error-rgb), 0.1);
  border-left: 3px solid var(--color-error);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  color: var(--color-error);

  svg {
    margin-right: 0.5rem;
    flex-shrink: 0;
  }
`;

const LoginFooter = styled.div`
  margin-top: 2rem;
  text-align: center;
  color: var(--color-text-light);
  font-size: 0.875rem;
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  
  const { login, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  
  // Limpar erro ao montar o componente
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Observar erros do contexto de autenticação
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      console.log('Tentando login com:', email);
      const { success } = await login(email, password);
      
      if (success) {
        console.log('Login bem-sucedido, redirecionando...');
        navigate('/home');
      } else {
        setLoginAttempts(prev => prev + 1);
        setError('Credenciais inválidas. Por favor, tente novamente.');
        
        // Sugestão de uso após várias tentativas falhas
        if (loginAttempts >= 2) {
          setError('Múltiplas tentativas falhas. Tente usar: admin@teste.com / Senha@123');
        }
      }
    } catch (err) {
      console.error('Erro no processo de login:', err);
      setError('Ocorreu um erro durante o login. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <h1>Bem-vindo</h1>
          <p>Faça login para acessar o sistema</p>
        </LoginHeader>
        
        {error && (
          <ErrorMessage>
            <FiAlertCircle size={18} />
            {error}
          </ErrorMessage>
        )}
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">E-mail</Label>
            <InputGroup>
              <InputIcon>
                <FiMail />
              </InputIcon>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled={isLoading}
                required
              />
            </InputGroup>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Senha</Label>
            <InputGroup>
              <InputIcon>
                <FiLock />
              </InputIcon>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                disabled={isLoading}
                required
              />
            </InputGroup>
          </FormGroup>
          
          <Button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        
        <LoginFooter>
          <p>
            Para testar, use: admin@teste.com / Senha@123
          </p>
          <p style={{ marginTop: '8px' }}>
            Não tem uma conta? Contate o administrador do sistema.
          </p>
        </LoginFooter>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 