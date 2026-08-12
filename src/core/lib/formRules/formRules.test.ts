import { describe, expect, it } from 'vitest';

import { email, minLen, required } from './formRules';

describe('formRules', () => {
  it('required возвращает правило с сообщением', () => {
    expect(required('Укажите e-mail')).toEqual({
      required: true,
      message: 'Укажите e-mail',
    });
  });

  it('email использует дефолтное сообщение', () => {
    expect(email()).toEqual({
      type: 'email',
      message: 'Некорректный e-mail',
    });
  });

  it('email принимает кастомное сообщение', () => {
    expect(email('Плохой email')).toEqual({
      type: 'email',
      message: 'Плохой email',
    });
  });

  it('minLen задаёт минимальную длину', () => {
    expect(minLen(8, 'Минимум 8 символов')).toEqual({
      min: 8,
      message: 'Минимум 8 символов',
    });
  });
});
