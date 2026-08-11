import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { getApiBaseUrl } from '../config/env';
import {
  type AuthTokens,
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from '../lib/cookies';
import { notifySessionExpired } from './sessionEvents';

const AUTH_REFRESH_URL = '/auth/token-refresh';
const AUTH_GENERATE_URL = '/auth/token-generate';

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
});

const refreshClient = axios.create({
  baseURL: getApiBaseUrl(),
});

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string | null> | null = null;

function isAuthEndpoint(url?: string): boolean {
  if (!url) {
    return false;
  }

  return url.includes(AUTH_GENERATE_URL) || url.includes(AUTH_REFRESH_URL);
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  const formData = new FormData();
  formData.append('refresh_token', refreshToken);

  const { data } = await refreshClient.post<AuthTokens>(
    AUTH_REFRESH_URL,
    formData,
  );
  setAuthTokens(data);
  return data.access_token;
}

function refreshAccessTokenSingleFlight(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken()
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

function handleAuthFailure(): void {
  clearAuthTokens();
  notifySessionExpired();
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalConfig = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    if (
      !originalConfig ||
      status !== 401 ||
      originalConfig._retry ||
      isAuthEndpoint(originalConfig.url)
    ) {
      return Promise.reject(error);
    }

    originalConfig._retry = true;

    const nextAccessToken = await refreshAccessTokenSingleFlight();

    if (!nextAccessToken) {
      handleAuthFailure();
      return Promise.reject(error);
    }

    originalConfig.headers.Authorization = `Bearer ${nextAccessToken}`;
    return apiClient(originalConfig);
  },
);
