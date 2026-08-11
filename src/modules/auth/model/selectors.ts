import type { AuthState } from './types';

type StateWithAuth = {
  auth: AuthState;
};

export const selectAuthState = (state: StateWithAuth) => state.auth;
export const selectIsAuthenticated = (state: StateWithAuth) =>
  state.auth.isAuthenticated;
export const selectAuthIsSubmitting = (state: StateWithAuth) =>
  state.auth.isSubmitting;
export const selectAuthError = (state: StateWithAuth) => state.auth.error;
