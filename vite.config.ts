import { defineConfig } from 'vite';

import { buildConfig } from './config/vite.build.ts';
import { plugins } from './config/vite.plugins.ts';
import { resolveConfig } from './config/vite.resolve.ts';
import { serverConfig } from './config/vite.server.ts';

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';

  return {
    base: (process.env.PUBLIC_URL || '').replace(/\/?$/, '/'),
    plugins: plugins(isBuild),
    resolve: resolveConfig,
    server: serverConfig,
    build: buildConfig(isBuild),
    publicDir: 'public',
    logLevel: 'info',
  };
});
