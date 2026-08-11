import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

import type { ThemeMode } from '@/core/ui/ThemeSwitch/ThemeSwitch';

export const THEME_STORAGE_KEY = 'app-theme';

export function getThemeConfig(mode: ThemeMode): ThemeConfig {
  return {
    algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#1677ff',
      borderRadius: 6,
    },
  };
}

export function readStoredTheme(): ThemeMode {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === 'dark' ? 'dark' : 'light';
}

export function storeTheme(mode: ThemeMode): void {
  localStorage.setItem(THEME_STORAGE_KEY, mode);
}
