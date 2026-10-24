import axios from 'axios';

const baseURL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api';

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type Vehicle = {
  id: number;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  year?: number | null;
  image_url?: string | null;
};

export type User = {
  id: number;
  email: string;
  is_admin: boolean;
};
