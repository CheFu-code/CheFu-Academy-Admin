const {
    app,
    BrowserWindow,
    Menu,
    Notification,
    Tray,
    clipboard,
    dialog,
    globalShortcut,
    ipcMain,
    nativeImage,
    nativeTheme,
    session,
    shell,
} = require('electron');
const fs = require('fs/promises');
const https = require('https');
const path = require('path');

const appProtocol = 'chefu-academy';
const isDev = !app.isPackaged && process.env.NODE_ENV !== 'production';
const devUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000';
const prodUrl = process.env.ELECTRON_APP_URL || 'https://academy.chefuinc.com';
const releaseApiUrl =
    'https://api.github.com/repos/CheFu-code/CheFu-Academy-Admin/releases/latest';

let mainWindow;
let tray;
let reminderTimer;
let quitting = false;

const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
    app.quit();
}

function getBaseUrl() {
    return isDev ? devUrl : prodUrl;
}

function routeUrl(route = '/') {
    return new URL(route, getBaseUrl()).toString();
}

function getUserDataFile(name) {
    return path.join(app.getPath('userData'), name);
}

function iconPath() {
    return path.join(__dirname, '..', 'public', 'icon.png');
}

function isSafeAppUrl(url) {
    try {
        const parsed = new URL(url);
        const base = new URL(getBaseUrl());

        if (parsed.protocol === `${appProtocol}:`) return true;
        if (parsed.hostname === base.hostname) return true;

        return (
            isDev &&
            parsed.protocol === 'http:' &&
            ['localhost', '127.0.0.1'].includes(parsed.hostname)
        );
    } catch {
        return false;
    }
}

function routeFromDeepLink(url) {
    try {
        const parsed = new URL(url);
        if (parsed.protocol !== `${appProtocol}:`) return null;

        const pathname = parsed.pathname === '/' ? '' : parsed.pathname;
        const route = `${parsed.hostname ? `/${parsed.hostname}` : ''}${pathname}${parsed.search}`;

        return route || '/dashboard';
    } catch {
        return null;
    }
}

async function readJsonFile(name, fallback) {
    try {
        return JSON.parse(await fs.readFile(getUserDataFile(name), 'utf8'));
    } catch {
        return fallback;
    }
}

async function writeJsonFile(name, value) {
    await fs.writeFile(getUserDataFile(name), JSON.stringify(value, null, 2), 'utf8');
}

async function getWindowState() {
    const state = await readJsonFile('window-state.json', {});
    return {
        height: Number(state.height) || 820,
        isMaximized: Boolean(state.isMaximized),
        width: Number(state.width) || 1280,
        x: Number.isFinite(state.x) ? state.x : undefined,
        y: Number.isFinite(state.y) ? state.y : undefined,
    };
}

async function saveWindowState() {
    if (!mainWindow || mainWindow.isDestroyed()) return;

    const bounds = mainWindow.getBounds();
    await writeJsonFile('window-state.json', {
        ...bounds,
        isMaximized: mainWindow.isMaximized(),
    });
}

async function createWindow() {
    const state = await getWindowState();

    mainWindow = new BrowserWindow({
        width: state.width,
        height: state.height,
        x: state.x,
        y: state.y,
        minWidth: 960,
        minHeight: 640,
        title: 'CheFu Academy',
        backgroundColor: nativeTheme.shouldUseDarkColors ? '#09090b' : '#ffffff',
        icon: iconPath(),
        show: false,
        titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
    });

    setupWindowGuards(mainWindow);

    mainWindow.once('ready-to-show', () => {
        if (state.isMaximized) mainWindow.maximize();
        mainWindow.show();
    });

    mainWindow.on('close', event => {
        void saveWindowState();

        if (!quitting && process.platform !== 'darwin') {
            event.preventDefault();
            mainWindow.hide();
            showNativeNotification({
                title: 'CheFu Academy is still running',
                body: 'Use the tray icon to reopen it or quit fully.',
                silent: true,
            });
        }
    });

    mainWindow.loadURL(getBaseUrl());

    if (isDev) {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
}

function setupWindowGuards(window) {
    window.webContents.setWindowOpenHandler(({ url }) => {
        if (isSafeAppUrl(url)) {
            return { action: 'allow' };
        }

        void shell.openExternal(url);
        return { action: 'deny' };
    });

    window.webContents.on('will-navigate', event => {
        const url = event.url;

        if (isSafeAppUrl(url)) return;

        event.preventDefault();
        void shell.openExternal(url);
    });
}

function setupDownloadHandling() {
    session.defaultSession.on('will-download', async (_event, item) => {
        const fileName = item.getFilename();
        const result = await dialog.showSaveDialog(mainWindow, {
            title: 'Save download',
            defaultPath: path.join(app.getPath('downloads'), fileName),
        });

        if (result.canceled || !result.filePath) {
            item.cancel();
            return;
        }

        item.setSavePath(result.filePath);

        item.on('updated', (_downloadEvent, state) => {
            if (!mainWindow || mainWindow.isDestroyed()) return;

            if (state === 'progressing' && !item.isPaused()) {
                const total = item.getTotalBytes();
                const received = item.getReceivedBytes();
                mainWindow.setProgressBar(total > 0 ? received / total : 2);
            }
        });

        item.once('done', (_downloadEvent, state) => {
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.setProgressBar(-1);
            }

            if (state === 'completed') {
                showNativeNotification({
                    title: 'Download complete',
                    body: fileName,
                });
                void shell.showItemInFolder(result.filePath);
            } else {
                showNativeNotification({
                    title: 'Download failed',
                    body: fileName,
                });
            }
        });
    });
}

