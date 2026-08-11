import type { NormalizedApiError } from '@/core/api/errorTypes';

export interface AuthState {
  isAuthenticated: boolean;
  isSubmitting: boolean;
  error: NormalizedApiError | null;
}

export type LoginCredentials = {
  email: string;
  password: string;
};
