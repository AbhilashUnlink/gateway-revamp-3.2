import axios, { type AxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

function createInstance() {
  const instance = axios.create({ baseURL: BASE_URL });

  instance.interceptors.request.use((config) => {
    const raw = localStorage.getItem('persist:auth');
    if (raw) {
      try {
        const auth = JSON.parse(raw);
        const token = JSON.parse(auth.accessToken);
        if (token) config.headers.Authorization = `Bearer ${token}`;
      } catch {
        // no token
      }
    }
    return config;
  });

  return instance;
}

export function useFetchWrapper() {
  const http = createInstance();

  return {
    get: <T = unknown>(url: string, config?: AxiosRequestConfig) => http.get<T>(url, config),
    post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      http.post<T>(url, data, config),
    put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      http.put<T>(url, data, config),
    patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      http.patch<T>(url, data, config),
    delete: <T = unknown>(url: string, config?: AxiosRequestConfig) => http.delete<T>(url, config),
  };
}
