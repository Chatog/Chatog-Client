import { ref } from 'vue';
import { defineStore } from 'pinia';
import { RoomInfo, RoomMemberVO } from '@/api/room';

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
  const roomMembers = ref<RoomMemberVO[]>([]);

  return {
    roomInfo,
    roomMembers
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
