import { authorActions } from '../../../model/actions';
import type { AuthorState } from '../../../model/types';

interface StateWithAuthor {
  author: AuthorState;
}

/**
 * Диспатчит `removeRequest` и ждёт `removeStatus` success/error.
 * Resolve при успехе; reject при ошибке (для async `confirm.onOk`).
 */
export function waitForAuthorRemove(
  store: {
    getState: () => StateWithAuthor;
    dispatch: (
      action: ReturnType<typeof authorActions.removeRequest>,
    ) => unknown;
    subscribe: (listener: () => void) => () => void;
  },
  id: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const settle = () => {
      const { removeStatus, removeError } = store.getState().author;

      if (removeStatus === 'success') {
        unsubscribe();
        resolve();
        return;
      }

      if (removeStatus === 'error') {
        unsubscribe();
        reject(removeError ?? new Error('Не удалось удалить автора'));
      }
    };

    const unsubscribe = store.subscribe(settle);
    store.dispatch(authorActions.removeRequest(id));

    // На случай синхронного settle (тесты / sync middleware)
    if (store.getState().author.removeStatus !== 'loading') {
      settle();
    }
  });
}
