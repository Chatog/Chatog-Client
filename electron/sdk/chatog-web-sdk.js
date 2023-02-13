function initChatogWeb(chatogOrigin, iframeEl) {
  const ChatogElectronAPIType = {
    CLOSE_WINDOW: 'CLOSE_WINDOW',
    MINIMIZE_WINDOW: 'MINIMIZE_WINDOW',
    FULLSCREEN_WINDOW: 'FULLSCREEN_WINDOW',
    RESIZE_WINDOW: 'RESIZE_WINDOW',
    SET_RESIZABLE: 'SET_RESIZABLE',
    CENTER_WINDOW: 'CENTER_WINDOW',
    COPY_TO_CLIPBOARD: 'COPY_TO_CLIPBOARD',
    GET_SCREEN_SOURCES: 'GET_SCREEN_SOURCES'
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
      case ChatogElectronAPIType.COPY_TO_CLIPBOARD:
        navigator.clipboard.writeText(payload);
        break;
      case ChatogElectronAPIType.GET_SCREEN_SOURCES:
        window.CHATOG_ELECTRON_API?.getScreenSources()
          .then((sources) => {
            // use postMessage to send screen infos back to iframe
            iframeEl.contentWindow.postMessage(
              {
                type: ChatogElectronAPIType.GET_SCREEN_SOURCES,
                payload: sources
              },
              '*'
            );
          })
          .catch((e) => {
            console.error('[chatog-web-sdk] GET_SCREEN_SOURCES error:', e);
          });
    }
  });
}

window.initChatogWeb = initChatogWeb;
