function initChatogWeb(chatogOrigin) {
  const ChatogElectronAPIType = {
    CLOSE_WINDOW: 'CLOSE_WINDOW',
    MINIMIZE_WINDOW: 'MINIMIZE_WINDOW',
    FULLSCREEN_WINDOW: 'FULLSCREEN_WINDOW',
    RESIZE_WINDOW: 'RESIZE_WINDOW',
    SET_RESIZABLE: 'SET_RESIZABLE',
    CENTER_WINDOW: 'CENTER_WINDOW'
  };

  window.addEventListener('message', (e) => {
    if (e.origin !== chatogOrigin) return;
    console.debug('[chatog-web-sdk] recv cross window message:', e);

    const { type, payload } = e.data;
    switch (type) {
      case ChatogElectronAPIType.CLOSE_WINDOW:
        window.CHATOG_ELECTRON_API?.closeWindow();
        break;
      case ChatogElectronAPIType.MINIMIZE_WINDOW:
        window.CHATOG_ELECTRON_API?.minimizeWindow();
        break;
      case ChatogElectronAPIType.FULLSCREEN_WINDOW:
        window.CHATOG_ELECTRON_API?.fullscreenWindow(payload);
        break;
      case ChatogElectronAPIType.RESIZE_WINDOW:
        window.CHATOG_ELECTRON_API?.resizeWindow(payload);
        break;
      case ChatogElectronAPIType.SET_RESIZABLE:
        window.CHATOG_ELECTRON_API?.setResizable(payload);
        break;
      case ChatogElectronAPIType.CENTER_WINDOW:
        window.CHATOG_ELECTRON_API?.centerWindow();
        break;
    }
  });
}

window.initChatogWeb = initChatogWeb;
