import type { ISagaModule } from 'redux-dynamic-modules-saga';

import { tagReducer } from './model/reducer';
import { tagSaga } from './model/sagas';
import type { TagState } from './model/types';

export function getTagModule(): ISagaModule<{ tag: TagState }> {
  return {
    id: 'tag',
    reducerMap: {
      tag: tagReducer,
    },
    sagas: [tagSaga],
  };
}
