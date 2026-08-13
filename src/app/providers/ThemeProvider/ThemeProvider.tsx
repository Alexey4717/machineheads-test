/* eslint-disable react-refresh/only-export-components -- провайдер темы и хук контекста */
import { createContext, type ReactNode, useContext, useState } from 'react';

import { ConfigProvider } from 'antd';

import type { ThemeMode } from '@/core/ui/ThemeSwitch/ThemeSwitch';

import {
  getThemeConfig,
  readStoredTheme,
  storeTheme,
} from '../../styles/theme';

interface ThemeContextValue {
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useThemeMode = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeMode must be used within ThemeProvider');
  }

  return context;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() =>
    readStoredTheme(),
  );

  const onThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    storeTheme(mode);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, onThemeChange }}>
      <ConfigProvider theme={getThemeConfig(themeMode)}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
