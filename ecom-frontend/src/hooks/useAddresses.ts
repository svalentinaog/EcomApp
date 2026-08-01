import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

export interface Addresses {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export type AddressPayload = Omit<Addresses, "id" | "user_id">;

export function useAddresses() {
  const queryClient = useQueryClient();

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const { data } = await api.get("/addresses");
      return data.data as Addresses[];
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["addresses"] });

  const createMutation = useMutation({
    mutationFn: (payload: AddressPayload) => api.post("/addresses", payload),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<AddressPayload> }) =>
      api.put(`/addresses/${id}`, payload),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/addresses/${id}`),
    onSuccess: invalidate,
  });

  return {
    addresses,
    isLoading,
    defaultAddress: addresses.find((a) => a.is_default) ?? addresses[0],
    createAddress: (payload: AddressPayload) => createMutation.mutateAsync(payload),
    updateAddress: (id: number, payload: Partial<AddressPayload>) =>
      updateMutation.mutateAsync({ id, payload }),
    deleteAddress: (id: number) => deleteMutation.mutateAsync(id),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
  };
}