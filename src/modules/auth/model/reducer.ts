import { hasAuthSession } from '@/core/lib/cookies/cookies';

import {
  AUTH_LOGIN_FAILURE,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT_SUCCESS,
  AUTH_SESSION_EXPIRED,
  type AuthAction,
} from './actions';
import type { AuthState } from './types';

export const authInitialState: AuthState = {
  isAuthenticated: hasAuthSession(),
  isSubmitting: false,
  error: null,
};

export function authReducer(
  state: AuthState = authInitialState,
  action: AuthAction | { type: string },
): AuthState {
  switch (action.type) {
    case AUTH_LOGIN_REQUEST:
      return {
        ...state,
        isSubmitting: true,
        error: null,
      };
    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isSubmitting: false,
        error: null,
      };
    case AUTH_LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        isSubmitting: false,
        error: 'payload' in action ? action.payload : state.error,
      };
    case AUTH_LOGOUT_SUCCESS:
    case AUTH_SESSION_EXPIRED:
      return {
        ...state,
        isAuthenticated: false,
        isSubmitting: false,
        error: null,
      };
    default:
      return state;
  }
}
