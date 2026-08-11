import { apiClient } from '@/core/api/apiClient';
import type { AuthTokens } from '@/core/lib/cookies';

export interface LoginPayload {
  email: string;
  password: string;
}

export async function loginRequest(payload: LoginPayload): Promise<AuthTokens> {
  const formData = new FormData();
  formData.append('email', payload.email);
  formData.append('password', payload.password);

  const { data } = await apiClient.post<AuthTokens>(
    '/auth/token-generate',
    formData,
  );
  return data;
}

export async function refreshTokenRequest(
  refreshToken: string,
): Promise<AuthTokens> {
  const formData = new FormData();
  formData.append('refresh_token', refreshToken);

  const { data } = await apiClient.post<AuthTokens>(
    '/auth/token-refresh',
    formData,
  );
  return data;
}
