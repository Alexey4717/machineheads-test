/** @typedef {import('prettier').Config} PrettierConfig */

/** @type {PrettierConfig} */
const config = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 80,
  arrowParens: 'always',
  endOfLine: 'auto',
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrderParserPlugins: ['typescript', 'jsx'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
  importOrder: [
    '^react',
    '<THIRD_PARTY_MODULES>',
    '^(@/)?__test__/(.*)$',
    '^(@/)?core/(.*)$',
    '^(@/)?modules/(.*)$',
    '^(@/)?app/(.*)$',
    '^[./]',
  ],
};

export default config;
