import { describe, expect, it } from 'vitest';

import { resolveApiBaseUrl } from './env';

describe('resolveApiBaseUrl', () => {
  it('подставляет /api, если значение пустое', () => {
    expect(resolveApiBaseUrl(undefined)).toBe('/api');
    expect(resolveApiBaseUrl('')).toBe('/api');
  });

  it('оставляет явный URL без изменений', () => {
    expect(resolveApiBaseUrl('/api')).toBe('/api');
    expect(resolveApiBaseUrl('https://rest-test.machineheads.ru')).toBe(
      'https://rest-test.machineheads.ru',
    );
  });

  it('чинит путь Git Bash вместо /api', () => {
    expect(resolveApiBaseUrl('C:/Program Files/Git/api')).toBe('/api');
    expect(resolveApiBaseUrl('C:\\Program Files\\Git\\api')).toBe('/api');
  });
});
