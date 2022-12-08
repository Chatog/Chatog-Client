const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ELECTRON_API', {
  openStats: () =>
    ipcRenderer.invoke('NEW_WINDOW', 'chrome://webrtc-internals/')
});
