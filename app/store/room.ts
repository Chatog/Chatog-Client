import { ref } from 'vue';
import { defineStore } from 'pinia';
import { RoomInfo, RoomMemberVO } from '@/api/room';

export const useRoomStore = defineStore('room', () => {
  const myMemberId = ref('');

  const roomInfo = ref<RoomInfo>({
    roomId: '',
    roomName: '',
    roomStartTime: 0
  });

  const roomMembers = ref<RoomMemberVO[]>([]);

  return { myMemberId, roomInfo, roomMembers };
});
