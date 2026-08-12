import type { NormalizedApiError } from '@/core/api/errorTypes';

export interface AuthState {
  isAuthenticated: boolean;
  isSubmitting: boolean;
  error: NormalizedApiError | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
