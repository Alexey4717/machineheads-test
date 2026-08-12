import MockAdapter from 'axios-mock-adapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const getAccessToken = vi.hoisted(() => vi.fn());
const getRefreshToken = vi.hoisted(() => vi.fn());
const setAuthTokens = vi.hoisted(() => vi.fn());
const clearAuthTokens = vi.hoisted(() => vi.fn());
const notifySessionExpired = vi.hoisted(() => vi.fn());

vi.mock('../lib/cookies/cookies', () => ({
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
  clearAuthTokens,
}));

vi.mock('./sessionEvents', () => ({
  notifySessionExpired,
}));

vi.mock('../config/env', () => ({
  getApiBaseUrl: () => 'http://api.test',
}));

describe('apiClient interceptors', () => {
  beforeEach(() => {
    vi.resetModules();
    getAccessToken.mockReset();
    getRefreshToken.mockReset();
    setAuthTokens.mockReset();
    clearAuthTokens.mockReset();
    notifySessionExpired.mockReset();
  });

  afterEach(async () => {
    const { apiClient } = await import('./apiClient');
    // ensure no leftover adapters between tests
    void apiClient;
  });

  it('добавляет Authorization Bearer из cookies', async () => {
    getAccessToken.mockReturnValue('old-access');
    const { apiClient } = await import('./apiClient');
    const mock = new MockAdapter(apiClient);

    mock.onGet('/manage/posts').reply((config) => {
      expect(config.headers?.Authorization).toBe('Bearer old-access');
      return [200, []];
    });

    await apiClient.get('/manage/posts');
    mock.restore();
  });

  it('при 401 без refresh токена чистит сессию', async () => {
    getAccessToken.mockReturnValue('old-access');
    getRefreshToken.mockReturnValue(undefined);
    const { apiClient } = await import('./apiClient');
    const mock = new MockAdapter(apiClient);
    mock.onGet('/manage/posts').reply(401);

    await expect(apiClient.get('/manage/posts')).rejects.toBeTruthy();
    expect(clearAuthTokens).toHaveBeenCalled();
    expect(notifySessionExpired).toHaveBeenCalled();
    mock.restore();
  });
});
