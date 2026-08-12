import type { RouterState } from 'connected-react-router';
import type { IModuleStore } from 'redux-dynamic-modules';

import type { AuthState } from '../../modules/auth';
import type { TagState } from '../../modules/tag';

/**
 * Aggregate app state for statically known slices.
 * Dynamic modules (tag, and future author/post) are typed here once their
 * public API exports a state type; at runtime a slice exists only while its
 * module is loaded via redux-dynamic-modules.
 *
 * Declared globally so core/modules can reference RootState / AppDispatch
 * without importing from `app` (architecture boundaries).
 */
declare global {
  type RootState = {
    router: RouterState;
    auth: AuthState;
    tag: TagState;
  };

  type AppStore = IModuleStore<RootState>;
  type AppDispatch = AppStore['dispatch'];
}

export {};
