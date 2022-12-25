const { contextBridge, ipcRenderer, app } = require('electron');

const EXPORT_NAMESPACE = 'ELECTRON_API';

contextBridge.exposeInMainWorld(EXPORT_NAMESPACE, {
  closeWindow: () => ipcRenderer.invoke('CLOSE_WINDOW'),
  reconfigureWindow: (type) => ipcRenderer.invoke('RECONFIGURE_WINDOW', type),
  openPath: (path) => ipcRenderer.invoke('OPEN_PATH', path),
  selectPath: (defaultPath, title) =>
    ipcRenderer.invoke('SELECT_PATH', defaultPath, title),
  openStats: () =>
    ipcRenderer.invoke('NEW_WINDOW', 'chrome://webrtc-internals/')
});

// set initial records save path
if (window.localStorage.getItem('RECORDS_SAVE_PATH') === null) {
  window.localStorage.setItem(
    'RECORDS_SAVE_PATH',
    `${app.getAppPath()}\\records`
  );
}
