import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRoomMemberPanelStore = defineStore('room-member-panel', () => {
  const roomMemberPanelShow = ref(false);
  return {
    roomMemberPanelShow
  };
});
