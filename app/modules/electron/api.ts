import {
  ScreenSource,
  useScreenSourceDiaogStore
} from '@/store/screen-source-dialog';
import { IS_ELECTRON } from '@/utils/common';

interface CrossWindowMsg {
  type: string;
  payload?: any;
}
function send(msg: CrossWindowMsg) {
  if (!IS_ELECTRON) {
    console.error('[modules/electron/api.ts] not in electron');
    return;
  }
  const targetWindow = window.parent;
  if (!targetWindow) {
    console.error('[modules/electron/api.ts] no window.parent');
    return;
  }
  targetWindow.postMessage(msg, '*');
}

function call<T>(msg: CrossWindowMsg): Promise<T> {
  const type = msg.type;
  return new Promise((resolve, reject) => {
    // register a temp handler
    const onMessage = (e: { data: CrossWindowMsg }) => {
      console.debug('[modules/electron/api] recv message', e);
      if (e.data.type === type) {
        window.removeEventListener('message', onMessage);
        resolve(e.data.payload);
      }
    };
    window.addEventListener('message', onMessage);
    // send message
    send(msg);
  });
}

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
  },
  copyToClipboard(text: string) {
    send({
      type: ChatogElectronAPIType.COPY_TO_CLIPBOARD,
      payload: text
    });
  },
  async getDisplayMedia(options: {
    width: number;
    height: number;
    framerate: number;
  }): Promise<MediaStream> {
    const sources = await call<ScreenSource[]>({
      type: ChatogElectronAPIType.GET_SCREEN_SOURCES
    });
    const sourceId = await useScreenSourceDiaogStore().chooseScreen(sources);
    const electronVideoOptions: any = {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: sourceId,
        minFrameRate: options.framerate,
        maxFrameRate: options.framerate,
        maxWidth: options.width,
        maxHeight: options.height
      }
    };
    // @TEST
    console.warn(electronVideoOptions);
    return navigator.mediaDevices.getUserMedia({
      audio: false,
      video: electronVideoOptions
    });
  }
};

export default ElectronAPI;

export function configureWindow(type: 'home' | 'room') {
  if (type === 'home') {
    ElectronAPI.resizeWindow({
      width: 380,
      height: 540
    });
    ElectronAPI.centerWindow();
    ElectronAPI.setResizable(false);
  } else if (type === 'room') {
    ElectronAPI.resizeWindow({
      width: 1080,
      height: 720
    });
    ElectronAPI.centerWindow();
    ElectronAPI.setResizable(true);
  }
}
