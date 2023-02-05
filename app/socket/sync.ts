import { RoomMemberVO } from '@/api/room';
import { useRoomStore } from '@/store/room';
import { storeToRefs } from 'pinia';
import { Socket } from 'socket.io-client';
import MediaManager from '@/media';

const SYNC_TYPE = {
  SYNC_ROOM_MEMBERS: 'SYNC_ROOM_MEMBERS',
  SYNC_MEDIA: 'SYNC_MEDIA'
};

export function registerSyncHandlers(socket: Socket) {
  socket.on(SYNC_TYPE.SYNC_ROOM_MEMBERS, (members: RoomMemberVO[]) => {
    const { roomMembers } = storeToRefs(useRoomStore());
    roomMembers.value = members;
  });

  socket.on(SYNC_TYPE.SYNC_MEDIA, async (payload: { mediaId: string }) => {
    // @TODO
    const track = await MediaManager.subMedia(payload.mediaId);
    console.log(track);
    const mainMediaEl = document.getElementById(
      'mainMedia'
    ) as HTMLVideoElement;
    mainMediaEl.srcObject = new MediaStream([track]);
  });
}
