const { contextBridge, ipcRenderer } = require('electron');

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
    scheduleReminder: minutes =>
        ipcRenderer.invoke('desktop-reminder:schedule', { minutes }),
    setProgress: payload => ipcRenderer.invoke('desktop-progress:set', payload),
});
