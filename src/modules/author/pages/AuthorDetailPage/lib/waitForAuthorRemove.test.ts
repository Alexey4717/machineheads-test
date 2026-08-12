import { legacy_createStore as createStore } from 'redux';
import { describe, expect, it } from 'vitest';

import { authorActions } from '../../../model/actions';
import { authorInitialState, authorReducer } from '../../../model/reducer';
import type { AuthorState } from '../../../model/types';
import { waitForAuthorRemove } from './waitForAuthorRemove';

describe('waitForAuthorRemove', () => {
  it('резолвит при removeSuccess', async () => {
    const store = createStore(
      (
        state: { author: AuthorState } = { author: authorInitialState },
        action: { type: string },
      ) => ({
        author: authorReducer(state.author, action),
      }),
    );

    const promise = waitForAuthorRemove(store, 7);

    expect(store.getState().author.removeStatus).toBe('loading');
    store.dispatch(authorActions.removeSuccess(7));

    await expect(promise).resolves.toBeUndefined();
  });

  it('реджектит при removeFailure', async () => {
    const store = createStore(
      (
        state: { author: AuthorState } = { author: authorInitialState },
        action: { type: string },
      ) => ({
        author: authorReducer(state.author, action),
      }),
    );

    const error = { kind: 'unknown' as const, message: 'fail' };
    const promise = waitForAuthorRemove(store, 7);

    store.dispatch(authorActions.removeFailure(error));

    await expect(promise).rejects.toEqual(error);
  });
});
