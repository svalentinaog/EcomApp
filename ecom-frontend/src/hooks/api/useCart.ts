import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/services/cartService";
import type { CartSummary } from "@/types/Cart";

export type { CartItem, CartSummary } from "@/types/Cart";

const emptySummary: CartSummary = { subtotal: 0, shippingCost: 0, total: 0 };

export function useCart() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartService.getAll(),
  });

  const cartItems = data?.items ?? [];
  const summary = data?.summary ?? emptySummary;

  const addMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      cartService.add({ productId, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (cartId: number) => cartService.remove(cartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ cartId, quantity }: { cartId: number; quantity: number }) =>
      cartService.update({ cartId, quantity }),
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