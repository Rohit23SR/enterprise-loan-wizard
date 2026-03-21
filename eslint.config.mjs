import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import angularEslint from '@angular-eslint/eslint-plugin'
import angularTemplateEslint from '@angular-eslint/eslint-plugin-template'
import angularTemplateParser from '@angular-eslint/template-parser'
import prettierConfig from 'eslint-config-prettier'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '.angular/**', 'coverage/**', 'out-tsc/**'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      '@angular-eslint': angularEslint,
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      '@angular-eslint/template': angularTemplateEslint,
    },
    rules: {
      '@angular-eslint/template/banana-in-box': 'error',
      '@angular-eslint/template/no-negated-async': 'warn',
    },
  },
  prettierConfig,
]
