import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import type { CreateOrderPayload, CreateOrderResponse } from "@/types/Order";

export function useOrders() {
  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: () => orderService.getAll(),
  });

  return { orders, isLoading, isError };
}

export function useCheckout() {
  const queryClient = useQueryClient();

  const createOrderMutation = useMutation<CreateOrderResponse, Error, CreateOrderPayload>({
    mutationFn: (payload: CreateOrderPayload) => orderService.create(payload),
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