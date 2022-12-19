/**
 * whether in electron or in browser
 */
export function isElectron(): boolean {
  return window.ELECTRON_API !== undefined;
}
