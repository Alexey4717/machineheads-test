import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  notifySessionExpired,
  setSessionExpiredHandler,
} from './sessionEvents';

describe('sessionEvents', () => {
  afterEach(() => {
    setSessionExpiredHandler(() => undefined);
  });

  it('вызывает зарегистрированный handler', () => {
    const handler = vi.fn();
    setSessionExpiredHandler(handler);

    notifySessionExpired();

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
