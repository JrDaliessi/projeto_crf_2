// Importa as configurações do jest-dom para permitir assertivas como toBeInTheDocument()
import '@testing-library/jest-dom';

// Mock para a API de Web Storage quando estiver em ambiente de teste
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true
});

// Mock para matchMedia que não está disponível no ambiente de teste
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock global para fetch
global.fetch = jest.fn();

// Limpar todos os mocks depois de cada teste
afterEach(() => {
  jest.clearAllMocks();
}); 