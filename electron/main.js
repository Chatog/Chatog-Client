const { app, BrowserWindow, ipcMain, protocol } = require('electron');
const { join } = require('path');

const isDev = process.env.NODE_ENV === 'development';

let mainWindow = null;

const preload = join(__dirname, './preload.js');

function initMainWindow() {
  mainWindow = new BrowserWindow({
    icon: join(__dirname, '../public/favicon.ico'),
    webPreferences: {
      preload
    }
  });

  /**
   * dev: request localhost url
   * prod: load static `index.html` file
   */
  if (isDev) {
    const DEV_SERVER_PORT =
      require('../configs/dev-config.json').DEV_SERVER_PORT;
    mainWindow.loadURL(`http://127.0.0.1:${DEV_SERVER_PORT}`);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile('index.html');
  }
}

app.whenReady().then(() => {
  initMainWindow();

  app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length) {
      allWindows[0].focus();
    } else {
      initMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  mainWindow = null;
  if (process.platform !== 'darwin') app.quit();
});

/**
 * API exposed to browser env
 */

/**
 * NEW_WINDOW
 * open new window and load the same preload.js as mainWindow
 * @param {string} url new window's url
 */
ipcMain.handle('NEW_WINDOW', (e, url) => {
  const window = new BrowserWindow({
    webPreferences: {
      preload
    }
  });
  window.loadURL(url);
});
