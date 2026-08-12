import { describe, expect, it } from 'vitest';

import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('форматирует валидную дату в ru-RU', () => {
    const value = '2024-01-15T12:30:00.000Z';
    expect(formatDate(value)).toBe(new Date(value).toLocaleString('ru-RU'));
  });

  it('возвращает исходную строку при невалидной дате', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date');
    expect(formatDate('')).toBe('');
  });
});
