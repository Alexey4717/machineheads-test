import type { NormalizedApiError } from '@/core/api/errorTypes';

import { getPostEditPageError } from './getPostEditPageError';

describe('getPostEditPageError', () => {
  it('возвращает 404 при некорректном id', () => {
    expect(
      getPostEditPageError({ isInvalidId: true, detailError: null }),
    ).toEqual({
      status: 404,
      title: 'Пост не найден',
      subtitle: 'Некорректный идентификатор',
    });
  });

  it('возвращает null без ошибки загрузки', () => {
    expect(
      getPostEditPageError({ isInvalidId: false, detailError: null }),
    ).toBeNull();
  });

  it('мапит system 404 в статус 404', () => {
    const detailError: NormalizedApiError = {
      kind: 'system',
      status: 404,
      error: { message: 'Not found' },
    };

    expect(getPostEditPageError({ isInvalidId: false, detailError })).toEqual({
      status: 404,
      title: 'Не удалось загрузить пост',
      subtitle: 'Not found',
    });
  });

  it('мапит прочие ошибки в status error', () => {
    const detailError: NormalizedApiError = {
      kind: 'unknown',
      message: 'Сеть недоступна',
    };

    expect(getPostEditPageError({ isInvalidId: false, detailError })).toEqual({
      status: 'error',
      title: 'Не удалось загрузить пост',
      subtitle: 'Сеть недоступна',
    });
  });
});
