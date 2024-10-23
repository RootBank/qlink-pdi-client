import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'prettier/prettier': ['error', {
        useTabs: false,         // Enforce spaces instead of tabs
        tabWidth: 2,            // Set tab width to 2 spaces
        endOfLine: 'lf',        // Ensure consistent line endings (LF)
        insertPragma: false,
        requirePragma: false,
        trailingComma: 'none',  // No trailing commas
        printWidth: 80,
        bracketSpacing: true,
        arrowParens: 'avoid',
        proseWrap: 'never',
        singleQuote: true,
      }],
      'eol-last': ['error', 'always'], // Ensure newline at the end of files
      indent: ['error', 2],           // Enforce 2-space indentation
    },
  },
];