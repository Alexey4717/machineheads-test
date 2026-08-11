import { connectRouter, routerMiddleware } from 'connected-react-router';
import type { ISagaModule } from 'redux-dynamic-modules-saga';

import { history } from './history';
import type { RootState } from './types';

function* rootSaga() {
  // Core root saga placeholder — feature sagas will be registered via dynamic modules.
}

export function getRootModule(): ISagaModule<RootState> {
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
