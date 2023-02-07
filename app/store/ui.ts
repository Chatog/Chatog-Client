import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('ui', () => {
  const roomMemberPanelShow = ref(false);
  const mediaPanelShow = ref(false);
  const recordDialogShow = ref(false);
  const chatPanelShow = ref(false);

  // RoomMemberPanel and ChatPanel cannot show at the same time
  function toggleRoomMemberPanelShow() {
    if (!roomMemberPanelShow.value) {
      if (chatPanelShow.value) chatPanelShow.value = false;
      roomMemberPanelShow.value = true;
    } else {
      roomMemberPanelShow.value = false;
    }
  }
  function toggleChatPanelShow() {
    if (!chatPanelShow.value) {
      if (roomMemberPanelShow.value) roomMemberPanelShow.value = false;
      chatPanelShow.value = true;
    } else {
      chatPanelShow.value = false;
    }
  }

  return {
    roomMemberPanelShow,
    mediaPanelShow,
    recordDialogShow,
    chatPanelShow,

    toggleRoomMemberPanelShow,
    toggleChatPanelShow
  };
});
