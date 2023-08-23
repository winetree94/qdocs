module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:storybook/recommended'
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module",
    "tsconfigRootDir": ".",
    "project": [
      "./tsconfig.json"
    ]
  },
  parser: '@typescript-eslint/parser',
  "settings": {
    "import/resolver": {
      "typescript": {
        "project": "./tsconfig.json"
      }
    },
    "react": {
      "version": "18.x"
    }
  },
  plugins: [
    "react",
    "@typescript-eslint"
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    /**
     * @description
     * Javascript 에서 react 사용할 때 유용한 룰이지만 typescript 에서는 필요없는 룰 해제
     */
    'react/display-name': 'off',
    'react/prop-types': 'off',

    /**
     * @description
     * 세미콜론 항상 사용
     */
    semi: ['error', 'always'],

    /**
     * @description
     * single quote 사용
     */
    quotes: ['error', 'single'],

    /**
     * @description
     * 네이밍 컨벤션 지정 
     */
    '@typescript-eslint/naming-convention': ['error', {
      selector: 'variable',
      format: ['camelCase', 'UPPER_CASE', 'PascalCase']
    }],

    /**
     * @description
     * 잘못된 promise 사용 체크
     */
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": false
      }
    ],

    /**
     * @description
     * 미사용 변수 경고
     */
    '@typescript-eslint/no-unused-vars': ['warn'],

    '@typescript-eslint/typedef': ['error'],
    '@typescript-eslint/ban-types': ['error'],

    /**
     * @description
     * any 사용 시 경고
     */
    '@typescript-eslint/no-explicit-any': ['warn'],
    '@typescript-eslint/no-unsafe-argument': ['warn'],
    '@typescript-eslint/no-unsafe-assignment': ['warn'],
    '@typescript-eslint/no-unsafe-member-access': ['warn'],
    '@typescript-eslint/no-unsafe-call': ['warn'],
  }
};