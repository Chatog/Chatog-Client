const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const { join } = require('path');

const isDev = process.env.NODE_ENV === 'development';

let window = null;

const preload = join(__dirname, './preload.js');

function initWindow() {
  window = new BrowserWindow({
    webPreferences: {
      preload
    },
    movable: true,
    titleBarStyle: 'hidden'
  });

  window.removeMenu();

  reconfigure('home');

  /**
   * dev: load localhost url
   * prod: load static `index.html` file
   */
  if (isDev) {
    const DEV_SERVER_PORT =
      require('../configs/dev-config.json').DEV_SERVER_PORT;
    window.loadURL(`http://127.0.0.1:${DEV_SERVER_PORT}`);
    window.webContents.openDevTools();
  } else {
    window.loadFile('index.html');
  }
}

/**
 * reconfigure window
 * twp types: home / room
 */
function reconfigure(type) {
  if (!window) return;
  if (type === 'home') {
    window.setSize(380, 540);
    window.setResizable(false);
  } else if (type === 'room') {
    window.setSize(1280, 720);
    window.setResizable(true);
  }
  window.center();
}

app.whenReady().then(() => {
  initWindow();

  app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length) {
      allWindows[0].focus();
    } else {
      initWindow();
    }
  });
});
app.on('window-all-closed', () => {
  window = null;
  if (process.platform !== 'darwin') app.quit();
});

/* API exposed to browser env */
/**
 * NEW_WINDOW
 * open new window
 * @param {string} url new window's url
 */
ipcMain.handle('NEW_WINDOW', (e, url) => {
  const newWindow = new BrowserWindow({
    webPreferences: {
      preload
    }
  });
  newWindow.loadURL(url);
});

/**
 * CLOSE_WINDOW
 * close window
 */
ipcMain.handle('CLOSE_WINDOW', (e) => {
  if (window) {
    window.close();
  }
});

/**
 * RECONFIGURE_WINDOW
 * reconfigure window
 * @param {string} type "home" || "room"
 */
ipcMain.handle('RECONFIGURE_WINDOW', (e, type) => {
  reconfigure(type);
});

/**
 * OPEN_PATH
 * open path in system explorer
 * @param {string} path  an absolute dir path
 */
ipcMain.handle('OPEN_PATH', (e, path) => {
  const ret = shell.openPath(path);
  // not return "" means error occurred
  if (!ret) console.error(ret);
});

/**
 * SELECT_PATH
 * use system explorer to select a path
 * @param {string} defaultPath default explorer path
 * @param {string} title explorer title
 */
ipcMain.handle('SELECT_PATH', (e, defaultPath, title) => {
  return dialog
    .showOpenDialog(window, {
      title,
      defaultPath,
      properties: ['openDirectory']
    })
    .then((r) => {
      if (r.canceled || r.filePaths.length === 0) {
        return '';
      } else {
        return r.filePaths[0];
      }
    });
});
