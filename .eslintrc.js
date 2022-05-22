module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['react-app', '@linkup/next-js'],
  rules: {
    'react/jsx-props-no-spreading': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react/no-unstable-nested-components': [
      'warn',
      {
        allowAsProps: true,
      },
    ],
  },
}
