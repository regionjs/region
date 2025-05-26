import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

const stylisticConfigs = stylistic.configs.customize({
    indent: 4,
    quotes: 'single',
    semi: true,
    jsx: true,
    commaDangle: 'always-multiline',
    blockSpacing: false,
});

stylisticConfigs.rules['@stylistic/object-curly-spacing'] = ['error', 'never'];

export default tseslint.config([
    eslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    react.configs.flat.recommended,
    react.configs.flat['jsx-runtime'],
    {
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    reactHooks.configs['recommended-latest'],
    {
        linterOptions: {
            reportUnusedDisableDirectives: 'off',
            reportUnusedInlineConfigs: 'off',
        },
    },
    stylisticConfigs,
    {
        rules: {
            // --- 显式开启 ---
            'max-lines': [
                'error',
                {
                    max: 140,
                    skipBlankLines: true,
                    skipComments: true,
                },
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    ignoreRestSiblings: true,
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            'react-hooks/exhaustive-deps': 'error',
            'no-useless-concat': 'error',
            'max-depth': 'error',
            'func-names': 'error',
            'react/no-danger': 'error',
            'prefer-spread': 'error',
            'prefer-promise-reject-errors': 'error',
            'no-param-reassign': 'error',
            'complexity': 'error',
            'guard-for-in': 'error',
            '@typescript-eslint/no-empty-interface': 'error',
            // --- 显式关闭 ---
            // 允许使用 ts-ignore 注释
            '@typescript-eslint/ban-ts-comment': 'off',
            // 允许字符串和数字相加
            '@typescript-eslint/restrict-plus-operands': 'off',
            // 在我们的场景中 class 和 interface 的顺序并不重要
            '@typescript-eslint/member-ordering': 'off',
            // 长期来看 onClick={() => {}} 会被编译器优化掉，并且大部分情况这样是没有问题的，但还是建议用 useCallback
            'react/jsx-no-bind': 'off',
            // 经常会有使用 index 作为 key 的情况，大部分情况都是没有问题的，不提前优化这种小概率有问题的情形
            'react/no-array-index-key': 'off',
            // 大部分情况建议还是按照正常的 true 在前，不排除有的时候 false 在前会让代码更清晰
            'no-negated-condition': 'off',
            // 后端经常返回一些带下划线的字段，方便起见关闭，但还是建议使用驼峰命名
            'camelcase': 'off',
            // 后端经常返回一些带下划线的字段，方便起见关闭，但还是建议使用驼峰命名
            'no-underscore-dangle': 'off',
            // 允许使用 any 类型
            '@typescript-eslint/no-explicit-any': 'off',
            // 允许一些 expressions 来注入一些副作用
            '@typescript-eslint/no-unused-expressions': 'off',
            // 存在组件库定义不合理的情形
            'react/no-unknown-property': 'off',
        },
    },
]);
