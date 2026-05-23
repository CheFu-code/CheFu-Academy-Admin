const {
    app,
    BrowserWindow,
    Menu,
    Notification,
    Tray,
    dialog,
    globalShortcut,
    ipcMain,
    nativeImage,
    nativeTheme,
} = require('electron');
const fs = require('fs/promises');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';
const devUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000';
const prodUrl = process.env.ELECTRON_APP_URL || 'https://academy.chefuinc.com';

let mainWindow;
let tray;
let reminderTimer;

function getBaseUrl() {
    return isDev ? devUrl : prodUrl;
}

function routeUrl(route = '/') {
    return new URL(route, getBaseUrl()).toString();
}

function getUserDataFile(name) {
    return path.join(app.getPath('userData'), name);
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 820,
        minWidth: 960,
        minHeight: 640,
        title: 'CheFu Academy',
        backgroundColor: nativeTheme.shouldUseDarkColors ? '#09090b' : '#ffffff',
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
    });

    mainWindow.loadURL(getBaseUrl());

    if (isDev) {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
}

function showWindow(route) {
    if (!mainWindow || mainWindow.isDestroyed()) {
        createWindow();
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

    new Notification({
        title,
        body,
        silent: Boolean(payload.silent),
    }).show();

    return true;
}

function createTray() {
    const iconPath = path.join(__dirname, '..', 'public', 'icon.png');
    const icon = nativeImage.createFromPath(iconPath).resize({
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
            { label: 'Quit', click: () => app.quit() },
        ]),
    );
    tray.on('click', () => showWindow('/dashboard'));
}

function registerShortcuts() {
    globalShortcut.register('CommandOrControl+Shift+C', () => showWindow('/dashboard'));
    globalShortcut.register('CommandOrControl+Shift+L', () => showWindow('/dashboard'));
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

app.whenReady().then(() => {
    app.setAppUserModelId('com.chefu.academy');
    createWindow();
    createTray();
    registerShortcuts();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
    if (reminderTimer) clearInterval(reminderTimer);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
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

    if (!Number.isFinite(value) || value < 0) {
        mainWindow.setProgressBar(-1);
        return true;
    }

    mainWindow.setProgressBar(Math.min(1, value), { mode });
    return true;
});
