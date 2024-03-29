const ChatogElectronAPIType = {
  CLOSE_WINDOW: 'CLOSE_WINDOW',
  MINIMIZE_WINDOW: 'MINIMIZE_WINDOW',
  FULLSCREEN_WINDOW: 'FULLSCREEN_WINDOW',
  RESIZE_WINDOW: 'RESIZE_WINDOW',
  SET_RESIZABLE: 'SET_RESIZABLE',
  CENTER_WINDOW: 'CENTER_WINDOW',
  GET_SCREEN_SOURCES: 'GET_SCREEN_SOURCES'
};

function initChatogElectronMain({ window, ipcMain }) {
  /**
   * open new window
   * @param {string} url new window's url
   */
  ipcMain.handle('NEW_WINDOW', (_, url) => {
    const newWindow = new BrowserWindow({
      webPreferences: {
        preload
      }
    });
    newWindow.loadURL(url);
  });

  /**
   * close window
   */
  ipcMain.handle(ChatogElectronAPIType.CLOSE_WINDOW, () => {
    console.log(window);
    if (window) {
      window.close();
    }
  });

  /**
   * minimize window
   */
  ipcMain.handle(ChatogElectronAPIType.MINIMIZE_WINDOW, () => {
    window.minimize();
  });

  /**
   * set window fullscreen or not
   * @param {boolean} full fullscreen or not
   */
  ipcMain.handle(ChatogElectronAPIType.FULLSCREEN_WINDOW, (_, full) => {
    window.setFullScreen(full);
  });

  /**
   * resize window
   * @param {number} width window width
   * @param {number} height window height
   */
  ipcMain.handle(ChatogElectronAPIType.RESIZE_WINDOW, (_, width, height) => {
    window.setSize(width, height);
  });

  /**
   * set window resizable or not
   * @param {number} resizable resizable or not
   */
  ipcMain.handle(ChatogElectronAPIType.SET_RESIZABLE, (_, resizable) => {
    window.setResizable(resizable);
  });

  /**
   * move window to the center of the screen
   */
  ipcMain.handle(ChatogElectronAPIType.CENTER_WINDOW, () => {
    window.center();
  });

  /**
   * get screen sources
   */
  const { desktopCapturer } = require('electron');
  ipcMain.handle(ChatogElectronAPIType.GET_SCREEN_SOURCES, async () => {
    const sources = await desktopCapturer.getSources({
      types: ['window', 'screen'],
      thumbnailSize: {
        width: 248,
        height: 140
      }
    });
    const serilizableSources = sources.map((source) => {
      return {
        sourceId: source.id,
        name: source.name,
        thumbnail: source.thumbnail.toDataURL()
      };
    });
    return serilizableSources;
  });
}

function initChatogElectronPreload({ ipcRenderer, contextBridge }) {
  contextBridge.exposeInMainWorld('CHATOG_ELECTRON_API', {
    closeWindow: () => ipcRenderer.invoke(ChatogElectronAPIType.CLOSE_WINDOW),
    minimizeWindow: () =>
      ipcRenderer.invoke(ChatogElectronAPIType.MINIMIZE_WINDOW),
    fullscreenWindow: (full) =>
      ipcRenderer.invoke(ChatogElectronAPIType.FULLSCREEN_WINDOW, full),
    resizeWindow: (size) => {
      ipcRenderer.invoke(
        ChatogElectronAPIType.RESIZE_WINDOW,
        size.width,
        size.height
      );
    },
    setResizable: (resizable) => {
      ipcRenderer.invoke(ChatogElectronAPIType.SET_RESIZABLE, resizable);
    },
    centerWindow: () => {
      ipcRenderer.invoke(ChatogElectronAPIType.CENTER_WINDOW);
    },
    getScreenSources: async () => {
      return ipcRenderer.invoke(ChatogElectronAPIType.GET_SCREEN_SOURCES);
    }
  });
}

module.exports = {
  initChatogElectronMain,
  initChatogElectronPreload
};
