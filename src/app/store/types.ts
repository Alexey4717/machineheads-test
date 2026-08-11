import type { RouterState } from 'connected-react-router';
import type { IModuleStore } from 'redux-dynamic-modules';

import type { AuthState } from '@/modules/auth';

export interface RootState {
  router: RouterState;
  auth: AuthState;
}

export type AppStore = IModuleStore<RootState>;
export type AppDispatch = AppStore['dispatch'];
