import type { ISagaModule } from 'redux-dynamic-modules-saga';

import { postReducer } from './model/reducer';
import { postSaga } from './model/sagas';
import type { PostState } from './model/types';

export function getPostModule(): ISagaModule<{ post: PostState }> {
  return {
    id: 'post',
    reducerMap: {
      post: postReducer,
    },
    sagas: [postSaga],
    retained: true,
  };
}
