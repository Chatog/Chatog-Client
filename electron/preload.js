const { contextBridge, ipcRenderer } = require('electron');

const EXPORT_NAMESPACE = 'ELECTRON_API';

contextBridge.exposeInMainWorld(EXPORT_NAMESPACE, {
  openStats: () =>
    ipcRenderer.invoke('NEW_WINDOW', 'chrome://webrtc-internals/')
});
