import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token; 
  
  if (token) {
    // Si hay token, se lo pegamos a la cabecera de la petición
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});