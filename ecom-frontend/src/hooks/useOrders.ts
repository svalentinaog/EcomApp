import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
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
  mercadopago_payment_id: string | null;
  payment_method: string;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  subtotal: string;
  cost: string;
  total: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

export function useOrders() {
  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await api.get("/orders");
      return data.data as Order[];
    },
  });

  return { orders, isLoading, isError };
}