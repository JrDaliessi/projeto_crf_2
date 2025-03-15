// Tipos relacionados a usuários
export interface User {
  id: string;
  email: string;
  name?: string;
  roles: {
    role_name: 'ADMIN' | 'FUNCIONARIO' | 'ASSOCIADO';
  };
  // Outros campos possíveis
  phone?: string;
  avatar_url?: string;
  created_at?: string;
}

// Tipos relacionados a autenticação
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Tipos relacionados a reservas
export interface Reservation {
  id: string;
  userId: string;
  resourceId: string; // Churrasqueira, mesa, etc
  dateStart: string;
  dateEnd: string;
  status: 'PENDENTE' | 'CONFIRMADA' | 'CANCELADA';
  // Outros campos
  createdAt: string;
  updatedAt: string;
}

// Tipos relacionados a transações financeiras
export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'DEPOSITO' | 'COMPRA' | 'RESERVA';
  description: string;
  createdAt: string;
}

// Tipos relacionados a eventos
export interface Event {
  id: string;
  title: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  capacity: number;
  price: number;
  image?: string;
}

// Tipos relacionados a produtos (para o bar)
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
} 