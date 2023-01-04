import { ref } from 'vue';
import { defineStore } from 'pinia';
import { RoomInfo, RoomMember } from '@/api/room';

export const useRoomStore = defineStore('room', () => {
  const myMemberId = ref('');

  const roomInfo = ref<RoomInfo>({
    roomId: '',
    roomName: '',
    roomStartTime: 0
  });

  let roomMembersStore: RoomMember[] = [];
  const roomMembers = ref<RoomMember[]>([]);

  const updateRoomMembers = (v: RoomMember[]) => {
    roomMembersStore = v;
    roomMembers.value = v;
  };

  const resetRoomMembers = () => {
    roomMembers.value = roomMembersStore;
  };

  return {
    myMemberId,
    roomInfo,
    roomMembers,
    updateRoomMembers,
    resetRoomMembers
  };
});
