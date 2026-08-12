import { describe, expect, it } from 'vitest';

import { formatAuthorName } from './formatAuthorName';

describe('formatAuthorName', () => {
  it('собирает ФИО через пробел', () => {
    expect(
      formatAuthorName({
        lastName: 'Иванов',
        name: 'Иван',
        secondName: 'Иванович',
      }),
    ).toBe('Иванов Иван Иванович');
  });

  it('пропускает пустые части', () => {
    expect(
      formatAuthorName({
        lastName: 'Иванов',
        name: 'Иван',
        secondName: '',
      }),
    ).toBe('Иванов Иван');
  });
});
