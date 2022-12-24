/* use localStorage as persistent store */
const store: Storage = window.localStorage;

const RECORDS_SAVE_PATH = 'RECORDS_SAVE_PATH';
export function recordsSavePath(newVal?: string): string {
  // getter
  if (newVal === undefined) {
    const val = store.getItem(RECORDS_SAVE_PATH);
    return val || '';
  }
  // setter
  else {
    store.setItem(RECORDS_SAVE_PATH, newVal);
    return newVal;
  }
}
