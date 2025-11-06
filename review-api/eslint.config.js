// eslint.config.js
import js from '@eslint/js';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    rules: {
      semi: ['error', 'always'],
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
    extends: [
      'eslint:recommended',
    ],
  },
];
