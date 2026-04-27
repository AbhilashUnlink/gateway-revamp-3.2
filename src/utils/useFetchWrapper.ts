import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type { SignInData } from '@/types/login/auth.types';
import { apiService } from '.';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const X_API_KEY = import.meta.env.VITE_API_X_API_KEY ?? '';

const PUBLIC_ROUTES = ['/auth/signIn', '/auth/checkMfaExist'];

// Shared promise — all concurrent requests that arrive while a refresh is in
// progress await the same promise instead of each triggering their own refresh.
let refreshPromise: Promise<string> | null = null;

// ==============================
// AUTH HELPERS
// ==============================

function getAuthData(): SignInData | null {
  try {
    const raw = localStorage.getItem('persist:root');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, string>;
    const parsedAuth = JSON.parse(parsed.auth ?? '{}') as {
      signInData?: SignInData;
    };
    return parsedAuth.signInData ?? null;
  } catch {
    return null;
  }
}

function isTokenExpired(exp?: number): boolean {
  if (!exp) return true;
  return Date.now() >= exp * 1000;
}

function getIdToken(): string | null {
  return getAuthData()?.token?.idToken ?? null;
}

function getRefreshToken(): string | null {
  return getAuthData()?.token?.refreshToken ?? null;
}

function getUsername(): string | null {
  return getAuthData()?.email ?? null;
}

// ==============================
// UPDATE STORAGE
// ==============================

function updateAuthStorage(tokens: {
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
}) {
  try {
    const raw = localStorage.getItem('persist:root');
    if (!raw) return;

    const persistRoot = JSON.parse(raw) as Record<string, string>;
    const authState = JSON.parse(persistRoot.auth ?? '{}') as {
      signInData?: SignInData;
    };

    if (!authState.signInData) return;

    authState.signInData = {
      ...authState.signInData,
      token: {
        ...authState.signInData.token,
        ...tokens,
      },
    };

    persistRoot.auth = JSON.stringify(authState);
    localStorage.setItem('persist:root', JSON.stringify(persistRoot));
  } catch {
    // storage update failure is non-fatal — next request will re-attempt
  }
}

// ==============================
// REFRESH API CALL
// ==============================

async function doRefresh(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token available');

  const res = await apiService.auth.postRefreshToken({
    username: getUsername(),
    refreshToken,
  });

  const newTokens = res.data as {
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
  };

  updateAuthStorage(newTokens);

  // idToken is used as the Authorization header (matches getIdToken())
  return newTokens.idToken ?? newTokens.accessToken ?? '';
}

// ==============================
// CREATE AXIOS INSTANCE
// ==============================

export function useFetchWrapper(): AxiosInstance {
  const instance = axios.create({ baseURL: BASE_URL });

  // ----- REQUEST interceptor — attach token / trigger refresh -----
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const url = config.url ?? '';
      const isPublicRoute = PUBLIC_ROUTES.some((route) => url.includes(route));

      config.headers = config.headers ?? {};
      config.headers['X-Api-Key'] = X_API_KEY;

      if (isPublicRoute) return config;

      const exp = getAuthData()?.exp;
      const refreshToken = getRefreshToken();

      if (isTokenExpired(exp) && refreshToken) {
        // All concurrent expired requests share the same refresh promise.
        // Only the first creates it; the rest just await it.
        if (!refreshPromise) {
          refreshPromise = doRefresh().finally(() => {
            refreshPromise = null;
          });
        }

        try {
          const newToken = await refreshPromise;
          config.headers['Authorization'] = newToken;
        } catch {
          return Promise.reject(new Error('Session expired. Please sign in again.'));
        }

        return config;
      }

      const idToken = getIdToken();
      if (idToken) {
        config.headers['Authorization'] = idToken;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // ----- RESPONSE interceptor — handle hard 401 (refresh token invalid) -----
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        // Clear persisted session and redirect to login
        localStorage.removeItem('persist:root');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
}
