import type { NormalizedApiError } from '@/core/api/errorTypes';

import type { LoginCredentials } from './types';

export const AUTH_LOGIN_REQUEST = 'auth/LOGIN_REQUEST' as const;
export const AUTH_LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS' as const;
export const AUTH_LOGIN_FAILURE = 'auth/LOGIN_FAILURE' as const;
export const AUTH_LOGOUT_REQUEST = 'auth/LOGOUT_REQUEST' as const;
export const AUTH_LOGOUT_SUCCESS = 'auth/LOGOUT_SUCCESS' as const;
export const AUTH_SESSION_EXPIRED = 'auth/SESSION_EXPIRED' as const;

export const authActions = {
  loginRequest: (payload: LoginCredentials) => ({
    type: AUTH_LOGIN_REQUEST,
    payload,
  }),
  loginSuccess: () => ({
    type: AUTH_LOGIN_SUCCESS,
  }),
  loginFailure: (error: NormalizedApiError) => ({
    type: AUTH_LOGIN_FAILURE,
    payload: error,
  }),
  logoutRequest: () => ({
    type: AUTH_LOGOUT_REQUEST,
  }),
  logoutSuccess: () => ({
    type: AUTH_LOGOUT_SUCCESS,
  }),
  sessionExpired: () => ({
    type: AUTH_SESSION_EXPIRED,
  }),
};

export type AuthAction =
  | ReturnType<typeof authActions.loginRequest>
  | ReturnType<typeof authActions.loginSuccess>
  | ReturnType<typeof authActions.loginFailure>
  | ReturnType<typeof authActions.logoutRequest>
  | ReturnType<typeof authActions.logoutSuccess>
  | ReturnType<typeof authActions.sessionExpired>;
