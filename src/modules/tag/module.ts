import type { ISagaModule } from 'redux-dynamic-modules-saga';

import { tagReducer, type TagState } from './model/reducer';
import { tagSaga } from './model/sagas';

export function getTagModule(): ISagaModule<{ tag: TagState }> {
  return {
    id: 'tag',
    reducerMap: {
      tag: tagReducer,
    },
    sagas: [tagSaga],
  };
}
