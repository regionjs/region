
module.exports = {
    // require.resolve 会报错
    preset: './node_modules/@reskript/config-jest/config/jest-react.js',
    testMatch: ['**/__test__/**/*.test.{js,jsx,ts,tsx}'],
    setupFiles: [
        '<rootDir>/scripts/jest.setup.ts',
    ],
};
