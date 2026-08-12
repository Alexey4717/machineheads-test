import { useState } from 'react';

import { App as AntApp, ConfigProvider } from 'antd';

import { appMessageConfig } from '@/core/lib/message/appMessageConfig';
import { AppMessageHolder } from '@/core/lib/message/AppMessageHolder';
import type { ThemeMode } from '@/core/ui/ThemeSwitch/ThemeSwitch';

import { AppRouter } from './router/AppRouter';
import { getThemeConfig, readStoredTheme, storeTheme } from './styles/theme';

export const App = () => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() =>
    readStoredTheme(),
  );

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    storeTheme(mode);
  };

  return (
    <ConfigProvider theme={getThemeConfig(themeMode)}>
      <AntApp component={false} message={appMessageConfig}>
        <AppMessageHolder />
        <AppRouter themeMode={themeMode} onThemeChange={handleThemeChange} />
      </AntApp>
    </ConfigProvider>
  );
};
