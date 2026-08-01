import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/categoryService";
import type { Category } from "@/types/Category";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
  });
}

export type { Category };