function initChatogWeb(chatogOrigin) {
  const ChatogElectronAPIType = {
    CLOSE_WINDOW: 'CLOSE_WINDOW',
    MINIMIZE_WINDOW: 'MINIMIZE_WINDOW',
    FULLSCREEN_WINDOW: 'FULLSCREEN_WINDOW',
    RESIZE_WINDOW: 'RESIZE_WINDOW',
    SET_RESIZABLE: 'SET_RESIZABLE'
  };

  window.addEventListener('message', (e) => {
    if (e.origin !== chatogOrigin) return;
    console.debug('[chatog-web-sdk] recv cross window message:', e);

    const { type, payload } = e.data;
    if (type === ChatogElectronAPIType.CLOSE_WINDOW) {
      window.CHATOG_ELECTRON_API?.closeWindow();
    } else if (type === ChatogElectronAPIType.MINIMIZE_WINDOW) {
      window.CHATOG_ELECTRON_API?.minimizeWindow();
    } else if (type === ChatogElectronAPIType.FULLSCREEN_WINDOW) {
      window.CHATOG_ELECTRON_API?.fullscreenWindow(payload);
    } else if (type === ChatogElectronAPIType.RESIZE_WINDOW) {
      window.CHATOG_ELECTRON_API?.resizeWindow(payload);
    } else if (type === ChatogElectronAPIType.SET_RESIZABLE) {
      window.CHATOG_ELECTRON_API?.setResizable(payload);
    }
  });
}

window.initChatogWeb = initChatogWeb;
