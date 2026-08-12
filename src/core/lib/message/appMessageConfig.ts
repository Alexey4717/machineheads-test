import type { ConfigOptions as MessageConfig } from 'antd/es/message/interface';

/**
 * antd `message` hardcodes `placement: 'top'` (no `placement` in ConfigOptions).
 * Default `.ant-message-top` uses `left: 50%` + `transform: translateX(-50%)` and
 * `height: 100vh`. A partial `styles.list` (only bottom/inset) left that transform
 * in place and pushed the toast off-screen to the top-left.
 *
 * Remap the list + notice root to bottom-right (same idea as notification
 * `bottomRight`): clear centering transform, auto height, right-align notices.
 * List padding (`--notification-margin-edge`) keeps ~24px inset from the edges.
 * `getContainer: document.body` avoids clipping by layout overflow (sidebar).
 */
export const appMessageConfig: MessageConfig = {
  getContainer: () => document.body,
  styles: {
    list: {
      top: 'auto',
      bottom: 0,
      left: 0,
      right: 0,
      transform: 'none',
      height: 'auto',
      flexDirection: 'column-reverse',
    },
    root: {
      left: 'auto',
      right: 0,
      // Drop translateX(-50%) from `.ant-message-top`; keep stack scale var.
      transform: 'scale(var(--notification-scale, 1))',
    },
  },
};
