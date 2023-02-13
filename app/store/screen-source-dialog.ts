import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface ScreenSource {
  sourceId: string;
  name: string;
  thumbnail: string;
}

export const useScreenSourceDiaogStore = defineStore(
  'screen-source-dialog',
  () => {
    const screenSourceDialogShow = ref(false);
    const screens = ref<ScreenSource[]>([]);
    const chosedScreen = ref('');

    /**
     * show screen source dialog for user to choose
     * and return chosed source.sourceId
     * @param sources scources to show in dialog
     */
    function chooseScreen(sources: ScreenSource[]): Promise<string> {
      screens.value = sources;
      screenSourceDialogShow.value = true;
      chosedScreen.value = sources[0].sourceId;

      return new Promise((resolve, reject) => {
        screenResolve.value = (sourceId) => {
          resolve(sourceId);
          cleanResolveReject();
        };
        screenReject.value = (e) => {
          reject(e);
          cleanResolveReject();
        };
      });
    }
    const emptyFunction = () => {};
    function cleanResolveReject() {
      screenSourceDialogShow.value = false;
      screenResolve.value = emptyFunction;
      screenReject.value = emptyFunction;
    }
    let screenResolve = ref<(sourceId: string) => void>(emptyFunction);
    let screenReject = ref<(e: any) => void>(emptyFunction);

    return {
      screenSourceDialogShow,
      screens,
      chosedScreen,
      chooseScreen,
      screenResolve,
      screenReject
    };
  }
);
