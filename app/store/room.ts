import { ref } from 'vue';
import { defineStore } from 'pinia';
import { RoomInfo } from '@/api/room';

export const useRoomStore = defineStore('room', () => {
  const roomInfo = ref<RoomInfo>({
    roomId: '',
    roomName: '',
    roomStartTime: 0
  });

  return { roomInfo };
});
