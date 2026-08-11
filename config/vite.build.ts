import type { UserConfig } from 'vite';

export const buildConfig = (isBuild: boolean): UserConfig['build'] => ({
  outDir: 'build',
  assetsDir: 'static',
  sourcemap: !isBuild,
  manifest: true,
  emptyOutDir: true,
  minify: isBuild ? 'oxc' : false,
  reportCompressedSize: isBuild,
  rolldownOptions: {
    output: {
      entryFileNames: 'static/js/[name]-[hash].js',
      chunkFileNames: 'static/js/[name]-[hash].js',
      assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
      codeSplitting: {
        groups: [
          { name: 'antd', test: /\/node_modules\/antd\// },
          { name: 'antd-icons', test: /\/node_modules\/@ant-design\/icons\// },
          { name: 'antd-cssinjs', test: /\/node_modules\/@ant-design\/cssinjs/ },
          { name: 'rc-components', test: /\/node_modules\/rc-[^/]+\// },
          { name: 'dayjs', test: /\/node_modules\/dayjs\// },
          {
            name: 'react-vendor',
            test: /\/node_modules\/(react|react-dom|scheduler)\//,
          },
        ],
      },
    },
  },
});
