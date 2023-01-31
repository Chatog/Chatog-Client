import { RoomMemberVO } from '@/api/room';
import { useRoomStore } from '@/store/room';
import { storeToRefs } from 'pinia';
import { Socket } from 'socket.io-client';

const SYNC_TYPE = {
  SYNC_ROOM_MEMBERS: 'SYNC_ROOM_MEMBERS'
};

export function registerSyncHandlers(socket: Socket) {
  socket.on(SYNC_TYPE.SYNC_ROOM_MEMBERS, (members: RoomMemberVO[]) => {
    const { roomMembers } = storeToRefs(useRoomStore());
    roomMembers.value = members;
  });
}
