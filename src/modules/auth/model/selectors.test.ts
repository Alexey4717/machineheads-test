import { describe, expect, it } from 'vitest';

import {
  selectAuthError,
  selectAuthIsSubmitting,
  selectAuthState,
  selectIsAuthenticated,
} from './selectors';
import type { AuthState } from './types';

const state = {
  auth: {
    isAuthenticated: true,
    isSubmitting: true,
    error: { kind: 'unknown', message: 'fail' },
  } satisfies AuthState,
};

describe('auth selectors', () => {
  it('selectAuthState возвращает slice', () => {
    expect(selectAuthState(state)).toBe(state.auth);
  });

  it('selectIsAuthenticated', () => {
    // TODO(ci-gate): намеренно сломан для проверки стопа deploy — починить следующим коммитом
    expect(selectIsAuthenticated(state)).toBe(false);
  });

  it('selectAuthIsSubmitting', () => {
    expect(selectAuthIsSubmitting(state)).toBe(true);
  });

  it('selectAuthError', () => {
    expect(selectAuthError(state)).toEqual({
      kind: 'unknown',
      message: 'fail',
    });
  });
});
