export type ElectronAPI = {
  closeWindow: () => void;
  reconfigureWindow: (type: 'home' | 'room') => void;
  openPath: (path: string) => void;
  selectPath: (defaultPath: string, title: string) => Promise<string>;
  minimizeWindow: () => void;
  setFullScreen: (full: boolean) => void;
  openStats: () => void;
};

declare global {
  interface Window {
    CHATOG_API?: ElectronAPI;
  }
}
