import axios from 'axios';
import { describe, expect, it } from 'vitest';

import { getErrorMessage, normalizeApiError } from './errorParsers';

describe('normalizeApiError', () => {
  it('нормализует 422 validation errors', () => {
    const error = {
      isAxiosError: true,
      message: 'Request failed',
      response: {
        status: 422,
        data: [
          { field: 'email', message: 'Некорректный e-mail' },
          { field: 'password', message: 'Слишком короткий пароль' },
        ],
      },
      toJSON: () => ({}),
      name: 'AxiosError',
    };

    expect(axios.isAxiosError(error)).toBe(true);
    expect(normalizeApiError(error)).toEqual({
      kind: 'validation',
      status: 422,
      fields: [
        { field: 'email', message: 'Некорректный e-mail' },
        { field: 'password', message: 'Слишком короткий пароль' },
      ],
    });
  });

  it('нормализует system api error', () => {
    const error = {
      isAxiosError: true,
      message: 'Request failed',
      response: {
        status: 500,
        data: {
          name: 'Internal',
          message: 'Сервер недоступен',
          code: 500,
          status: 500,
        },
      },
      toJSON: () => ({}),
      name: 'AxiosError',
    };

    expect(normalizeApiError(error)).toEqual({
      kind: 'system',
      status: 500,
      error: {
        name: 'Internal',
        message: 'Сервер недоступен',
        code: 500,
        status: 500,
      },
    });
  });

  it('возвращает unknown для не-axios ошибок', () => {
    expect(normalizeApiError(new Error('boom'))).toEqual({
      kind: 'unknown',
      message: 'boom',
    });
  });

  it('возвращает unknown для axios без распознанного body', () => {
    const error = {
      isAxiosError: true,
      message: 'Network Error',
      response: { status: 404, data: 'not-json' },
      toJSON: () => ({}),
      name: 'AxiosError',
    };

    expect(normalizeApiError(error)).toEqual({
      kind: 'unknown',
      status: 404,
      message: 'Network Error',
    });
  });
});

describe('getErrorMessage', () => {
  it('берёт первое поле validation', () => {
    expect(
      getErrorMessage({
        kind: 'validation',
        status: 422,
        fields: [{ field: 'email', message: 'Укажите e-mail' }],
      }),
    ).toBe('Укажите e-mail');
  });

  it('берёт message system error', () => {
    expect(
      getErrorMessage({
        kind: 'system',
        status: 403,
        error: { message: 'Доступ запрещён' },
      }),
    ).toBe('Доступ запрещён');
  });

  it('берёт message unknown error', () => {
    expect(
      getErrorMessage({ kind: 'unknown', message: 'Неизвестная ошибка' }),
    ).toBe('Неизвестная ошибка');
  });
});
