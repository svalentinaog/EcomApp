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

export function useCart() {
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get("/cart");
      return data.data as CartItem[];
    },
  });

  // 👇 Añadimos la mutación para el endpoint POST /cart (store)
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

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (Number(item.product.price) * item.quantity);
    }, 0);
  };

  const totalItems = cartItems.reduce((count, item) => count + item.quantity, 0);

  return {
    cartItems,
    isLoading,
    totalAmount: getCartTotal(),
    totalItems,
    addToCart: (productId: number, quantity: number = 1) => addMutation.mutate({ productId, quantity }), // 👈 Lo exponemos aquí
    removeFromCart: (cartId: number) => removeMutation.mutate(cartId),
    updateQuantity: (cartId: number, quantity: number) => updateMutation.mutate({ cartId, quantity }),
  };
}