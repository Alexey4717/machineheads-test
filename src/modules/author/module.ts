import type { ISagaModule } from 'redux-dynamic-modules-saga';

import { authorReducer, type AuthorState } from './model/reducer';
import { authorSaga } from './model/sagas';

export function getAuthorModule(): ISagaModule<{ author: AuthorState }> {
  return {
    id: 'author',
    reducerMap: {
      author: authorReducer,
    },
    sagas: [authorSaga],
  };
}
