import React from 'react';
import { Link } from 'react-router-dom';

const TestPage: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#3498db', marginBottom: '20px' }}>
        Página de Teste
      </h1>
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
        Esta é uma página de teste simples para verificar se o React está renderizando corretamente.
      </p>
      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '4px'
      }}>
        <p>Se você está vendo esta mensagem, o React está funcionando!</p>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>Links para Demonstrações</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/style-demo" style={{ 
              color: '#3498db', 
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>
              Ver Demonstração de Estilos Completa (Tailwind + Styled Components)
            </Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/simple-demo" style={{ 
              color: '#2ecc71', 
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>
              Ver Demonstração de Estilos Simplificada (Apenas Styled Components)
            </Link>
          </li>
        </ul>
      </div>
      
      <button 
        style={{
          marginTop: '20px',
          padding: '10px 15px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={() => alert('O botão funciona!')}
      >
        Clique em mim
      </button>
    </div>
  );
};

export default TestPage; 