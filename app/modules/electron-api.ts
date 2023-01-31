import { IS_ELECTRON } from '@/utils/common';

interface CrossWindowMsg {
  type: string;
  payload?: any;
}
function send(msg: CrossWindowMsg) {
  if (!IS_ELECTRON) {
    console.error('[modules/electron-api.ts] not in electron');
    return;
  }
  const targetWindow = window.parent;
  if (!targetWindow) {
    console.error('[modules/electron-api.ts] no window.parent');
    return;
  }
  targetWindow.postMessage(msg, '*');
}

const ChatogElectronAPIType = {
  CLOSE_WINDOW: 'CLOSE_WINDOW',
  MINIMIZE_WINDOW: 'MINIMIZE_WINDOW',
  FULLSCREEN_WINDOW: 'FULLSCREEN_WINDOW',
  RESIZE_WINDOW: 'RESIZE_WINDOW',
  SET_RESIZABLE: 'SET_RESIZABLE',
  CENTER_WINDOW: 'CENTER_WINDOW'
};

const ElectronAPI = {
  closeWindow() {
    send({
      type: ChatogElectronAPIType.CLOSE_WINDOW
    });
  },
  minimizeWindow() {
    send({
      type: ChatogElectronAPIType.MINIMIZE_WINDOW
    });
  },
  fullscreenWindow(full: boolean) {
    send({
      type: ChatogElectronAPIType.FULLSCREEN_WINDOW,
      payload: full
    });
  },
  resizeWindow(size: { width: number; height: number }) {
    send({
      type: ChatogElectronAPIType.RESIZE_WINDOW,
      payload: size
    });
  },
  setResizable(resizable: boolean) {
    send({
      type: ChatogElectronAPIType.SET_RESIZABLE,
      payload: resizable
    });
  },
  centerWindow() {
    send({
      type: ChatogElectronAPIType.CENTER_WINDOW
    });
  }
};

export default ElectronAPI;

export function configureHomePageWindow() {
  ElectronAPI.resizeWindow({
    width: 380,
    height: 540
  });
  ElectronAPI.centerWindow();
  ElectronAPI.setResizable(false);
}

export function configureRoomPageWindow() {
  ElectronAPI.resizeWindow({
    width: 1080,
    height: 720
  });
  ElectronAPI.centerWindow();
  ElectronAPI.setResizable(true);
}
