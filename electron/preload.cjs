const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('chefuDesktop', {
    isElectron: true,
    notify: ({ title, body, silent } = {}) =>
        ipcRenderer.invoke('desktop-notification:show', {
            title,
            body,
            silent,
        }),
});
