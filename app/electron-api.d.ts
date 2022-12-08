export type ElectronAPI = {
  openStats: () => void;
};

declare global {
  interface Window {
    ELECTRON_API?: ElectronAPI;
  }
}
