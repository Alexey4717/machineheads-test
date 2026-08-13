import { createSelector } from 'reselect';

export const selectAuthState = (state: RootState) => state.auth;

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (auth) => auth.isAuthenticated,
);

export const selectAuthIsSubmitting = createSelector(
  selectAuthState,
  (auth) => auth.isSubmitting,
);

export const selectAuthError = createSelector(
  selectAuthState,
  (auth) => auth.error,
);
