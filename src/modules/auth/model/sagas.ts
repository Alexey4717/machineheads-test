import { push } from 'connected-react-router';
import { call, put, takeLatest } from 'redux-saga/effects';

import { normalizeApiError } from '@/core/api/errorParsers';
import { PATHS } from '@/core/config/router/paths';
import {
  type AuthTokens,
  clearAuthTokens,
  setAuthTokens,
} from '@/core/lib/cookies/cookies';

import { loginRequest } from '../api/authApi';
import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGOUT_REQUEST,
  type AuthAction,
  authActions,
} from './actions';

function* loginSaga(
  action: Extract<AuthAction, { type: typeof AUTH_LOGIN_REQUEST }>,
) {
  try {
    const tokens: AuthTokens = yield call(loginRequest, action.payload);
    setAuthTokens(tokens);
    yield put(authActions.loginSuccess());
    yield put(push(PATHS.POSTS));
  } catch (error) {
    yield put(authActions.loginFailure(normalizeApiError(error)));
  }
}

function* logoutSaga() {
  clearAuthTokens();
  yield put(authActions.logoutSuccess());
  yield put(push(PATHS.LOGIN));
}

export function* authSaga() {
  yield takeLatest(AUTH_LOGIN_REQUEST, loginSaga);
  yield takeLatest(AUTH_LOGOUT_REQUEST, logoutSaga);
}
