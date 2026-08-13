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
} as unknown as RootState;

describe('auth selectors', () => {
  it('selectAuthState возвращает slice', () => {
    expect(selectAuthState(state)).toBe(state.auth);
  });

  it('selectIsAuthenticated', () => {
    expect(selectIsAuthenticated(state)).toBe(true);
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
