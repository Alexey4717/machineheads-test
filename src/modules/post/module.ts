import type { ISagaModule } from 'redux-dynamic-modules-saga';

import { postReducer, type PostState } from './model/reducer';
import { postSaga } from './model/sagas';

export function getPostModule(): ISagaModule<{ post: PostState }> {
  return {
    id: 'post',
    reducerMap: {
      post: postReducer,
    },
    sagas: [postSaga],
  };
}
