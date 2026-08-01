import { api } from "@/services/api";
import type { Category } from "@/types/Category";

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get("/categories");
    return data.data;
  },
};
