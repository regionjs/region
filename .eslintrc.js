module.exports = {
    extends: require.resolve('@reskript/config-lint/config/eslint'),
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    rules: {
        'camelcase': 'off',
        'max-len': 'off',
        'max-statements': 'off',
        'no-negated-condition': 'off',
        'prefer-promise-reject-errors': 'off',
        '@typescript-eslint/init-declarations': 'off',
    },
};