function showWindow(route) {
    if (!mainWindow || mainWindow.isDestroyed()) {
        void createWindow().then(() => {
            if (route) mainWindow.loadURL(routeUrl(route));
        });
        return;
    }

    if (route) {
        mainWindow.loadURL(routeUrl(route));
    }

    if (mainWindow.isMinimized()) {
        mainWindow.restore();
    }
    mainWindow.show();
    mainWindow.focus();
}

function showNativeNotification(payload = {}) {
    if (!Notification.isSupported()) {
        return false;
    }

    const title =
        typeof payload.title === 'string' && payload.title.trim()
            ? payload.title.trim()
            : 'CheFu Academy';
    const body = typeof payload.body === 'string' ? payload.body : '';

    const notification = new Notification({
        title,
        body,
        icon: iconPath(),
        silent: Boolean(payload.silent),
    });

    if (payload.route) {
        notification.on('click', () => showWindow(payload.route));
    }

    notification.show();
    return true;
}

function createTray() {
    const icon = nativeImage.createFromPath(iconPath()).resize({
        width: 16,
        height: 16,
    });

    tray = new Tray(icon);
    tray.setToolTip('CheFu Academy');
    tray.setContextMenu(
        Menu.buildFromTemplate([
            { label: 'Open Dashboard', click: () => showWindow('/dashboard') },
            { label: 'Continue Learning', click: () => showWindow('/dashboard') },
            { label: 'Create Course', click: () => showWindow('/courses/create-course') },
            { label: 'Start Practice', click: () => showWindow('/courses/practice') },
            { type: 'separator' },
            { label: 'Check for Updates', click: () => void checkForUpdates(true) },
            { label: 'Show Downloads', click: () => shell.openPath(app.getPath('downloads')) },
            { type: 'separator' },
            {
                label: 'Quit',
                click: () => {
                    quitting = true;
                    app.quit();
                },
            },
        ]),
    );
    tray.on('click', () => showWindow('/dashboard'));
}

function createAppMenu() {
    const template = [
        {
            label: 'CheFu Academy',
            submenu: [
                { label: 'About CheFu Academy', role: 'about' },
                { type: 'separator' },
                { label: 'Check for Updates', click: () => void checkForUpdates(true) },
                { type: 'separator' },
                { label: 'Settings', accelerator: 'CommandOrControl+,', click: () => showWindow('/settings/account') },
                { type: 'separator' },
                {
                    label: 'Quit',
                    accelerator: 'CommandOrControl+Q',
                    click: () => {
                        quitting = true;
                        app.quit();
                    },
                },
            ],
        },
        {
            label: 'Learn',
            submenu: [
                { label: 'Dashboard', accelerator: 'CommandOrControl+D', click: () => showWindow('/dashboard') },
                { label: 'My Courses', accelerator: 'CommandOrControl+M', click: () => showWindow('/courses/my-courses') },
                { label: 'Create Course', accelerator: 'CommandOrControl+N', click: () => showWindow('/courses/create-course') },
                { label: 'Practice', accelerator: 'CommandOrControl+P', click: () => showWindow('/courses/practice') },
                { type: 'separator' },
                {
                    label: 'Import Learning File',
                    accelerator: 'CommandOrControl+I',
                    click: () => sendMenuAction('import-learning-file'),
                },
            ],
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'selectAll' },
            ],
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' },
            ],
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                { type: 'separator' },
                { label: 'Bring All to Front', role: 'front' },
            ],
        },
        {
            label: 'Help',
            submenu: [
                { label: 'Documentation', click: () => showWindow('/docs') },
                { label: 'Support', click: () => showWindow('/support') },
                {
                    label: 'Website',
                    click: () => void shell.openExternal('https://academy.chefuinc.com'),
                },
            ],
        },
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function sendMenuAction(type, payload = {}) {
    if (!mainWindow || mainWindow.isDestroyed()) return false;
    mainWindow.webContents.send('desktop-menu:action', { type, payload });
    return true;
}

