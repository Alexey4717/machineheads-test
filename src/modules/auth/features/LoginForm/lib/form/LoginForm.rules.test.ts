import { describe, expect, it } from 'vitest';

import { loginRules } from './LoginForm.rules';

describe('loginRules', () => {
  it('email: required + email type', () => {
    expect(loginRules.email).toEqual([
      { required: true, message: 'Укажите e-mail' },
      { type: 'email', message: 'Некорректный e-mail' },
    ]);
  });

  it('password: required', () => {
    expect(loginRules.password).toEqual([
      { required: true, message: 'Укажите пароль' },
    ]);
  });
});
