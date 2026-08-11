import { createStore } from 'redux-dynamic-modules';
import { getSagaExtension } from 'redux-dynamic-modules-saga';

import { getRootModule } from './rootModule';
import type { AppStore, RootState } from './types';

export { history } from './history';

export function configureStore(): AppStore {
  return createStore<RootState>(
    {
      initialState: {},
      extensions: [getSagaExtension()],
    },
    getRootModule(),
  );
}
