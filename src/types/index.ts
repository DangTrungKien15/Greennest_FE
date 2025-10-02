export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  duration: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'purchase' | 'refund';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}
