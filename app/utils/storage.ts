/* use localStorage as persistent store */
const store: Storage = window.localStorage;

function defineStringAttr(
  attrKey: string,
  defaultValue: string = ''
): (newVal?: string) => string {
  return (newVal) => {
    // getter
    if (newVal === undefined) {
      const val = store.getItem(attrKey);
      return val || defaultValue;
    }
    // setter
    else {
      store.setItem(attrKey, newVal);
      return newVal;
    }
  };
}

const RECORDS_SAVE_PATH = 'RECORDS_SAVE_PATH';
export const recordsSavePath = defineStringAttr(RECORDS_SAVE_PATH);

const DEFAULT_NICKNAME = 'DEFAULT_NICKNAME';
export const defaultNickname = defineStringAttr(DEFAULT_NICKNAME, 'FengLiu');
