import { useQuery, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/productService";
import type { Product } from "@/types/Product";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => productService.getAll(),
  });
}

export function useProductDetail(id: number) {
  const queryClient = useQueryClient();

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
    initialData: () => {
      const products = queryClient.getQueryData<Product[]>(["products"]);
      return products?.find((product) => product.id === id);
    },
  });

  return {
    product,
    isLoading,
    isError,
    error,
  };
}