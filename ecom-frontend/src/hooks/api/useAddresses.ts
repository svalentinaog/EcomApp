import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addressService } from "@/services/addressService";
import type { AddressPayload } from "@/types/Address";

export type { Address, AddressPayload } from "@/types/Address";

export function useAddresses() {
  const queryClient = useQueryClient();

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => addressService.getAll(),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["addresses"] });

  const createMutation = useMutation({
    mutationFn: (payload: AddressPayload) => addressService.create(payload),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<AddressPayload> }) =>
      addressService.update(id, payload),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => addressService.remove(id),
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