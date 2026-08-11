import { useState } from 'react';

import { ConfigProvider } from 'antd';

import type { ThemeMode } from '@/core/ui/ThemeSwitch/ThemeSwitch';

import { AppRouter } from './router/AppRouter';
import { getThemeConfig, readStoredTheme, storeTheme } from './styles/theme';

export function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() =>
    readStoredTheme(),
  );

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    storeTheme(mode);
  };

  return (
    <ConfigProvider theme={getThemeConfig(themeMode)}>
      <AppRouter themeMode={themeMode} onThemeChange={handleThemeChange} />
    </ConfigProvider>
  );
}
