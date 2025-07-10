import {reactConfig} from '@hero-u/eslint-config/react.js';

export default [
    ...reactConfig,
    {
        rules: {
            '@stylistic/block-spacing': ['error', 'never'],
        },
    },
];
