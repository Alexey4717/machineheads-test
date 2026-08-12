import Cookies from 'js-cookie';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  clearAuthTokens,
  getAccessExpiredAt,
  getAccessToken,
  getRefreshToken,
  hasAuthSession,
  setAuthTokens,
} from './cookies';

vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

const mockedGet = Cookies.get as unknown as ReturnType<typeof vi.fn>;
const mockedSet = Cookies.set as unknown as ReturnType<typeof vi.fn>;
const mockedRemove = Cookies.remove as unknown as ReturnType<typeof vi.fn>;

describe('cookies auth helpers', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('читает access и refresh токены', () => {
    mockedGet.mockImplementation((key: string) => {
      if (key === 'access_token') return 'access';
      if (key === 'refresh_token') return 'refresh';
      return undefined;
    });

    expect(getAccessToken()).toBe('access');
    expect(getRefreshToken()).toBe('refresh');
  });

  it('читает access_expired_at как number', () => {
    mockedGet.mockReturnValue('1710000000');
    expect(getAccessExpiredAt()).toBe(1710000000);
  });

  it('setAuthTokens пишет токены и optional expiry', () => {
    setAuthTokens({
      access_token: 'a',
      refresh_token: 'r',
      access_expired_at: 10,
      refresh_expired_at: 20,
    });

    expect(mockedSet).toHaveBeenCalledWith('access_token', 'a');
    expect(mockedSet).toHaveBeenCalledWith('refresh_token', 'r');
    expect(mockedSet).toHaveBeenCalledWith('access_expired_at', '10');
    expect(mockedSet).toHaveBeenCalledWith('refresh_expired_at', '20');
  });

  it('clearAuthTokens удаляет все ключи', () => {
    clearAuthTokens();

    expect(mockedRemove).toHaveBeenCalledWith('access_token');
    expect(mockedRemove).toHaveBeenCalledWith('refresh_token');
    expect(mockedRemove).toHaveBeenCalledWith('access_expired_at');
    expect(mockedRemove).toHaveBeenCalledWith('refresh_expired_at');
  });

  it('hasAuthSession true при любом токене', () => {
    mockedGet.mockImplementation((key: string) =>
      key === 'refresh_token' ? 'r' : undefined,
    );
    expect(hasAuthSession()).toBe(true);
  });

  it('hasAuthSession false без токенов', () => {
    mockedGet.mockReturnValue(undefined);
    expect(hasAuthSession()).toBe(false);
  });
});
