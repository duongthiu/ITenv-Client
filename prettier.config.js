/** @type {import('prettier').Config} */
export default {
  endOfLine: 'lf',
  semi: true,
  bracketSameLine: true,
  printWidth: 100,
  singleQuote: false,
  trailingComma: 'es5',
  tabWidth: 2,
  arrowParens: 'always',
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy']
};
