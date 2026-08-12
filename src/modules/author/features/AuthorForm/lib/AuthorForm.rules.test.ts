import { describe, expect, it } from 'vitest';

import { authorFormRules } from './AuthorForm.rules';

describe('authorFormRules', () => {
  it('name: required', () => {
    expect(authorFormRules.name).toEqual([
      { required: true, message: 'Укажите имя' },
    ]);
  });

  it('lastName: required', () => {
    expect(authorFormRules.lastName).toEqual([
      { required: true, message: 'Укажите фамилию' },
    ]);
  });

  it('secondName: required', () => {
    expect(authorFormRules.secondName).toEqual([
      { required: true, message: 'Укажите отчество' },
    ]);
  });

  it('shortDescription: required', () => {
    expect(authorFormRules.shortDescription).toEqual([
      { required: true, message: 'Укажите краткое описание' },
    ]);
  });

  it('description: required', () => {
    expect(authorFormRules.description).toEqual([
      { required: true, message: 'Укажите описание' },
    ]);
  });
});
