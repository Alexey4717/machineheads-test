import type { UserConfig } from 'vite';

export const serverConfig: UserConfig['server'] = {
  port: 3000,
  host: true,
  open: true,
  proxy: {
    '/api': {
      target: 'https://rest-test.machineheads.ru',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
};
