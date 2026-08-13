import { legacy_createStore as createStore } from 'redux';
import { describe, expect, it } from 'vitest';

import { postActions } from '../../../model/actions';
import { postInitialState, postReducer } from '../../../model/reducer';
import type { PostState } from '../../../model/types';
import { waitForPostRemove } from './waitForPostRemove';

describe('waitForPostRemove', () => {
  it('резолвит при removeSuccess', async () => {
    const store = createStore(
      (
        state: { post: PostState } = { post: postInitialState },
        action: { type: string },
      ) => ({
        post: postReducer(state.post, action),
      }),
    );

    const promise = waitForPostRemove(store, 7);

    expect(store.getState().post.removeStatus).toBe('loading');
    store.dispatch(postActions.removeSuccess(7));

    await expect(promise).resolves.toBeUndefined();
  });

  it('реджектит при removeFailure', async () => {
    const store = createStore(
      (
        state: { post: PostState } = { post: postInitialState },
        action: { type: string },
      ) => ({
        post: postReducer(state.post, action),
      }),
    );

    const error = { kind: 'unknown' as const, message: 'fail' };
    const promise = waitForPostRemove(store, 7);

    store.dispatch(postActions.removeFailure(error));

    await expect(promise).rejects.toEqual(error);
  });
});
