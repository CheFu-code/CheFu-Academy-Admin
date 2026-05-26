const { spawnSync } = require('child_process');

const result = spawnSync(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['next', 'build', '--turbopack'],
    {
        env: {
            ...process.env,
            STATIC_EXPORT: '1',
        },
        stdio: 'inherit',
    },
);

process.exit(result.status ?? 1);
