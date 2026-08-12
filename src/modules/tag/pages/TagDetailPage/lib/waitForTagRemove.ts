import { tagActions } from '../../../model/actions';
import type { TagState } from '../../../model/types';

interface StateWithTag {
  tag: TagState;
}

/**
 * Диспатчит `removeRequest` и ждёт `removeStatus` success/error.
 * Resolve при успехе; reject при ошибке (для async `confirm.onOk`).
 */
export function waitForTagRemove(
  store: {
    getState: () => StateWithTag;
    dispatch: (action: ReturnType<typeof tagActions.removeRequest>) => unknown;
    subscribe: (listener: () => void) => () => void;
  },
  id: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const settle = () => {
      const { removeStatus, removeError } = store.getState().tag;

      if (removeStatus === 'success') {
        unsubscribe();
        resolve();
        return;
      }

      if (removeStatus === 'error') {
        unsubscribe();
        reject(removeError ?? new Error('Не удалось удалить тег'));
      }
    };

    const unsubscribe = store.subscribe(settle);
    store.dispatch(tagActions.removeRequest(id));

    // На случай синхронного settle (тесты / sync middleware)
    if (store.getState().tag.removeStatus !== 'loading') {
      settle();
    }
  });
}
