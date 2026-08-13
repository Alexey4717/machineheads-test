import type { ISagaModule } from 'redux-dynamic-modules-saga';

import { authorReducer } from './model/reducer';
import { authorSaga } from './model/sagas';
import type { AuthorState } from './model/types';

export function getAuthorModule(): ISagaModule<{ author: AuthorState }> {
  return {
    id: 'author',
    reducerMap: {
      author: authorReducer,
    },
    sagas: [authorSaga],
    retained: true,
  };
}
