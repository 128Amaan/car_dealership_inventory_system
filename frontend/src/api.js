import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Turn an axios error into something a human can act on.
// Priority: server-provided detail > network/proxy failure > generic fallback.
export function explainError(err, fallback) {
  const detail = err?.response?.data?.detail;
  if (detail) {
    return typeof detail === 'string' ? detail : JSON.stringify(detail);
  }
  const isNetwork = err?.code === 'ERR_NETWORK' || err?.message === 'Network Error';
  // Vite dev proxy returns an empty-body HTTP 500 when the upstream FastAPI is
  // down; axios sees that as a successful HTTP response, not a network error.
  // Treat an empty 500 the same as a connection failure.
  const emptyUpstream500 = err?.response?.status === 500 && !err?.response?.data;
  if (isNetwork || emptyUpstream500) {
    return "Can't reach the backend at /api. Is the FastAPI server running on port 8000? Try `npm run dev` from the repo root.";
  }
  return fallback;
}
