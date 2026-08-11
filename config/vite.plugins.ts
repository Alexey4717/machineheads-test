import react from '@vitejs/plugin-react';
import type { PluginOption } from 'vite';
import checker from 'vite-plugin-checker';

export function plugins(isBuild: boolean): PluginOption[] {
  const pluginList: (PluginOption | false | null | undefined)[] = [
    react(),
    !isBuild &&
      checker({
        typescript: { tsconfigPath: './tsconfig.app.json' },
        eslint: {
          lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
          useFlatConfig: true,
        },
        overlay: { initialIsOpen: 'error' },
      }),
  ];

  return pluginList.filter((plugin): plugin is PluginOption => Boolean(plugin));
}
