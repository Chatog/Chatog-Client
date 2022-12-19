export type ElectronAPI = {
  closeWindow: () => void;
  reconfigureWindow: (type: 'home' | 'room') => void;
  openStats: () => void;
};

declare global {
  interface Window {
    ELECTRON_API?: ElectronAPI;
  }
}
