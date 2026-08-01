import type { Product } from "@/types/Product";

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

export interface CartSummary {
  subtotal: number;
  shippingCost: number;
  total: number;
}
