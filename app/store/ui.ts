import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('ui', () => {
  const roomMemberPanelShow = ref(false);
  const mediaPanelShow = ref(false);
  const recordDialogShow = ref(false);

  return {
    roomMemberPanelShow,
    mediaPanelShow,
    recordDialogShow
  };
});
