module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'react-app', 'react-app/jest', 'prettier'],
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  plugins: ['prettier'],
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    indent: 'off',
    'no-trailing-spaces': ['error'],
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      },
    ],
    '@typescript-eslint/typedef': ['error'],
    '@typescript-eslint/ban-types': ['error'],
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-non-null-assertion': 'off',
    'prettier/prettier': ['error'],
  },
};
