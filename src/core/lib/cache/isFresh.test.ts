import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_STALE_TIME_MS, isFresh } from './isFresh';

describe('isFresh', () => {
  const now = 1_700_000_000_000;

  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(now);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('undefined → false', () => {
    expect(isFresh(undefined)).toBe(false);
  });

  it('fetchedAt 0 → false', () => {
    expect(isFresh(0)).toBe(false);
  });

  it('свежая метка внутри TTL → true', () => {
    expect(isFresh(now)).toBe(true);
    expect(isFresh(now - DEFAULT_STALE_TIME_MS + 1)).toBe(true);
  });

  it('ровно TTL и старше → false', () => {
    expect(isFresh(now - DEFAULT_STALE_TIME_MS)).toBe(false);
    expect(isFresh(now - DEFAULT_STALE_TIME_MS - 1)).toBe(false);
  });
});
