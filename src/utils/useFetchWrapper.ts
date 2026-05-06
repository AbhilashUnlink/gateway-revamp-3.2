import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type { AuthToken, SignInResponse } from '@/types/login/auth.types';
import { store } from '@/store';
import { tokensRefreshed } from '@/store/slices/authSlice';
import { forceLogout } from './forceLogout';

interface ApiErrorBody {
  message?: string;
  messageCode?: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const X_API_KEY = import.meta.env.VITE_API_X_API_KEY ?? '';

const PUBLIC_ROUTES = ['auth/signIn', 'auth/check-mfa-exist', 'auth/refreshToken'];
const V1_ROUTES = [
  'auth/signIn',
  'auth/check-mfa-exist',
  'auth/refreshToken',
  'dasconfig/user-preferences',
  'dasconfig/gateway-configuration',
  'auth/signOut',
  'entities/merchant/?',
  'entities/merchant/M',
  'entities/user-management/user',
  'entities/merchant/merchant-ip',
];
const refreshTokenRoute = 'v1/auth/refreshToken';
// Refresh slightly before actual expiry to absorb network/clock skew.
const EXP_SKEW_SECONDS = 30;

// Shared promise — all concurrent requests that arrive while a refresh is in
// progress await the same promise instead of each triggering their own refresh.
let refreshPromise: Promise<string> | null = null;
let isRefreshing = false;

// Separate axios instance for refresh calls to avoid interceptor recursion.
const refreshApiClient = axios.create({ baseURL: BASE_URL });

// ==============================
// AUTH READERS — single source of truth is the Redux store.
// ==============================

function getSignInData() {
  return store.getState()?.auth?.signInData;
}

function getIdToken(): string {
  return getSignInData().token?.idToken ?? '';
}

function getRefreshTokenValue(): string {
  return getSignInData().token?.refreshToken ?? '';
}

function getUsername(): string {
  return getSignInData().email ?? '';
}

function getExp(): number {
  return getSignInData().exp ?? 0;
}

function isTokenExpired(): boolean {
  const exp = getExp();
  if (!exp) return true;
  return Date.now() >= (exp - EXP_SKEW_SECONDS) * 1000;
}

// ==============================
// JWT EXP — derive expiry from the new idToken so it can never go stale.
// ==============================

function decodeJwtExp(jwt: string): number | undefined {
  try {
    const [, payload] = jwt.split('.');
    if (!payload) return undefined;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(normalized);
    const parsed = JSON.parse(json) as { exp?: number };
    return typeof parsed.exp === 'number' ? parsed.exp : undefined;
  } catch {
    return undefined;
  }
}

function extractApiMessage(err: unknown): string | undefined {
  const axiosErr = err as AxiosError<ApiErrorBody>;
  return axiosErr?.response?.data?.message;
}

// ==============================
// REFRESH API CALL
// ==============================

async function doRefresh(): Promise<string> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise; // reuse ongoing refresh
  }
  isRefreshing = true;
  const refreshToken = getRefreshTokenValue();
  const username = getUsername();

  if (!refreshToken || !username) {
    forceLogout();
    throw new Error('No refresh token available');
  }

  try {
    const res = await refreshApiClient.post<SignInResponse>(
      refreshTokenRoute,
      { username, refreshToken },
      {
        headers: {
          'X-Api-Key': X_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const newData = res.data?.data;
    const newTokens = newData?.token as AuthToken;
    if (!newTokens?.idToken) {
      throw new Error('Refresh response missing idToken');
    }

    // Derive exp from the JWT itself (authoritative). Fall back to backend's
    // exp on the response if present.
    const exp = decodeJwtExp(newTokens.idToken) ?? newData?.exp;

    store.dispatch(tokensRefreshed({ token: newTokens, exp }));

    return newTokens.idToken;
  } catch (err) {
    forceLogout(extractApiMessage(err));
    throw err;
  }
}

// ==============================
// CREATE AXIOS INSTANCE
// ==============================

export function useFetchWrapper(): AxiosInstance {
  const instance = axios.create({ baseURL: BASE_URL });

  // ----- REQUEST interceptor — read latest token on every call -----
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const url = config.url ?? '';
      const isV1Route = V1_ROUTES.some((route) => url.includes(route));
      if (isV1Route) {
        config.baseURL = `${BASE_URL}/v1`;
      } else {
        config.baseURL = `${BASE_URL}/v2`;
      }
      const isPublicRoute = PUBLIC_ROUTES.some((route) => url.includes(route));

      config.headers ??= {} as InternalAxiosRequestConfig['headers'];
      config.headers['X-Api-Key'] = X_API_KEY;

      if (isPublicRoute) return config;

      const refreshToken = getRefreshTokenValue();

      if (isTokenExpired() && refreshToken) {
        if (!refreshPromise) {
          refreshPromise = doRefresh().finally(() => {
            refreshPromise = null;
          });
        }
        try {
          const newToken = await refreshPromise;
          config.headers['Authorization'] = newToken;
        } catch (err) {
          return Promise.reject(err instanceof Error ? err : new Error('Session expired'));
        }
        return config;
      }

      // Always pull the freshest token from the store at request time.
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
    (error: AxiosError<ApiErrorBody>) => {
      // ❌ DO NOT refresh on 429
      if (error?.response?.status && error?.response?.status === 429) {
        return Promise.reject(error);
      }
      if (error?.response?.status === 401) {
        forceLogout(extractApiMessage(error));
      }
      return Promise.reject(error);
    }
  );

  return instance;
}
