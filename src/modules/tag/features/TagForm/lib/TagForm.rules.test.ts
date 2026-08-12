import { describe, expect, it } from 'vitest';

import { tagFormRules } from './TagForm.rules';

describe('tagFormRules', () => {
  it('code: required', () => {
    expect(tagFormRules.code).toEqual([
      { required: true, message: 'Укажите код' },
    ]);
  });

  it('name: required', () => {
    expect(tagFormRules.name).toEqual([
      { required: true, message: 'Укажите название' },
    ]);
  });

  it('sort: required + number', () => {
    expect(tagFormRules.sort).toEqual([
      { required: true, message: 'Укажите сортировку' },
      { type: 'number', message: 'Сортировка должна быть числом' },
    ]);
  });
});
