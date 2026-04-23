import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { apiService } from '.';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const X_API_KEY = import.meta.env.VITE_API_X_API_KEY ?? '';

const PUBLIC_ROUTES = ['/auth/signIn', '/auth/checkMfaExist'];

// ==============================
// AUTH HELPERS
// ==============================

function getAuthData() {
  try {
    const raw = localStorage.getItem('persist:auth');
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    return parsed?.signInData ? JSON.parse(parsed.signInData) : null;
  } catch {
    return null;
  }
}

function isTokenExpired(exp?: number): boolean {
  if (!exp) return true;
  return Date.now() >= exp * 1000;
}

function getAccessToken(): string | null {
  return getAuthData()?.token?.accessToken ?? null;
}

function getRefreshToken(): string | null {
  return getAuthData()?.token?.refreshToken ?? null;
}

function getUsername(): string | null {
  return getAuthData()?.email ?? null;
}

// ==============================
// REFRESH STATE (singleton)
// ==============================

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

// ==============================
// UPDATE STORAGE
// ==============================

function updateAuthStorage(tokens: { accessToken: string; refreshToken: string }) {
  const raw = localStorage.getItem('persist:auth');
  if (!raw) return;

  const parsed = JSON.parse(raw);

  const signInData = parsed?.signInData ? JSON.parse(parsed.signInData) : {};

  const updated = {
    ...signInData,
    token: {
      ...signInData.token,
      ...tokens,
    },
  };

  parsed.signInData = JSON.stringify(updated);

  localStorage.setItem('persist:auth', JSON.stringify(parsed));
}

// ==============================
// REFRESH API CALL
// ==============================

async function refreshTokenApi(refreshToken: string) {
  const payload = {
    username: getUsername(),
    refreshToken,
  };

  const res = await apiService.auth.postRefreshToken(payload);
  return res.data;
}

// ==============================
// CREATE AXIOS INSTANCE
// ==============================

export function useFetchWrapper(): AxiosInstance {
  const instance = axios.create({
    baseURL: BASE_URL,
  });

  instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const url = config.url || '';

    const isPublicRoute = PUBLIC_ROUTES.some((route) => url.includes(route));

    // Always attach API key
    config.headers?.set?.('X-Api-Key', X_API_KEY);

    // Skip auth for public APIs
    if (isPublicRoute) return config;

    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    const exp = getAuthData()?.exp;

    // =========================
    // REFRESH TOKEN FLOW
    // =========================
    if (isTokenExpired(exp) && refreshToken) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newTokens = await refreshTokenApi(refreshToken);

          const updated = {
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
          };

          updateAuthStorage(updated);

          isRefreshing = false;

          refreshQueue.forEach((cb) => cb(updated.accessToken));
          refreshQueue = [];
        } catch (err) {
          isRefreshing = false;
          refreshQueue = [];
          return Promise.reject(err);
        }
      }

      return new Promise((resolve) => {
        refreshQueue.push((token: string) => {
          config.headers?.set?.('Authorization', `Bearer ${token}`);
          resolve(config);
        });
      });
    }

    // =========================
    // NORMAL TOKEN ATTACHMENT
    // =========================
    if (accessToken) {
      config.headers?.set?.('Authorization', `Bearer ${accessToken}`);
    }

    return config;
  });

  return instance;
}