function registerShortcuts() {
    globalShortcut.register('CommandOrControl+Shift+C', () => showWindow('/dashboard'));
    globalShortcut.register('CommandOrControl+Shift+L', () => showWindow('/dashboard'));
    globalShortcut.register('CommandOrControl+Shift+N', () => showWindow('/courses/create-course'));
}

function scheduleReminder(minutes) {
    if (reminderTimer) {
        clearInterval(reminderTimer);
        reminderTimer = undefined;
    }

    const numericMinutes = Number(minutes);
    if (!Number.isFinite(numericMinutes) || numericMinutes <= 0) {
        return false;
    }

    reminderTimer = setInterval(() => {
        showNativeNotification({
            title: 'Learning reminder',
            body: 'A short lesson today keeps your momentum alive.',
            route: '/dashboard',
        });
    }, numericMinutes * 60 * 1000);

    return true;
}

async function parseImportedFile(filePath) {
    const extension = path.extname(filePath).toLowerCase();
    const buffer = await fs.readFile(filePath);

    if (extension === '.pdf') {
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(buffer);
        return data.text || '';
    }

    return buffer.toString('utf8');
}

function versionNumber(value) {
    const match = String(value || '').match(/\d+\.\d+\.\d+/);
    return match ? match[0] : '0.0.0';
}

function compareVersions(left, right) {
    const a = versionNumber(left).split('.').map(Number);
    const b = versionNumber(right).split('.').map(Number);

    for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
        const diff = (a[index] || 0) - (b[index] || 0);
        if (diff !== 0) return diff;
    }

    return 0;
}

function requestJson(url) {
    return new Promise((resolve, reject) => {
        const request = https.get(
            url,
            {
                headers: {
                    'User-Agent': 'CheFu-Academy-Desktop',
                    Accept: 'application/vnd.github+json',
                },
            },
            response => {
                let body = '';
                response.setEncoding('utf8');
                response.on('data', chunk => {
                    body += chunk;
                });
                response.on('end', () => {
                    if (response.statusCode && response.statusCode >= 400) {
                        reject(new Error(`GitHub returned ${response.statusCode}`));
                        return;
                    }

                    try {
                        resolve(JSON.parse(body));
                    } catch (error) {
                        reject(error);
                    }
                });
            },
        );

        request.on('error', reject);
        request.setTimeout(15000, () => {
            request.destroy(new Error('Update check timed out.'));
        });
    });
}

async function checkForUpdates(showDialog = false) {
    try {
        const release = await requestJson(releaseApiUrl);
        const currentVersion = app.getVersion();
        const latestVersion = versionNumber(release.tag_name);
        const hasUpdate = compareVersions(latestVersion, currentVersion) > 0;
        const setupAsset = Array.isArray(release.assets)
            ? release.assets.find(asset => String(asset.name).includes('setup'))
            : null;
        const downloadUrl = setupAsset?.browser_download_url || release.html_url;

        if (hasUpdate && showDialog) {
            const result = await dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'Update available',
                message: `CheFu Academy ${latestVersion} is available.`,
                detail: `You are using ${currentVersion}. Download the latest desktop installer from GitHub Releases.`,
                buttons: ['Download', 'Later'],
                defaultId: 0,
                cancelId: 1,
            });

            if (result.response === 0 && downloadUrl) {
                await shell.openExternal(downloadUrl);
            }
        } else if (!hasUpdate && showDialog) {
            await dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'CheFu Academy is up to date',
                message: `You are running version ${currentVersion}.`,
            });
        }

        return {
            currentVersion,
            downloadUrl,
            hasUpdate,
            latestVersion,
            releaseUrl: release.html_url,
        };
    } catch (error) {
        if (showDialog) {
            await dialog.showErrorBox(
                'Update check failed',
                error instanceof Error ? error.message : 'Unable to check for updates.',
            );
        }

        return {
            currentVersion: app.getVersion(),
            error: error instanceof Error ? error.message : 'unknown',
            hasUpdate: false,
        };
    }
}

function handlePossibleDeepLink(argv) {
    const deepLink = argv.find(value => String(value).startsWith(`${appProtocol}://`));
    const route = deepLink ? routeFromDeepLink(deepLink) : null;

    if (route) showWindow(route);
}

app.on('second-instance', (_event, argv) => {
    handlePossibleDeepLink(argv);
    showWindow();
});

