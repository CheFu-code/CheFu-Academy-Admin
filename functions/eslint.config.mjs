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
        rules: {
            // Add any minimal rules you want for Cloud Functions code
        },
    },
    // Ignore build output and deps so lint stays fast
    {
        ignores: ['lib/**', 'node_modules/**'],
    },
];
