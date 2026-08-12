import { push } from 'connected-react-router';
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PATHS } from '@/core/config/router/paths';
import * as cookies from '@/core/lib/cookies/cookies';

import { loginRequest } from '../api/authApi';
import { authActions } from './actions';
import { authSaga } from './sagas';

vi.mock('@/core/lib/cookies/cookies', () => ({
  setAuthTokens: vi.fn(),
  clearAuthTokens: vi.fn(),
}));

vi.mock('../api/authApi', () => ({
  loginRequest: vi.fn(),
}));

describe('authSaga', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('login success: сохраняет токены, success action, redirect /posts', async () => {
    const tokens = {
      access_token: 'access',
      refresh_token: 'refresh',
    };
    const credentials = { email: 'test@test.ru', password: 'secret' };

    await expectSaga(authSaga)
      .provide([[call.fn(loginRequest), tokens]])
      .put(authActions.loginSuccess())
      .put(push(PATHS.POSTS))
      .dispatch(authActions.loginRequest(credentials))
      .silentRun();

    expect(cookies.setAuthTokens).toHaveBeenCalledWith(tokens);
  });

  it('login failure: кладёт normalizeApiError в loginFailure', async () => {
    const credentials = { email: 'test@test.ru', password: 'bad' };
    const apiError = Object.assign(new Error('Unauthorized'), {
      isAxiosError: true,
      response: {
        status: 401,
        data: { message: 'Неверный логин или пароль' },
      },
      toJSON: () => ({}),
      name: 'AxiosError',
    });

    await expectSaga(authSaga)
      .provide([[call.fn(loginRequest), throwError(apiError)]])
      .put(
        authActions.loginFailure({
          kind: 'system',
          status: 401,
          error: { message: 'Неверный логин или пароль' },
        }),
      )
      .dispatch(authActions.loginRequest(credentials))
      .silentRun();

    expect(cookies.setAuthTokens).not.toHaveBeenCalled();
  });

  it('logout: очищает cookies, success, redirect /login', async () => {
    await expectSaga(authSaga)
      .put(authActions.logoutSuccess())
      .put(push(PATHS.LOGIN))
      .dispatch(authActions.logoutRequest())
      .silentRun();

    expect(cookies.clearAuthTokens).toHaveBeenCalled();
  });
});
