import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import boundaries from 'eslint-plugin-boundaries';
import prettier from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';

const rootDir = resolve(fileURLToPath(new URL('.', import.meta.url)));
const srcDir = resolve(rootDir, 'src');

/** Barrel bans shared across layers (exact path imports). */
const restrictedBarrelPaths = [
  {
    name: '@/core',
    message:
      'Не импортируйте barrel @/core — укажите конкретный файл (например @/core/api/apiClient).',
  },
  {
    name: '@/app',
    message:
      'Не импортируйте barrel @/app — укажите конкретный файл (например @/app/App).',
  },
];

/** Deep imports into modules — only public API `@/modules/<name>` is allowed. */
const restrictedModuleDeepPatterns = [
  {
    group: ['@/modules/*/**'],
    message:
      'Импортируйте только public API модуля: @/modules/<name> (index.ts), без deep imports.',
  },
];

/**
 * Порядок импортов задаётся только в prettier.config.mjs (@trivago/prettier-plugin-sort-imports).
 * eslint-plugin-prettier прогоняет Prettier как правило ESLint.
 *
 * Границы слоёв (core / modules / app / main):
 * - eslint-plugin-boundaries (нужен import/resolver для `@/` → иначе import = external и правило молчит)
 * - no-restricted-imports по слоям (срабатывает по строке импорта, надёжно в IDE)
 */
export default defineConfig([
  globalIgnores(['dist', 'build', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettierConfig,
    ],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier,
      boundaries,
    },
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      parserOptions: {
        // Windows + IDE: без явного rootDir typescript-eslint может видеть
        // C:\... и c:\... как два разных кандидата и ломать parse/resolve.
        tsconfigRootDir: rootDir,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: resolve(rootDir, 'tsconfig.app.json'),
        },
        // Pure-JS fallback: в Cursor/Electron native unrs-resolver у typescript
        // resolver иногда не поднимается → `@/` не резолвится → boundaries молчит.
        alias: {
          map: [['@', srcDir]],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      },
      // Абсолютный root: CLI/IDE cwd больше не влияет на матчинг elements.
      'boundaries/root-path': rootDir,
      'boundaries/include': ['**/src/**/*'],
      'boundaries/ignore': ['**/src/vite-env.d.ts'],
      // main.tsx — file category (один файл нельзя надёжно описать folder-element без deprecated mode)
      'boundaries/files': [{ pattern: '**/src/main.tsx', category: 'main' }],
      'boundaries/elements': [
        {
          type: 'module',
          pattern: '**/src/modules/*',
          capture: ['module'],
          partialMatch: false,
        },
        {
          type: 'app',
          pattern: '**/src/app',
          partialMatch: false,
        },
        {
          type: 'core',
          pattern: '**/src/core',
          partialMatch: false,
        },
      ],
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // recommended задаёт prettier/prettier: error — смягчаем до warning;
      // при неправильном порядке импортов правило срабатывает через Prettier.
      'prettier/prettier': 'warn',

      'no-restricted-imports': [
        'error',
        {
          paths: restrictedBarrelPaths,
          patterns: restrictedModuleDeepPatterns,
        },
      ],

      ...boundaries.configs.recommended.rules,
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          // core → только core (внутренние импорты одного element пропускаются)
          // modules → core + public API других modules (index.ts); не app
          // app → core + public API modules; не «вниз» из нижележащих слоёв в app
          // main → только app
          policies: [
            {
              from: { element: { type: 'core' } },
              allow: {
                to: { element: { type: 'core' } },
              },
              message:
                'Слой core не может импортировать app/modules — только core (+ npm).',
            },
            {
              from: { element: { type: 'module' } },
              allow: {
                to: { element: { type: 'core' } },
              },
              message:
                'Модуль может импортировать core (прямые пути к файлам).',
            },
            {
              from: { element: { type: 'module' } },
              allow: {
                to: {
                  element: {
                    type: 'module',
                    fileInternalPath: ['index.ts', 'index.tsx'],
                  },
                },
              },
              message:
                'Между modules разрешён только public API (@/modules/<name> → index.ts).',
            },
            {
              from: { element: { type: 'app' } },
              allow: {
                to: { element: { type: 'core' } },
              },
              message:
                'Слой app может импортировать core (прямые пути к файлам).',
            },
            {
              from: { element: { type: 'app' } },
              allow: {
                to: {
                  element: {
                    type: 'module',
                    fileInternalPath: ['index.ts', 'index.tsx'],
                  },
                },
              },
              message:
                'Слой app может импортировать modules только через public API (@/modules/<name>).',
            },
            {
              from: { file: { categories: 'main' } },
              allow: {
                to: { element: { type: 'app' } },
              },
              message:
                'main.tsx может импортировать только из app (@/app/...), не из core/modules.',
            },
          ],
        },
      ],
    },
  },

  // IDE-надёжные слойные запреты по строке импорта (не зависят от resolve).
  {
    files: ['src/core/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: restrictedBarrelPaths,
          patterns: [
            {
              group: ['@/app', '@/app/**'],
              message:
                'Слой core не может импортировать app — только core (+ npm).',
            },
            {
              group: ['@/modules', '@/modules/**'],
              message:
                'Слой core не может импортировать modules — только core (+ npm).',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/modules/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: restrictedBarrelPaths,
          patterns: [
            {
              group: ['@/app', '@/app/**'],
              message:
                'Модуль не может импортировать app — только core и public API других modules.',
            },
            ...restrictedModuleDeepPatterns,
          ],
        },
      ],
    },
  },
  {
    files: ['src/main.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/core', '@/core/**'],
              message:
                'main.tsx может импортировать только из app (@/app/...), не из core.',
            },
            {
              group: ['@/modules', '@/modules/**'],
              message:
                'main.tsx может импортировать только из app (@/app/...), не из modules.',
            },
          ],
        },
      ],
    },
  },
]);
