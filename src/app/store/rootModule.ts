import { connectRouter, routerMiddleware } from 'connected-react-router';
import type { ISagaModule } from 'redux-dynamic-modules-saga';

import { getAuthModule } from '@/modules/auth';

import { history } from './history';
import type { RootState } from './types';

function* rootSaga() {
  // Core root saga placeholder — feature sagas are registered via dynamic modules.
}

export function getRootModule(): ISagaModule<Pick<RootState, 'router'>> {
  return {
    id: 'root',
    reducerMap: {
      router: connectRouter(history),
    },
    middlewares: [routerMiddleware(history)],
    sagas: [rootSaga],
    retained: true,
  };
}

export function getInitialModules() {
  return [getRootModule(), getAuthModule()];
}
