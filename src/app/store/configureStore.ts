import { push } from 'connected-react-router';
import { createStore } from 'redux-dynamic-modules';
import { getSagaExtension } from 'redux-dynamic-modules-saga';

import { setSessionExpiredHandler } from '@/core/api/sessionEvents';
import { PATHS } from '@/core/config/router/paths';

import { authActions } from '@/modules/auth';

import { getInitialModules } from './rootModule';
import type { AppStore, RootState } from './types';

export { history } from './history';

export function configureStore(): AppStore {
  const store = createStore<RootState>(
    {
      initialState: {},
      extensions: [getSagaExtension()],
    },
    ...getInitialModules(),
  );

  setSessionExpiredHandler(() => {
    store.dispatch(authActions.sessionExpired());
    store.dispatch(push(PATHS.LOGIN));
  });

  return store;
}
