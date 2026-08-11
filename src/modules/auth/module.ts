import type { ISagaModule } from 'redux-dynamic-modules-saga';

import { authReducer } from './model/reducer';
import { authSaga } from './model/sagas';
import type { AuthState } from './model/types';

export function getAuthModule(): ISagaModule<{ auth: AuthState }> {
  return {
    id: 'auth',
    reducerMap: {
      auth: authReducer,
    },
    sagas: [authSaga],
    retained: true,
  };
}
