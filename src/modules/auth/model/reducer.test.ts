import { beforeEach, describe, expect, it, vi } from 'vitest';

import { authActions } from './actions';
import { authInitialState, authReducer } from './reducer';

vi.mock('@/core/lib/cookies/cookies', () => ({
  hasAuthSession: vi.fn(() => false),
}));

describe('authReducer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('LOGIN_REQUEST включает submitting и сбрасывает error', () => {
    const prev = {
      ...authInitialState,
      error: { kind: 'unknown' as const, message: 'old' },
    };

    expect(
      authReducer(
        prev,
        authActions.loginRequest({ email: 'a', password: 'b' }),
      ),
    ).toEqual({
      ...prev,
      isSubmitting: true,
      error: null,
    });
  });

  it('LOGIN_SUCCESS аутентифицирует', () => {
    expect(
      authReducer(
        { ...authInitialState, isSubmitting: true },
        authActions.loginSuccess(),
      ),
    ).toEqual({
      isAuthenticated: true,
      isSubmitting: false,
      error: null,
    });
  });

  it('LOGIN_FAILURE сохраняет ошибку', () => {
    const error = { kind: 'unknown' as const, message: 'Неверный пароль' };

    expect(
      authReducer(
        { ...authInitialState, isSubmitting: true },
        authActions.loginFailure(error),
      ),
    ).toEqual({
      isAuthenticated: false,
      isSubmitting: false,
      error,
    });
  });

  it('LOGOUT_SUCCESS и SESSION_EXPIRED сбрасывают сессию', () => {
    const authenticated = {
      isAuthenticated: true,
      isSubmitting: false,
      error: null,
    };

    expect(authReducer(authenticated, authActions.logoutSuccess())).toEqual({
      isAuthenticated: false,
      isSubmitting: false,
      error: null,
    });

    expect(authReducer(authenticated, authActions.sessionExpired())).toEqual({
      isAuthenticated: false,
      isSubmitting: false,
      error: null,
    });
  });
});
