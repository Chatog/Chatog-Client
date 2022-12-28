const { contextBridge, ipcRenderer } = require('electron');

const EXPORT_NAMESPACE = 'ELECTRON_API';

contextBridge.exposeInMainWorld(EXPORT_NAMESPACE, {
  closeWindow: () => ipcRenderer.invoke('CLOSE_WINDOW'),
  reconfigureWindow: (type) => ipcRenderer.invoke('RECONFIGURE_WINDOW', type),
  openPath: (path) => ipcRenderer.invoke('OPEN_PATH', path),
  selectPath: (defaultPath, title) =>
    ipcRenderer.invoke('SELECT_PATH', defaultPath, title),
  minimizeWindow: () => ipcRenderer.invoke('MINIMIZE_WINDOW'),
  setFullScreen: (full) => ipcRenderer.invoke('SET_FULLSCREEN', full),
  openStats: () =>
    ipcRenderer.invoke('NEW_WINDOW', 'chrome://webrtc-internals/')
});

// set initial records save path
if (window.localStorage.getItem('RECORDS_SAVE_PATH') === null) {
  ipcRenderer.invoke('GET_APP_PATH').then((appPath) => {
    window.localStorage.setItem('RECORDS_SAVE_PATH', `${appPath}\\records`);
  });
}
