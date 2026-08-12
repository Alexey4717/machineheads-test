import { getErrorMessage } from '@/core/api/errorParsers';
import type { NormalizedApiError } from '@/core/api/errorTypes';
import type { PageError } from '@/core/ui/Page/Page';

interface GetAuthorEditPageErrorParams {
  isInvalidId: boolean;
  detailError: NormalizedApiError | null;
}

/** Ошибка оболочки Page для редактирования автора. */
export function getAuthorEditPageError({
  isInvalidId,
  detailError,
}: GetAuthorEditPageErrorParams): PageError | null {
  if (isInvalidId) {
    return {
      status: 404,
      title: 'Автор не найден',
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
    title: 'Не удалось загрузить автора',
    subtitle: getErrorMessage(detailError),
  };
}
