import type { UserConfig } from 'vite';

export const buildConfig = (isBuild: boolean): UserConfig['build'] => ({
  outDir: 'build',
  assetsDir: 'static',
  sourcemap: !isBuild,
  manifest: true,
  emptyOutDir: true,
  minify: isBuild ? 'oxc' : false,
  reportCompressedSize: isBuild,
  chunkSizeWarningLimit: 1000,
  rolldownOptions: {
    output: {
      entryFileNames: 'static/js/[name]-[hash].js',
      chunkFileNames: 'static/js/[name]-[hash].js',
      assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
      // Без этого Vite 8/Rolldown при codeSplitting ломает init antd (белый экран в prod).
      strictExecutionOrder: true,
      codeSplitting: {
        groups: [
          {
            name: 'react-vendor',
            test: /\/node_modules\/(react|react-dom|scheduler)\//,
          },
          {
            name: 'antd',
            test: /\/node_modules\/(antd|@ant-design|@rc-component|rc-[^/]+|dayjs)\//,
          },
        ],
      },
    },
  },
});
