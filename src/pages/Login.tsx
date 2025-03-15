import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';

// Componentes estilizados básicos
const LoginContainer = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-background) 0%, var(--color-primary) 100%);
  padding: 1rem;
`;

const LoginCard = styled.div`
  background-color: var(--color-card-background);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormTitle = styled.h1`
  color: var(--color-primary);
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const FormSubtitle = styled.p`
  color: var(--color-text-light);
  text-align: center;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all var(--transition-fast) ease;
  
  &:focus-within {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
  }
`;

const InputIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.75rem;
  color: var(--color-text-light);
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: none;
  outline: none;
  background: transparent;
  color: var(--color-text);
  
  &::placeholder {
    color: var(--color-text-lighter);
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary);
  color: white;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all var(--transition-fast) ease;
  
  &:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessageContainer = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  background-color: rgba(var(--color-error-rgb), 0.1);
  border-left: 3px solid var(--color-error);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  color: var(--color-error);

  svg {
    margin-right: 0.5rem;
    margin-top: 0.15rem;
    flex-shrink: 0;
  }
`;

const TestAccountsBox = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: rgba(var(--color-primary-rgb), 0.1);
  border-radius: var(--radius-md);
`;

const TestAccountTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-primary);
`;

const TestAccount = styled.div`
  font-size: 0.75rem;
  color: var(--color-text);
  margin-bottom: 0.25rem;
  
  span {
    font-weight: 500;
  }
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showTestAccounts, setShowTestAccounts] = useState(false);
  
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Limpar erro ao montar o componente
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Mostrar contas de teste após algumas tentativas de login
  useEffect(() => {
    if (loginAttempts >= 1) {
      setShowTestAccounts(true);
    }
  }, [loginAttempts]);

  // Obter o caminho de redirecionamento após o login
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }
    
    setIsSubmitting(true);
    clearError();
    
    try {
      console.log('Tentando login com:', email);
      const { success } = await login(email, password);
      
      if (success) {
        console.log('Login bem-sucedido, redirecionando para:', from);
        // Redirecionar para a página anterior ou dashboard
        navigate(from, { replace: true });
      } else {
        setLoginAttempts(prev => prev + 1);
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setLoginAttempts(prev => prev + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <FormTitle>Bem-vindo</FormTitle>
        <FormSubtitle>Faça login para acessar o sistema</FormSubtitle>
        
        {error && (
          <ErrorMessageContainer>
            <FiAlertCircle size={16} />
            <div>{error}</div>
          </ErrorMessageContainer>
        )}
        
        <LoginForm onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel htmlFor="email">Email</FormLabel>
            <InputGroup>
              <InputIcon>
                <FiMail />
              </InputIcon>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </InputGroup>
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="password">Senha</FormLabel>
            <InputGroup>
              <InputIcon>
                <FiLock />
              </InputIcon>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </InputGroup>
          </FormGroup>
          
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </SubmitButton>
        </LoginForm>
        
        {showTestAccounts && (
          <TestAccountsBox>
            <TestAccountTitle>Contas para teste:</TestAccountTitle>
            <TestAccount>
              <span>Administrador:</span> admin@teste.com / Senha@123
            </TestAccount>
            <TestAccount>
              <span>Usuário comum:</span> usuario@teste.com / Senha@123
            </TestAccount>
            <TestAccount>
              <span>Gerente:</span> gerente@teste.com / Senha@123
            </TestAccount>
          </TestAccountsBox>
        )}
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 