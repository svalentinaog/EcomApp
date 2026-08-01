import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
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

const emptySummary: CartSummary = { subtotal: 0, shippingCost: 0, total: 0 };

export function useCart() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get("/cart");
      const summary: CartSummary = {
        subtotal: Number(data.summary.subtotal),
        shippingCost: Number(data.summary.shipping_cost),
        total: Number(data.summary.total),
      };
      return { items: data.data as CartItem[], summary };
    },
  });

  const cartItems = data?.items ?? [];
  const summary = data?.summary ?? emptySummary;

  const addMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      api.post("/cart", { product_id: productId, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (cartId: number) => api.delete(`/cart/${cartId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ cartId, quantity }: { cartId: number; quantity: number }) =>
      api.put(`/cart/${cartId}`, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const totalItems = cartItems.reduce((count, item) => count + item.quantity, 0);

  return {
    cartItems,
    isLoading,
    summary,
    totalItems,
    addToCart: (productId: number, quantity: number = 1) => addMutation.mutate({ productId, quantity }),
    removeFromCart: (cartId: number) => removeMutation.mutate(cartId),
    updateQuantity: (cartId: number, quantity: number) => updateMutation.mutate({ cartId, quantity }),
  };
}