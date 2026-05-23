const { contextBridge, ipcRenderer } = require('electron');

const menuListeners = new Set();

ipcRenderer.on('desktop-menu:action', (_event, payload) => {
    for (const listener of menuListeners) {
        listener(payload);
    }
});

contextBridge.exposeInMainWorld('chefuDesktop', {
    isElectron: true,
    notify: ({ title, body, silent } = {}) =>
        ipcRenderer.invoke('desktop-notification:show', {
            title,
            body,
            silent,
        }),
    saveFile: payload => ipcRenderer.invoke('desktop-dialog:save-file', payload),
    importLearningFile: () =>
        ipcRenderer.invoke('desktop-dialog:import-learning-file'),
    cacheCourse: course =>
        ipcRenderer.invoke('desktop-cache:write-course', course),
    listCachedCourses: () => ipcRenderer.invoke('desktop-cache:list-courses'),
    setAutoLaunch: enabled =>
        ipcRenderer.invoke('desktop-app:set-auto-launch', enabled),
    getAutoLaunch: () => ipcRenderer.invoke('desktop-app:get-auto-launch'),
    getAppInfo: () => ipcRenderer.invoke('desktop-app:get-info'),
    checkForUpdates: () => ipcRenderer.invoke('desktop-app:check-updates'),
    openExternal: url => ipcRenderer.invoke('desktop-shell:open-external', url),
    copyText: text => ipcRenderer.invoke('desktop-clipboard:write-text', text),
    onMenuAction: listener => {
        if (typeof listener !== 'function') return () => {};
        menuListeners.add(listener);
        return () => menuListeners.delete(listener);
    },
    scheduleReminder: minutes =>
        ipcRenderer.invoke('desktop-reminder:schedule', { minutes }),
    setProgress: payload => ipcRenderer.invoke('desktop-progress:set', payload),
});
