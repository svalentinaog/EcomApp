// src/hooks/useCategories.ts
import { api } from '@/services/api';
import type { Category } from '@/types/Category';
import { useQuery } from '@tanstack/react-query';

// Función para obtener las categorías del backend
async function fetchCategories(): Promise<Category[]> {
  try {
    // 1. 'await' detiene la ejecución hasta que el servidor responda
    const { data } = await api.get('/categories');
    
    // 2. Si todo sale bien, devolvemos los datos limpios
    // Basado en la respuesta de tu backend, el arreglo viene dentro de 'data'
    return data.data; 
    
  } catch (error) {
    // 3. Atrapamos el error para que la aplicación no se rompa
    console.error('Error al obtener las categorías:', error);
    
    // Lanzamos el error para que React Query lo maneje en su estado 'isError'
    throw error;
  }
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
}