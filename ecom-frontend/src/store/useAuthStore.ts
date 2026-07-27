import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Definimos qué datos vamos a guardar
interface AuthState {
  token: string | null;
  setToken: (newToken: string) => void;
  logout: () => void;
}

// 2. Creamos la "tienda"
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Estado inicial
      token: null,

      // Función para guardar el token cuando nos logueamos
      setToken: (newToken: string) => set({ token: newToken }),

      // Función para borrar el token al cerrar sesión
      logout: () => set({ token: null }),
    }),
    {
      // Nombre con el que se guardará en el Application > Local Storage de tu navegador
      name: 'auth-storage', 
    }
  )
);