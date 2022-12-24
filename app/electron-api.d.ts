export type ElectronAPI = {
  closeWindow: () => void;
  reconfigureWindow: (type: 'home' | 'room') => void;
  openPath: (path: string) => void;
  selectPath: () => Promise<string>;
  openStats: () => void;
};

declare global {
  interface Window {
    ELECTRON_API?: ElectronAPI;
  }
}
