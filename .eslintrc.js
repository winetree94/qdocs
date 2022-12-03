module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'react-app',
    'react-app/jest',
  ],
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    'no-trailing-spaces': ['error'],
    indent: ['error', 2],
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      },
    ],
    '@typescript-eslint/ban-types': [
      'error',
      // {
      //   types: {
      //     '{}': false,
      //   },
      // },
    ],
    '@typescript-eslint/no-unused-vars': ['error'],
    'prettier/prettier': ['error'],
  },
};
