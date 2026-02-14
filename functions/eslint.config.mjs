// functions/eslint.config.mjs
import tsParser from '@typescript-eslint/parser';

export default [
    {
        files: ['src/**/*.{ts,js}'],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2022,
            sourceType: 'module',
        },
        rules: {},
    },
    {
        ignores: ['lib/**', 'generated/**', 'node_modules/**'],
    },
];
