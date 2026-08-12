import type { NormalizedApiError } from '@/core/api/errorTypes';

import { getAuthorEditPageError } from './getAuthorEditPageError';

describe('getAuthorEditPageError', () => {
  it('возвращает 404 при некорректном id', () => {
    expect(
      getAuthorEditPageError({ isInvalidId: true, detailError: null }),
    ).toEqual({
      status: 404,
      title: 'Автор не найден',
      subtitle: 'Некорректный идентификатор',
    });
  });

  it('возвращает null без ошибки загрузки', () => {
    expect(
      getAuthorEditPageError({ isInvalidId: false, detailError: null }),
    ).toBeNull();
  });

  it('мапит system 404 в статус 404', () => {
    const detailError: NormalizedApiError = {
      kind: 'system',
      status: 404,
      error: { message: 'Not found' },
    };

    expect(getAuthorEditPageError({ isInvalidId: false, detailError })).toEqual(
      {
        status: 404,
        title: 'Не удалось загрузить автора',
        subtitle: 'Not found',
      },
    );
  });

  it('мапит прочие ошибки в status error', () => {
    const detailError: NormalizedApiError = {
      kind: 'unknown',
      message: 'Сеть недоступна',
    };

    expect(getAuthorEditPageError({ isInvalidId: false, detailError })).toEqual(
      {
        status: 'error',
        title: 'Не удалось загрузить автора',
        subtitle: 'Сеть недоступна',
      },
    );
  });
});
