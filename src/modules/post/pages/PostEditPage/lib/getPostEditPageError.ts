import { getErrorMessage } from '@/core/api/errorParsers';
import type { NormalizedApiError } from '@/core/api/errorTypes';
import type { PageError } from '@/core/ui/Page/Page';

interface GetPostEditPageErrorParams {
  isInvalidId: boolean;
  detailError: NormalizedApiError | null;
}

/** Ошибка оболочки Page для редактирования поста. */
export function getPostEditPageError({
  isInvalidId,
  detailError,
}: GetPostEditPageErrorParams): PageError | null {
  if (isInvalidId) {
    return {
      status: 404,
      title: 'Пост не найден',
      subtitle: 'Некорректный идентификатор',
    };
  }

  if (!detailError) {
    return null;
  }

  return {
    status:
      detailError.kind === 'system' && detailError.status === 404
        ? 404
        : 'error',
    title: 'Не удалось загрузить пост',
    subtitle: getErrorMessage(detailError),
  };
}
