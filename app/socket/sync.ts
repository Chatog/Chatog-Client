import { RoomMemberVO } from '@/api/room';
import { useRoomStore } from '@/store/room';
import { storeToRefs } from 'pinia';
import { Socket } from 'socket.io-client';
import MediaManager from '@/media';
import { imediaStreams, useMediaStore } from '@/store/media';
import { unpubCamera, unpubMic, unpubScreen } from '@/modules/media';
import { ChatMsg, ChatMsgState, useChatStore } from '@/store/chat';

const SYNC_TYPE = {
  SYNC_ROOM_MEMBERS: 'SYNC_ROOM_MEMBERS',
  SYNC_MEDIA: 'SYNC_MEDIA',
  SYNC_CHAT_MSG: 'SYNC_CHAT_MSG'
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
    const {
      remoteMedias,
      mainMediaId,
      localMic,
      localCameraMedia,
      localScreenMedia
    } = storeToRefs(useMediaStore());
    // add single media
    if (info.type === 'add') {
      // ignore local media sync
      if (
        (info.audioId && info.audioId === localMic.value) ||
        (info.videoId && info.videoId === localCameraMedia.value?.videoId) ||
        (info.videoId && info.videoId === localScreenMedia.value?.videoId)
      ) {
        console.debug('[socket/sync.ts] local media update, ignore');
        return;
      }
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
        console.debug('[socket/sync.ts] add new imedia', imedia);
        // for new imedia, just push, then media will be sub
        // when media-window mounted
        remoteMedias.value.push(imedia);
      }
      // add single video/audio to a existing imedia
      else {
        const imedia = remoteMedias.value.find((im) => im.imid === info.imid);
        if (!imedia) {
          console.warn(`[socket/sync.ts] media[${info.imid}] not exists`);
          return;
        }
        const mediaStream = imediaStreams.get(imedia.imid);
        if (!mediaStream) {
          console.warn(`[socket/sync.ts] mediaStream[${info.imid}] not exists`);
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
      /**
       * if local pub stopped via banMedia
       */
      if (info.audioId && info.audioId === localMic.value) {
        unpubMic();
        return;
      } else if (
        info.videoId &&
        info.videoId === localCameraMedia.value?.videoId
      ) {
        unpubCamera();
        return;
      } else if (
        info.videoId &&
        info.videoId === localScreenMedia.value?.videoId
      ) {
        unpubScreen();
        return;
      }
      /**
       * common remote media change
       */
      const imedia = remoteMedias.value.find((im) => im.imid === info.imid);
      /**
       * @FIX
       * 100% reproduct when unpub camera/screen, because local state
       * cleaned before sync message received
       */
      if (!imedia) {
        console.warn(`[socket/sync.ts] media[${info.imid}] not exists`);
        return;
      }
      const mediaStream = imediaStreams.get(imedia.imid);
      if (!mediaStream) {
        console.warn(`[socket/sync.ts] mediaStream[${info.imid}] not exists`);
        return;
      }
      // if both media unsubed, just remove imedia
      // media-window unmount will do clean job
      if (
        (imedia.audioId === '' && info.videoId) ||
        (info.audioId && imedia.videoId === '')
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

  socket.on(SYNC_TYPE.SYNC_CHAT_MSG, (msg: ChatMsg) => {
    console.debug('[socket/sync.ts] recv:', SYNC_TYPE.SYNC_MEDIA, msg);

    const ChatStore = useChatStore();
    const messages = [...ChatStore.messages];
    // add remote msg or update local msg
    const localMsg = messages.find((m) => m.msgId === msg.localId);
    if (localMsg) {
      localMsg.time = msg.time;
      localMsg.state = msg.state;
    } else {
      messages.push(msg);
    }

    // reorder message
    const confirmedMessages: ChatMsg[] = [];
    const sendingMessages: ChatMsg[] = [];
    for (const message of messages) {
      if (message.state === ChatMsgState.SENDING) {
        sendingMessages.push(message);
      } else {
        confirmedMessages.push(message);
      }
    }
    const sortedMessages = confirmedMessages
      .sort((m1, m2) => m1.time - m2.time)
      .concat(sendingMessages.sort((m1, m2) => m1.time - m2.time));

    ChatStore.messages = sortedMessages;
  });
}
