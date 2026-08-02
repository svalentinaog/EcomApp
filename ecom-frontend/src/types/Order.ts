import type { Product } from "@/types/Product";

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: string;
  subtotal: string;
  product: Product;
}

export interface Order {
  id: number;
  user_id: number;
  address_id: number;
  payment_status: string; 
  payment_method: string;
  recipient_full_name: string; 
  phone: string;
  address_line: string;
  department: string; 
  city: string;
  neighborhood: string; 
  complement: string | null; 
  subtotal: string;
  cost: string;
  total: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

export interface CreateOrderPayload {
  address_id: number;
  payment_method: string;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  checkout_url?: string;
  data: Order;
}