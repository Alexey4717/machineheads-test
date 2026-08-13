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

  it('при 401 обновляет токен и повторяет запрос с новым Bearer', async () => {
    const axios = (await import('axios')).default;
    const created: ReturnType<typeof axios.create>[] = [];
    const originalCreate = axios.create.bind(axios);
    const createSpy = vi.spyOn(axios, 'create').mockImplementation((config) => {
      const instance = originalCreate(config);
      created.push(instance);
      return instance;
    });

    getAccessToken.mockReturnValue('old-access');
    getRefreshToken.mockReturnValue('refresh-tok');
    setAuthTokens.mockImplementation((tokens) => {
      getAccessToken.mockReturnValue(tokens.access_token);
      getRefreshToken.mockReturnValue(tokens.refresh_token);
    });

    const { apiClient } = await import('./apiClient');
    const apiMock = new MockAdapter(created[0] ?? apiClient);
    const refreshMock = new MockAdapter(created[1] ?? apiClient);

    apiMock.onGet('/manage/posts').replyOnce(401);
    refreshMock.onPost('/auth/token-refresh').reply(200, {
      access_token: 'new-access',
      refresh_token: 'new-refresh',
    });
    apiMock.onGet('/manage/posts').reply((config) => {
      expect(config.headers?.Authorization).toBe('Bearer new-access');
      return [200, []];
    });

    await apiClient.get('/manage/posts');

    expect(setAuthTokens).toHaveBeenCalledWith({
      access_token: 'new-access',
      refresh_token: 'new-refresh',
    });
    expect(clearAuthTokens).not.toHaveBeenCalled();

    apiMock.restore();
    refreshMock.restore();
    createSpy.mockRestore();
  });

  it('при неудачном refresh чистит сессию', async () => {
    const axios = (await import('axios')).default;
    const created: ReturnType<typeof axios.create>[] = [];
    const originalCreate = axios.create.bind(axios);
    const createSpy = vi.spyOn(axios, 'create').mockImplementation((config) => {
      const instance = originalCreate(config);
      created.push(instance);
      return instance;
    });

    getAccessToken.mockReturnValue('old-access');
    getRefreshToken.mockReturnValue('refresh-tok');

    const { apiClient } = await import('./apiClient');
    const apiMock = new MockAdapter(created[0] ?? apiClient);
    const refreshMock = new MockAdapter(created[1] ?? apiClient);

    apiMock.onGet('/manage/posts').reply(401);
    refreshMock.onPost('/auth/token-refresh').reply(401);

    await expect(apiClient.get('/manage/posts')).rejects.toBeTruthy();
    expect(clearAuthTokens).toHaveBeenCalled();
    expect(notifySessionExpired).toHaveBeenCalled();

    apiMock.restore();
    refreshMock.restore();
    createSpy.mockRestore();
  });
});
