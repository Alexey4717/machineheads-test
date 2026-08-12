import type { NormalizedApiError } from '@/core/api/errorTypes';

import { getTagEditPageError } from './getTagEditPageError';

describe('getTagEditPageError', () => {
  it('возвращает 404 при некорректном id', () => {
    expect(
      getTagEditPageError({ isInvalidId: true, detailError: null }),
    ).toEqual({
      status: 404,
      title: 'Тег не найден',
      subtitle: 'Некорректный идентификатор',
    });
  });

  it('возвращает null без ошибки загрузки', () => {
    expect(
      getTagEditPageError({ isInvalidId: false, detailError: null }),
    ).toBeNull();
  });

  it('мапит system 404 в статус 404', () => {
    const detailError: NormalizedApiError = {
      kind: 'system',
      status: 404,
      error: { message: 'Not found' },
    };

    expect(getTagEditPageError({ isInvalidId: false, detailError })).toEqual({
      status: 404,
      title: 'Не удалось загрузить тег',
      subtitle: 'Not found',
    });
  });

  it('мапит прочие ошибки в status error', () => {
    const detailError: NormalizedApiError = {
      kind: 'unknown',
      message: 'Сеть недоступна',
    };

    expect(getTagEditPageError({ isInvalidId: false, detailError })).toEqual({
      status: 'error',
      title: 'Не удалось загрузить тег',
      subtitle: 'Сеть недоступна',
    });
  });
});
