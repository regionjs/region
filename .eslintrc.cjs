require('@reskript/config-lint/patch');

module.exports = {
    extends: require.resolve('@reskript/config-lint/config/eslint'),
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    rules: {
        // close some rules
        'camelcase': 'off',
        'max-len': 'off',
        'max-statements': 'off',
        'no-negated-condition': 'off',
        'prefer-promise-reject-errors': 'off',
        '@typescript-eslint/init-declarations': 'off',
        // open some rules
        '@typescript-eslint/prefer-ts-expect-error': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
    },
};
