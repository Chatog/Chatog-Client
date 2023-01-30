const { contextBridge, ipcRenderer } = require('electron');
const { initChatogElectronPreload } = require('./sdk/chatog-electron-sdk');

/**
 * init chatog sdk
 */
initChatogElectronPreload({
  ipcRenderer,
  contextBridge
});
