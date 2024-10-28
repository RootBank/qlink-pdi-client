import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import jestPlugin from 'eslint-plugin-jest';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.test.ts', '**/__tests__/**/*.ts'], // Merge all TypeScript files
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        jest: 'readonly'  // Adding jest as a global to avoid repeating in test-specific configs
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
      jest: jestPlugin,
    },
    rules: {
      // Core rules
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'prettier/prettier': ['error', {
        useTabs: false,
        tabWidth: 2,
        endOfLine: 'lf',
        insertPragma: false,
        requirePragma: false,
        trailingComma: 'none',
        printWidth: 80,
        bracketSpacing: true,
        arrowParens: 'avoid',
        proseWrap: 'never',
        singleQuote: true,
      }],
      'eol-last': ['error', 'always'],
      indent: ['error', 2],
      
      // Jest-specific rules
      'jest/consistent-test-it': ['error', { fn: 'test' }],
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    },
  }
];
