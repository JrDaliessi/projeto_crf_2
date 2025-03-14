import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.5rem;
`;

const Section = styled.section`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
  flex-wrap: wrap;
`;

const StyledButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background-color: ${({ theme, variant }) => 
    variant === 'secondary' ? theme.colors.secondary : theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

const Card = styled.div`
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  margin-bottom: 0.5rem;
`;

const SimpleStyleDemo: React.FC = () => {
  return (
    <Container>
      <Title>Demonstração de Estilos Simplificada</Title>
      
      <Section>
        <SectionTitle>Botões com Styled Components</SectionTitle>
        <p>Exemplos de botões estilizados com Styled Components:</p>
        
        <ButtonGroup>
          <StyledButton>Botão Primário</StyledButton>
          <StyledButton variant="secondary">Botão Secundário</StyledButton>
        </ButtonGroup>
      </Section>
      
      <Section>
        <SectionTitle>Cards com Styled Components</SectionTitle>
        <p>Exemplos de cards estilizados:</p>
        
        <Card>
          <CardTitle>Card de Exemplo</CardTitle>
          <p>Este é um exemplo de card estilizado com Styled Components.</p>
          <StyledButton>Ação</StyledButton>
        </Card>
      </Section>
      
      <Section>
        <SectionTitle>Botões com Classes CSS</SectionTitle>
        <p>Exemplos de botões usando classes CSS regulares:</p>
        
        <ButtonGroup>
          <button className="btn btn-primary">Botão Primário</button>
          <button className="btn btn-secondary">Botão Secundário</button>
        </ButtonGroup>
      </Section>
      
      <a href="/" style={{ display: 'block', marginTop: '2rem' }}>
        Voltar para a página inicial
      </a>
    </Container>
  );
};

export default SimpleStyleDemo; 