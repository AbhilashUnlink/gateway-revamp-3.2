import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const X_API_KEY = import.meta.env.VITE_API_X_API_KEY ?? '';

function getAccessToken(): string | null {
  try {
    const raw = localStorage.getItem('persist:auth');
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    // redux-persist stores values as stringified JSON
    const token = parsed?.accessToken ? JSON.parse(parsed.accessToken) : null;

    return token || null;
  } catch {
    return null;
  }
}

export function createInstance() {
  const instance = axios.create({ baseURL: BASE_URL });

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    // ✅ Axios v1 safe header handling
    config.headers?.set?.('X-Api-Key', X_API_KEY);

    if (token) {
      config.headers?.set?.('Authorization', `Bearer ${token}`);
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
