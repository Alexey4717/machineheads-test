import type { RouterState } from 'connected-react-router';
import type { IModuleStore } from 'redux-dynamic-modules';

export interface RootState {
  router: RouterState;
}

export type AppStore = IModuleStore<RootState>;
export type AppDispatch = AppStore['dispatch'];
