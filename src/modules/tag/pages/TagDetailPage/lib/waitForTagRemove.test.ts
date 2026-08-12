import { legacy_createStore as createStore } from 'redux';
import { describe, expect, it } from 'vitest';

import { tagActions } from '../../../model/actions';
import { tagInitialState, tagReducer } from '../../../model/reducer';
import type { TagState } from '../../../model/types';
import { waitForTagRemove } from './waitForTagRemove';

describe('waitForTagRemove', () => {
  it('резолвит при removeSuccess', async () => {
    const store = createStore(
      (
        state: { tag: TagState } = { tag: tagInitialState },
        action: { type: string },
      ) => ({
        tag: tagReducer(state.tag, action),
      }),
    );

    const promise = waitForTagRemove(store, 7);

    expect(store.getState().tag.removeStatus).toBe('loading');
    store.dispatch(tagActions.removeSuccess(7));

    await expect(promise).resolves.toBeUndefined();
  });

  it('реджектит при removeFailure', async () => {
    const store = createStore(
      (
        state: { tag: TagState } = { tag: tagInitialState },
        action: { type: string },
      ) => ({
        tag: tagReducer(state.tag, action),
      }),
    );

    const error = { kind: 'unknown' as const, message: 'fail' };
    const promise = waitForTagRemove(store, 7);

    store.dispatch(tagActions.removeFailure(error));

    await expect(promise).rejects.toEqual(error);
  });
});
