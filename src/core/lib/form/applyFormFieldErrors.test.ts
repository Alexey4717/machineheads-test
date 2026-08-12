import { describe, expect, it, vi } from 'vitest';

import { applyFormFieldErrors } from './applyFormFieldErrors';

describe('applyFormFieldErrors', () => {
  it('ставит ошибки полей при validation', () => {
    const setFields = vi.fn();
    const form = { setFields } as never;

    applyFormFieldErrors(form, {
      kind: 'validation',
      status: 422,
      fields: [
        { field: 'code', message: 'Занят' },
        { field: 'name', message: 'Обязательно' },
      ],
    });

    expect(setFields).toHaveBeenCalledWith([
      { name: 'code', errors: ['Занят'] },
      { name: 'name', errors: ['Обязательно'] },
    ]);
  });

  it('игнорирует system/unknown', () => {
    const setFields = vi.fn();
    const form = { setFields } as never;

    applyFormFieldErrors(form, {
      kind: 'system',
      status: 500,
      error: { message: 'fail' },
    });
    applyFormFieldErrors(form, {
      kind: 'unknown',
      message: 'fail',
    });

    expect(setFields).not.toHaveBeenCalled();
  });
});
