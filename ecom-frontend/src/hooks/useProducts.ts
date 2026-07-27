import { api } from '@/services/api';
import type { Product } from '@/types/Product';
import { useQuery } from '@tanstack/react-query';

// Función para obtener los productos del backend
async function fetchProducts(): Promise<Product[]> {
  try {
    // 1. 'await' detiene la ejecución un segundo hasta que el servidor de Laravel responda
    const { data } = await api.get('/products');
    
    // 2. Si todo sale bien, devolvemos los datos limpios
    return data.data.data || data.data; 

  } catch (error) {
    // 3. Si ocurre un error (por ejemplo, el servidor está apagado o sin internet),
    // el 'catch' lo atrapa para que tu aplicación no se "rompa" (crash).
    console.error('Error al obtener los productos:', error);
    
    // Devolvemos un arreglo vacío o lanzamos el error según lo que necesitemos
    throw error;
  }
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
}