app.on('open-url', (event, url) => {
    event.preventDefault();
    const route = routeFromDeepLink(url);
    if (route) showWindow(route);
});

app.whenReady().then(async () => {
    app.setAppUserModelId('com.chefu.academy');
    app.setAsDefaultProtocolClient(appProtocol);
    setupDownloadHandling();
    createAppMenu();
    await createWindow();
    createTray();
    registerShortcuts();
    handlePossibleDeepLink(process.argv);

    if (app.isPackaged) {
        setTimeout(() => {
            void checkForUpdates(false);
        }, 5000);
    }

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            void createWindow();
        } else {
            showWindow();
        }
    });
});

app.on('before-quit', () => {
    quitting = true;
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
    if (reminderTimer) clearInterval(reminderTimer);
});

app.on('window-all-closed', () => {
    if (process.platform === 'darwin') return;
});

ipcMain.handle('desktop-notification:show', (_event, payload = {}) =>
    showNativeNotification(payload),
);

ipcMain.handle('desktop-dialog:save-file', async (_event, payload = {}) => {
    const result = await dialog.showSaveDialog(mainWindow, {
        title: payload.title || 'Save file',
        defaultPath: payload.defaultPath || 'chefu-file',
        filters: payload.filters || [{ name: 'All Files', extensions: ['*'] }],
    });

    if (result.canceled || !result.filePath) {
        return { canceled: true };
    }

    const encoding = payload.encoding === 'utf8' ? 'utf8' : 'base64';
    await fs.writeFile(result.filePath, payload.data || '', encoding);
    return { canceled: false, filePath: result.filePath };
});

ipcMain.handle('desktop-dialog:import-learning-file', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        title: 'Import learning material',
        properties: ['openFile'],
        filters: [
            { name: 'Learning files', extensions: ['pdf', 'txt', 'md', 'markdown'] },
            { name: 'All Files', extensions: ['*'] },
        ],
    });

    if (result.canceled || !result.filePaths[0]) {
        return { canceled: true };
    }

    const filePath = result.filePaths[0];
    const text = await parseImportedFile(filePath);
    return {
        canceled: false,
        filePath,
        fileName: path.basename(filePath),
        text,
    };
});

ipcMain.handle('desktop-cache:write-course', async (_event, payload = {}) => {
    if (!payload.id) return false;
    const cachePath = getUserDataFile('offline-courses.json');
    let cache = {};

    try {
        cache = JSON.parse(await fs.readFile(cachePath, 'utf8'));
    } catch {
        cache = {};
    }

    cache[payload.id] = {
        ...payload,
        cachedAt: new Date().toISOString(),
    };

    await fs.writeFile(cachePath, JSON.stringify(cache, null, 2), 'utf8');
    return true;
});

ipcMain.handle('desktop-cache:list-courses', async () => {
    try {
        return JSON.parse(await fs.readFile(getUserDataFile('offline-courses.json'), 'utf8'));
    } catch {
        return {};
    }
});

ipcMain.handle('desktop-app:set-auto-launch', (_event, enabled) => {
    app.setLoginItemSettings({
        openAtLogin: Boolean(enabled),
        path: process.execPath,
    });
    return app.getLoginItemSettings().openAtLogin;
});

ipcMain.handle('desktop-app:get-auto-launch', () => app.getLoginItemSettings().openAtLogin);

ipcMain.handle('desktop-app:get-info', () => ({
    isPackaged: app.isPackaged,
    name: app.getName(),
    platform: process.platform,
    userDataPath: app.getPath('userData'),
    version: app.getVersion(),
}));

ipcMain.handle('desktop-app:check-updates', () => checkForUpdates(true));

ipcMain.handle('desktop-shell:open-external', (_event, url) => {
    if (typeof url !== 'string') return false;
    return shell.openExternal(url).then(() => true);
});

ipcMain.handle('desktop-clipboard:write-text', (_event, text) => {
    clipboard.writeText(typeof text === 'string' ? text : '');
    return true;
});

ipcMain.handle('desktop-reminder:schedule', (_event, payload = {}) =>
    scheduleReminder(payload.minutes),
);

ipcMain.handle('desktop-progress:set', (_event, payload = {}) => {
    if (!mainWindow || mainWindow.isDestroyed()) return false;
    const value = Number(payload.value);
    const mode = payload.mode || 'normal';

    if (mode === 'indeterminate') {
        mainWindow.setProgressBar(2, { mode: 'indeterminate' });
        return true;
    }

    if (!Number.isFinite(value) || value < 0 || mode === 'none') {
        mainWindow.setProgressBar(-1);
        return true;
    }

    mainWindow.setProgressBar(Math.min(1, value), { mode });
    return true;
});
