const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const { join } = require('path');

// allow https load
app.commandLine.appendSwitch('--ignore-certificate-errors', 'true');

const isDev = process.env.NODE_ENV === 'development';

let window = null;

function initWindow() {
  const newWindow = new BrowserWindow({
    webPreferences: {
      preload: join(__dirname, './preload.js'),
      sandbox: false
    },
    movable: true,
    titleBarStyle: 'hidden'
  });

  newWindow.removeMenu();
  newWindow.setSize(380, 540);
  newWindow.setResizable(false);

  newWindow.loadFile('index.html');

  if (isDev) {
    newWindow.webContents.openDevTools();
  }

  return newWindow;
}

app.whenReady().then(() => {
  window = initWindow();

  /**
   * init chatog sdk
   */
  const { initChatogElectronMain } = require('./sdk/chatog-electron-sdk');
  initChatogElectronMain({
    window,
    ipcMain
  });

  app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length) {
      allWindows[0].focus();
    } else {
      window = initWindow();
    }
  });
});
app.on('window-all-closed', () => {
  window = null;
  if (process.platform !== 'darwin') app.quit();
});
