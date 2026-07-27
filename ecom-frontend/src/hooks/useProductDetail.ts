import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { api } from "@/services/api";
import type { Product } from "@/types/Product";

// Función para obtener un solo producto desde Laravel
async function fetchProductById(id: number): Promise<Product> {
  try {
    const { data } = await api.get(`/products/${id}`);
    
    // Basado en tu Postman, el objeto del producto viene dentro de 'data'
    return data.data; 
  } catch (error) {
    console.error(`Error al obtener el producto con ID ${id}:`, error);
    throw error;
  }
}

export function useProductDetail() {
  // Extraemos el ID de la URL
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  
  // Instanciamos el cliente para acceder a la caché global
  const queryClient = useQueryClient();

  const {
    data: product,
    isLoading,
    isError,
    error
  } = useQuery({
    // La 'queryKey' es única para cada producto, así se cachean individualmente
    queryKey: ["product", numericId],
    queryFn: () => fetchProductById(numericId),
    // Evita que la petición se ejecute si no hay un ID válido en la URL
    enabled: !!numericId,
    
    // Magia de React Query: Si el producto ya existe en la lista general ("products"),
    // lo mostramos instantáneamente mientras en segundo plano actualiza los datos por si cambiaron.
    initialData: () => {
      const products = queryClient.getQueryData<Product[]>(["products"]);
      return products?.find((p) => p.id === numericId);
    },
  });

  return {
    product,
    isLoading,
    isError,
    error,
  };
}