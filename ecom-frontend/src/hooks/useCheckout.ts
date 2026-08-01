import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

interface CreateOrderPayload {
  address_id: number;
  payment_method: string;
}

export function useCheckout() {
  const queryClient = useQueryClient();

  const createOrderMutation = useMutation({
    mutationFn: (payload: CreateOrderPayload) => api.post("/orders", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    createOrder: (payload: CreateOrderPayload) => createOrderMutation.mutateAsync(payload),
    isSubmitting: createOrderMutation.isPending,
    error: createOrderMutation.error,
  };
}