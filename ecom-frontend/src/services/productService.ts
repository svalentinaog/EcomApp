import { api } from "@/services/api";
import type { Product } from "@/types/Product";

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await api.get("/products");
    return data.data.data || data.data;
  },

  getById: async (id: number): Promise<Product> => {
    const { data } = await api.get(`/products/${id}`);
    return data.data;
  },
};
