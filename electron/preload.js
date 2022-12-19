const { contextBridge, ipcRenderer } = require('electron');

const EXPORT_NAMESPACE = 'ELECTRON_API';

contextBridge.exposeInMainWorld(EXPORT_NAMESPACE, {
  closeWindow: () => ipcRenderer.invoke('CLOSE_WINDOW'),
  reconfigureWindow: (type) => ipcRenderer.invoke('RECONFIGURE_WINDOW', type),
  openStats: () =>
    ipcRenderer.invoke('NEW_WINDOW', 'chrome://webrtc-internals/')
});
