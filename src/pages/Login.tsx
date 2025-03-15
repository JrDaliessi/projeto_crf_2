import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTestUsers, setShowTestUsers] = useState(false);
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Obter o caminho de redirecionamento após o login
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }
    
    setIsSubmitting(true);
    clearError();
    
    try {
      const { success } = await login(email, password);
      
      if (success) {
        // Redirecionar para a página anterior ou home
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const setTestUser = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
  };
  
  // Estilos inline básicos para funcionamento sem Tailwind
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to right top, rgba(229, 0, 0, 0.05), white, rgba(229, 0, 0, 0.1))'
    },
    card: {
      width: '100%',
      maxWidth: '400px',
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    logo: {
      width: '80px',
      height: '80px',
      margin: '0 auto 1rem auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      backgroundColor: '#e40016',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '1.5rem'
    },
    title: {
      textAlign: 'center',
      marginBottom: '1.5rem',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#333'
    },
    form: {
      marginBottom: '1.5rem'
    },
    formGroup: {
      marginBottom: '1rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '0.375rem',
      border: '1px solid #d1d5db',
      fontSize: '1rem'
    },
    button: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#e40016',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      fontWeight: '500',
      cursor: 'pointer',
      marginTop: '1rem'
    },
    error: {
      padding: '0.75rem',
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
      borderRadius: '0.375rem',
      marginBottom: '1rem'
    },
    testUserButton: {
      background: 'none',
      border: 'none',
      color: '#6b7280',
      fontSize: '0.875rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      padding: '0.5rem 0',
      marginTop: '1rem'
    },
    testUserBox: {
      border: '1px solid #e5e7eb',
      borderRadius: '0.375rem',
      padding: '1rem',
      marginTop: '0.5rem'
    },
    userItem: {
      padding: '0.5rem 0',
      borderBottom: '1px solid #f3f4f6'
    },
    useButton: {
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '0.25rem',
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
      cursor: 'pointer',
      float: 'right'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>CRF</div>
        <h1 style={styles.title}>Bem-vindo ao Clube CRF</h1>
        
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            style={styles.button}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <button
          onClick={() => setShowTestUsers(!showTestUsers)}
          style={styles.testUserButton}
        >
          {showTestUsers ? 'Ocultar Usuários de Teste' : 'Mostrar Usuários de Teste'}
        </button>
        
        {showTestUsers && (
          <div style={styles.testUserBox}>
            <h3 style={{marginTop: 0, marginBottom: '0.5rem'}}>Usuários para teste:</h3>
            
            <div style={styles.userItem}>
              <div><strong>Admin:</strong> admin@exemplo.com</div>
              <div>Senha: senha123</div>
              <button
                onClick={() => setTestUser('admin@exemplo.com', 'senha123')}
                style={styles.useButton}
              >
                Usar
              </button>
            </div>
            
            <div style={styles.userItem}>
              <div><strong>Funcionário:</strong> funcionario@exemplo.com</div>
              <div>Senha: senha123</div>
              <button
                onClick={() => setTestUser('funcionario@exemplo.com', 'senha123')}
                style={styles.useButton}
              >
                Usar
              </button>
            </div>
            
            <div style={{...styles.userItem, borderBottom: 'none'}}>
              <div><strong>Associado:</strong> associado@exemplo.com</div>
              <div>Senha: senha123</div>
              <button
                onClick={() => setTestUser('associado@exemplo.com', 'senha123')}
                style={styles.useButton}
              >
                Usar
              </button>
            </div>
            
            <div style={{fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem'}}>
              <p>Para criar estes usuários, acesse a página <a href="/test" style={{color: '#e40016'}}>Teste</a> após fazer login com qualquer usuário.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login; 