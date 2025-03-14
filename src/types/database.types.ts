export type Role = {
  id: string;
  role_name: string;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  password_hash?: string;
  role_id: string;
  membership_title?: string;
  is_active: boolean;
  biometric_template?: Uint8Array;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  employee_id: string;
  total_value: number;
  status: 'OPEN' | 'PAID' | 'CANCELED';
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  description?: string;
  order_id?: string;
  created_at: string;
};

export type Area = {
  id: string;
  name: string;
  location?: string;
  capacity?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AreaReservation = {
  id: string;
  area_id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  status: 'RESERVED' | 'CANCELED' | 'USED';
  created_at: string;
  updated_at: string;
};

export type Event = {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type EventTable = {
  id: string;
  event_id: string;
  table_number: string;
  capacity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type EventTableReservation = {
  id: string;
  event_table_id: string;
  user_id: string;
  status: 'RESERVED' | 'CANCELED' | 'USED';
  reserved_at: string;
  created_at: string;
  updated_at: string;
};

export type Service = {
  id: string;
  name: string;
  description?: string;
  monthly_fee: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type UserService = {
  id: string;
  user_id: string;
  service_id: string;
  start_date: string;
  end_date?: string;
  status: 'ACTIVE' | 'CANCELED' | 'EXPIRED';
  created_at: string;
  updated_at: string;
};

export type Payment = {
  id: string;
  user_id: string;
  amount: number;
  method: 'PIX' | 'CARTAO' | 'BOLETO' | 'DINHEIRO';
  status: 'PENDING' | 'PAID' | 'CANCELED';
  due_date?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}; 