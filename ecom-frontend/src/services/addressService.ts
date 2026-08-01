import { api } from "@/services/api";
import type { Address, AddressPayload } from "@/types/Address";

export const addressService = {
  getAll: async (): Promise<Address[]> => {
    const { data } = await api.get("/addresses");
    return data.data as Address[];
  },

  create: async (payload: AddressPayload): Promise<Address> => {
    const { data } = await api.post("/addresses", payload);
    return data.data as Address;
  },

  update: async (id: number, payload: Partial<AddressPayload>): Promise<Address> => {
    const { data } = await api.put(`/addresses/${id}`, payload);
    return data.data as Address;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/addresses/${id}`);
  },
};
