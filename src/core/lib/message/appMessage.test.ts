import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  APP_MESSAGE_ERROR_TEXT,
  appMessageError,
  appMessageSuccess,
  setAppMessageApi,
} from './appMessage';

describe('appMessage', () => {
  const success = vi.fn();
  const error = vi.fn();

  beforeEach(() => {
    success.mockReset();
    error.mockReset();
    setAppMessageApi({
      success,
      error,
      info: vi.fn(),
      warning: vi.fn(),
      loading: vi.fn(),
      open: vi.fn(),
      destroy: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('appMessageSuccess делегирует в message.success', () => {
    appMessageSuccess('Тег создан');
    expect(success).toHaveBeenCalledWith('Тег создан');
  });

  it('appMessageError логирует и показывает дефолтный текст', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const err = new Error('boom');

    appMessageError(err);

    expect(consoleError).toHaveBeenCalledWith(err);
    expect(error).toHaveBeenCalledWith(APP_MESSAGE_ERROR_TEXT);
  });

  it('appMessageError принимает кастомный текст', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    appMessageError(new Error('x'), 'Кастом');

    expect(error).toHaveBeenCalledWith('Кастом');
  });
});
