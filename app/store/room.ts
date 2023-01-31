import { ref } from 'vue';
import { defineStore } from 'pinia';
import { RoomInfo, RoomMember } from '@/api/room';

export const useRoomStore = defineStore('room', () => {
  /**
   * room info
   */
  const roomInfo = ref<RoomInfo>({
    roomId: '',
    roomName: '',
    roomStartTime: 0
  });

  /**
   * room members
   */
  let realRoomMembers: RoomMember[] = [];
  const roomMembers = ref<RoomMember[]>([]);

  const updateRoomMembers = (v: RoomMember[]) => {
    realRoomMembers = v;
    roomMembers.value = v;
  };

  const resetRoomMembers = () => {
    roomMembers.value = realRoomMembers;
  };

  return {
    roomInfo,
    roomMembers,
    updateRoomMembers,
    resetRoomMembers
  };
});

/**
 * self memberId in current room
 */
let selfMemberIdVal = '';
export function selfMemberId(newVal?: string): string {
  if (newVal) {
    selfMemberIdVal = newVal;
  }
  return selfMemberIdVal;
}
