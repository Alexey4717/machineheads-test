import { getErrorMessage } from '@/core/api/errorParsers';
import type { NormalizedApiError } from '@/core/api/errorTypes';
import type { PageError } from '@/core/ui/Page/Page';

interface GetTagEditPageErrorParams {
  isInvalidId: boolean;
  detailError: NormalizedApiError | null;
}

/** Ошибка оболочки Page для редактирования тега. */
export function getTagEditPageError({
  isInvalidId,
  detailError,
}: GetTagEditPageErrorParams): PageError | null {
  if (isInvalidId) {
    return {
      status: 404,
      title: 'Тег не найден',
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
    title: 'Не удалось загрузить тег',
    subtitle: getErrorMessage(detailError),
  };
}
