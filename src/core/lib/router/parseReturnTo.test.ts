import { describe, expect, it } from 'vitest';

import { parseReturnTo, withReturnTo } from './parseReturnTo';

describe('parseReturnTo', () => {
  it('читает returnTo из search', () => {
    expect(parseReturnTo('?returnTo=%2Fposts%2Fnew')).toBe('/posts/new');
    expect(parseReturnTo('returnTo=/posts/5/edit')).toBe('/posts/5/edit');
  });

  it('возвращает null без параметра или при пустом значении', () => {
    expect(parseReturnTo('')).toBeNull();
    expect(parseReturnTo('?page=1')).toBeNull();
    expect(parseReturnTo('?returnTo=')).toBeNull();
  });

  it('отклоняет open redirect (не relative path)', () => {
    expect(parseReturnTo('?returnTo=https://evil.example')).toBeNull();
    expect(parseReturnTo('?returnTo=//evil.example')).toBeNull();
    expect(parseReturnTo('?returnTo=posts/new')).toBeNull();
  });
});

describe('withReturnTo', () => {
  it('кодирует returnTo в query', () => {
    expect(withReturnTo('/authors/new', '/posts/new')).toBe(
      '/authors/new?returnTo=%2Fposts%2Fnew',
    );
  });
});
