import { RoomMemberVO } from '@/api/room';
import { useRoomStore } from '@/store/room';
import { storeToRefs } from 'pinia';
import { Socket } from 'socket.io-client';
import MediaManager from '@/media';
import { imediaStreams, useMediaStore } from '@/store/media';

const SYNC_TYPE = {
  SYNC_ROOM_MEMBERS: 'SYNC_ROOM_MEMBERS',
  SYNC_MEDIA: 'SYNC_MEDIA'
};

export interface MediaSyncInfo {
  type: 'add' | 'remove';
  imid: string;
  nickname?: string;
  audioId?: string;
  videoId?: string;
}

export function registerSyncHandlers(socket: Socket) {
  socket.on(SYNC_TYPE.SYNC_ROOM_MEMBERS, (members: RoomMemberVO[]) => {
    console.debug(
      '[socket/sync.ts] recv:',
      SYNC_TYPE.SYNC_ROOM_MEMBERS,
      members
    );
    const { roomMembers } = storeToRefs(useRoomStore());
    roomMembers.value = members;
  });

  socket.on(SYNC_TYPE.SYNC_MEDIA, async (info: MediaSyncInfo) => {
    console.debug('[socket/sync.ts] recv:', SYNC_TYPE.SYNC_MEDIA, info);
    const { remoteMedias, mainMediaId } = storeToRefs(useMediaStore());
    // add single media
    if (info.type === 'add') {
      // if nickname, means init a new imedia
      if (info.nickname) {
        const imedia = {
          imid: info.imid,
          nickname: info.nickname,
          audioId: '',
          videoId: ''
        };
        if (info.audioId) imedia.audioId = info.audioId;
        if (info.videoId) imedia.videoId = info.videoId;
        // for new imedia, just push, then media will be sub
        // when media-window mounted
        remoteMedias.value.push(imedia);
      }
      // add single video/audio to a existing imedia
      else {
        const imedia = remoteMedias.value.find((im) => im.imid === info.imid);
        if (!imedia) {
          console.error(`[socket/sync.ts] media[${info.imid}] not exists`);
          return;
        }
        const mediaStream = imediaStreams.get(imedia.imid);
        if (!mediaStream) {
          console.error(
            `[socket/sync.ts] mediaStream[${info.imid}] not exists`
          );
          return;
        }
        if (info.audioId) {
          imedia.audioId = info.audioId;
          const audioTrack = await MediaManager.subMedia(imedia.audioId);
          mediaStream.addTrack(audioTrack);
        }
        if (info.videoId) {
          imedia.videoId = info.videoId;
          const videoTrack = await MediaManager.subMedia(imedia.videoId);
          mediaStream.addTrack(videoTrack);
        }
      }
    }
    // remove single media
    else if (info.type === 'remove') {
      const imedia = remoteMedias.value.find((im) => im.imid === info.imid);
      if (!imedia) {
        console.error(`[socket/sync.ts] media[${info.imid}] not exists`);
        return;
      }
      const mediaStream = imediaStreams.get(imedia.imid);
      if (!mediaStream) {
        console.error(`[socket/sync.ts] mediaStream[${info.imid}] not exists`);
        return;
      }
      // if both media unsubed, just remove imedia
      // media-window unmount will do clean job
      if (
        (imedia.audioId === '' && info.videoId !== '') ||
        (info.audioId !== '' && imedia.videoId === '')
      ) {
        remoteMedias.value.splice(remoteMedias.value.indexOf(imedia), 1);
        // reset main media to avoid main media deleted
        mainMediaId.value =
          remoteMedias.value.length > 0 ? remoteMedias.value[0].imid : '';
        return;
      }
      // only remove audio/video, another left
      if (info.audioId) {
        const audioTrack = mediaStream.getAudioTracks()[0];
        mediaStream.removeTrack(audioTrack);
        imedia.audioId = '';
        await MediaManager.unsubMedia(info.audioId);
      }
      if (info.videoId) {
        const videoTrack = mediaStream.getVideoTracks()[0];
        mediaStream.removeTrack(videoTrack);
        imedia.videoId = '';
        await MediaManager.unsubMedia(info.videoId);
      }
    }
  });
}
