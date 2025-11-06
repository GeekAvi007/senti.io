import js from '@eslint/js'
import globals from 'globals'

export default [
  {
    ignores: ['node_modules/**', 'dist/**'], // what to skip
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: globals.node,
    },
    ...js.configs.recommended, // use ESLint's recommended rules
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
]