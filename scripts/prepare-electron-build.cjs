const fs = require('fs/promises');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const buildDir = path.join(rootDir, 'desktop-build', 'app');

async function copyDir(from, to) {
    await fs.rm(to, { force: true, recursive: true });
    await fs.cp(from, to, { recursive: true });
}

async function copyFile(from, to) {
    await fs.mkdir(path.dirname(to), { recursive: true });
    await fs.copyFile(from, to);
}

async function main() {
    await fs.rm(path.join(rootDir, 'desktop-build'), {
        force: true,
        recursive: true,
    });
    await fs.mkdir(buildDir, { recursive: true });

    await copyDir(path.join(rootDir, 'electron'), path.join(buildDir, 'electron'));
    await copyFile(
        path.join(rootDir, 'public', 'icon.png'),
        path.join(buildDir, 'public', 'icon.png'),
    );

    const runtimePackages = [
        'pdf-parse',
        'pdfjs-dist',
        path.join('@napi-rs', 'canvas'),
    ];

    for (const packageName of runtimePackages) {
        await copyDir(
            path.join(rootDir, 'node_modules', packageName),
            path.join(buildDir, 'node_modules', packageName),
        );
    }

    const packageJson = {
        name: 'chefu-academy-desktop',
        version: '0.1.0',
        description: 'CheFu Academy desktop learning app.',
        author: 'CheFu Inc',
        productName: 'CheFu Academy',
        main: 'electron/main.cjs',
        private: true,
        dependencies: {
            'pdf-parse': '^2.4.5',
        },
    };

    await fs.writeFile(
        path.join(buildDir, 'package.json'),
        `${JSON.stringify(packageJson, null, 2)}\n`,
        'utf8',
    );
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
