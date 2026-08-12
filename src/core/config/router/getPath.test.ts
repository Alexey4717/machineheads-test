import { describe, expect, it } from 'vitest';

import { getPath } from './getPath';
import { PATHS } from './paths';

describe('getPath', () => {
  it('возвращает статический путь без params', () => {
    expect(getPath(PATHS.POSTS)).toBe('/posts');
    expect(getPath(PATHS.LOGIN)).toBe('/login');
  });

  it('подставляет динамический :id', () => {
    expect(getPath(PATHS.POST_EDIT, { id: 42 })).toBe('/posts/42/edit');
    expect(getPath(PATHS.POST_DETAIL, { id: 42 })).toBe('/posts/42');
    expect(getPath(PATHS.AUTHOR_EDIT, { id: '7' })).toBe('/authors/7/edit');
    expect(getPath(PATHS.AUTHOR_DETAIL, { id: '7' })).toBe('/authors/7');
    expect(getPath(PATHS.TAG_EDIT, { id: 1 })).toBe('/tags/1/edit');
    expect(getPath(PATHS.TAG_DETAIL, { id: 1 })).toBe('/tags/1');
  });

  it('бросает при отсутствии args для динамического пути', () => {
    expect(() =>
      // @ts-expect-error — проверяем runtime без params
      getPath(PATHS.POST_EDIT),
    ).toThrow(/Missing args/);
  });

  it('бросает при отсутствии обязательного param', () => {
    expect(() =>
      // @ts-expect-error — намеренно неполный params
      getPath(PATHS.POST_EDIT, {}),
    ).toThrow(/Missing arg id/);
  });

  it('бросает на невалидном шаблоне', () => {
    const build = getPath as (
      path: string,
      params?: Record<string, string | number>,
    ) => string;

    expect(() => build('//bad')).toThrow(/Invalid path template/);
  });
});
