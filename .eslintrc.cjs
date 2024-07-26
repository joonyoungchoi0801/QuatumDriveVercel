module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: [],
  plugins: ['react', 'react-hooks', 'jsx-a11y', '@typescript-eslint'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
  },
  settings: {
    react: { version: 'detect' },
  },
};
