import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
  text-align: center;
  max-width: 600px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const LandingPage: React.FC = () => {
  return (
    <Container>
      <Title>Bem-vindo ao Clube CRF</Title>
      <Subtitle>
        Sistema de gerenciamento para associados, funcionários e administradores do clube.
      </Subtitle>
      
      <ButtonContainer>
        <Link to="/login" className="btn btn-primary">
          Fazer Login
        </Link>
        <Link to="/style-demo" className="btn btn-secondary">
          Ver Demonstração de Estilos
        </Link>
      </ButtonContainer>
    </Container>
  );
};

export default LandingPage; 