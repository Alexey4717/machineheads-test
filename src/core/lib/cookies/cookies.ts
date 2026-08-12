import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const ACCESS_EXPIRED_AT_KEY = 'access_expired_at';
const REFRESH_EXPIRED_AT_KEY = 'refresh_expired_at';

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  access_expired_at?: number;
  refresh_expired_at?: number;
}

export function getAccessToken(): string | undefined {
  return Cookies.get(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH_TOKEN_KEY);
}

export function getAccessExpiredAt(): number | undefined {
  const value = Cookies.get(ACCESS_EXPIRED_AT_KEY);
  return value ? Number(value) : undefined;
}

export function setAuthTokens(tokens: AuthTokens): void {
  Cookies.set(ACCESS_TOKEN_KEY, tokens.access_token);
  Cookies.set(REFRESH_TOKEN_KEY, tokens.refresh_token);

  if (tokens.access_expired_at != null) {
    Cookies.set(ACCESS_EXPIRED_AT_KEY, String(tokens.access_expired_at));
  }

  if (tokens.refresh_expired_at != null) {
    Cookies.set(REFRESH_EXPIRED_AT_KEY, String(tokens.refresh_expired_at));
  }
}

export function clearAuthTokens(): void {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  Cookies.remove(ACCESS_EXPIRED_AT_KEY);
  Cookies.remove(REFRESH_EXPIRED_AT_KEY);
}

export function hasAuthSession(): boolean {
  return Boolean(getAccessToken() || getRefreshToken());
}
