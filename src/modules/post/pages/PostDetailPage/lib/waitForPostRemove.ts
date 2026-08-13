import { postActions } from '../../../model/actions';
import type { PostState } from '../../../model/types';

interface StateWithPost {
  post: PostState;
}

/**
 * Диспатчит `removeRequest` и ждёт `removeStatus` success/error.
 * Resolve при успехе; reject при ошибке (для async `confirm.onOk`).
 */
export function waitForPostRemove(
  store: {
    getState: () => StateWithPost;
    dispatch: (action: ReturnType<typeof postActions.removeRequest>) => unknown;
    subscribe: (listener: () => void) => () => void;
  },
  id: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const settle = () => {
      const { removeStatus, removeError } = store.getState().post;

      if (removeStatus === 'success') {
        unsubscribe();
        resolve();
        return;
      }

      if (removeStatus === 'error') {
        unsubscribe();
        reject(removeError ?? new Error('Не удалось удалить пост'));
      }
    };

    const unsubscribe = store.subscribe(settle);
    store.dispatch(postActions.removeRequest(id));

    if (store.getState().post.removeStatus !== 'loading') {
      settle();
    }
  });
}
