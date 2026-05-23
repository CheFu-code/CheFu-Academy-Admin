const { app, BrowserWindow, Notification, ipcMain, nativeTheme } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';
const devUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000';

let mainWindow;

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

    if (isDev) {
        mainWindow.loadURL(devUrl);
        mainWindow.webContents.openDevTools({ mode: 'detach' });
        return;
    }

    mainWindow.loadURL(process.env.ELECTRON_APP_URL || 'https://academy.chefuinc.com');
}

app.whenReady().then(() => {
    app.setAppUserModelId('com.chefu.academy');
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.handle('desktop-notification:show', (_event, payload = {}) => {
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
});
