import React from 'react';
import styled from 'styled-components';
import Button from '../components/Button';
import Card from '../components/Card';

// Exemplo de componente com Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[8]} ${theme.spacing[4]}`};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-top: ${({ theme }) => theme.spacing[10]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ComponentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
`;

const CodeBlock = styled.pre`
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[4]};
  margin: ${({ theme }) => `${theme.spacing[4]} 0`};
  overflow-x: auto;
  font-family: monospace;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[800]};
`;

// Exemplo de componente que usa classes do Tailwind diretamente no JSX
const TailwindExample = () => (
  <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Exemplo com Tailwind</h3>
    <p className="text-gray-600 mb-4">
      Este componente usa classes do Tailwind diretamente no JSX.
    </p>
    <div className="flex gap-2">
      <button className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600">
        Botão Primary
      </button>
      <button className="bg-secondary text-white px-4 py-2 rounded hover:bg-green-600">
        Botão Secondary
      </button>
    </div>
  </div>
);

const StyleDemo: React.FC = () => {
  return (
    <PageContainer>
      <div className="mb-10">
        <PageTitle>Demonstração de Estilos</PageTitle>
        <p className="text-lg text-gray-600 max-w-3xl">
          Esta página demonstra o uso combinado de Tailwind CSS (utilitários) e Styled Components (componentes estilizados) 
          em um projeto React com TypeScript.
        </p>
      </div>

      <SectionTitle>Botões com Styled Components</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button variant="primary">Botão Primário</Button>
        <Button variant="secondary">Botão Secundário</Button>
        <Button variant="accent">Botão Accent</Button>
        <Button variant="outline">Botão Outline</Button>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="primary" size="sm">Small</Button>
        <Button variant="primary" size="md">Medium</Button>
        <Button variant="primary" size="lg">Large</Button>
      </div>
      
      <div className="mt-6 flex gap-4">
        <Button variant="primary" isLoading>Carregando</Button>
        <Button variant="primary" fullWidth>Width 100%</Button>
      </div>

      <SectionTitle>Cards com Styled Components</SectionTitle>
      <ComponentsGrid>
        <Card variant="default">
          <Card.Header>
            <Card.Title>Card Padrão</Card.Title>
            <Card.Subtitle>Com sombra leve</Card.Subtitle>
          </Card.Header>
          <Card.Body>
            <p>Este é um exemplo de card com sombra leve.</p>
          </Card.Body>
          <Card.Footer>
            <Button variant="primary" size="sm">Ação</Button>
          </Card.Footer>
        </Card>
        
        <Card variant="outlined">
          <Card.Header>
            <Card.Title>Card Outlined</Card.Title>
            <Card.Subtitle>Apenas com borda</Card.Subtitle>
          </Card.Header>
          <Card.Body>
            <p>Este é um exemplo de card com bordas.</p>
          </Card.Body>
          <Card.Footer>
            <Button variant="outline" size="sm">Ação</Button>
          </Card.Footer>
        </Card>
        
        <Card variant="elevated">
          <Card.Header>
            <Card.Title>Card Elevado</Card.Title>
            <Card.Subtitle>Com sombra mais pronunciada</Card.Subtitle>
          </Card.Header>
          <Card.Body>
            <p>Este é um exemplo de card com sombra mais pronunciada.</p>
          </Card.Body>
          <Card.Footer>
            <Button variant="accent" size="sm">Ação</Button>
          </Card.Footer>
        </Card>
      </ComponentsGrid>

      <SectionTitle>Exemplos com Tailwind CSS</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TailwindExample />
        
        <div className="bg-blue-50 border-l-4 border-primary p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Responsividade</h3>
          <p className="text-gray-600 mb-4">
            Tailwind facilita a criação de layouts responsivos.
          </p>
          <div className="p-4 bg-white rounded shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              <div className="bg-primary text-white p-2 rounded">Item 1</div>
              <div className="bg-secondary text-white p-2 rounded">Item 2</div>
              <div className="bg-accent text-white p-2 rounded">Item 3</div>
            </div>
          </div>
        </div>
      </div>

      <SectionTitle>Combinando Ambas Abordagens</SectionTitle>
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Melhores práticas para combinar Tailwind e Styled Components</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium mb-2 text-gray-700">Quando usar Tailwind:</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Para estilos simples e rápidos</li>
              <li>Para layout e espaçamento</li>
              <li>Para responsividade</li>
              <li>Para prototipagem rápida</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-2 text-gray-700">Quando usar Styled Components:</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Para componentes reutilizáveis</li>
              <li>Para estilos baseados em props</li>
              <li>Para lógica de estilo complexa</li>
              <li>Para componentes de UI consistentes</li>
            </ul>
          </div>
        </div>
        
        <CodeBlock>
          {`// Exemplo de componente que usa ambas abordagens
const MyComponent = () => (
  <StyledContainer>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <h3 className="text-xl font-bold mb-2">Título</h3>
        <p className="text-gray-600">Conteúdo</p>
      </Card>
    </div>
  </StyledContainer>
);`}
        </CodeBlock>
      </div>
    </PageContainer>
  );
};

export default StyleDemo; 