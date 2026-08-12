import type { CSSProperties } from 'react';

import { describe, expect, it } from 'vitest';

import { appMessageConfig } from './appMessageConfig';

interface MessageSemanticStyles {
  list?: CSSProperties;
  root?: CSSProperties;
}

describe('appMessageConfig', () => {
  const styles = appMessageConfig.styles as MessageSemanticStyles;

  it('монтирует toast в document.body', () => {
    expect(appMessageConfig.getContainer?.()).toBe(document.body);
  });

  it('позиционирует list внизу справа без translateX(-50%) и без height 100vh', () => {
    expect(styles.list).toMatchObject({
      top: 'auto',
      bottom: 0,
      left: 0,
      right: 0,
      transform: 'none',
      height: 'auto',
      flexDirection: 'column-reverse',
    });
  });

  it('выравнивает notice root по правому краю без центрирующего translate', () => {
    expect(styles.root).toMatchObject({
      left: 'auto',
      right: 0,
    });
    expect(styles.root?.transform).toContain(
      'scale(var(--notification-scale, 1))',
    );
    expect(styles.root?.transform).not.toContain('-50%');
  });
});
