import { IS_ELECTRON } from '@/utils/common';
import MediaManager from '@/media';
import { IMediaVO, useMediaStore } from '@/store/media';
import { selfMemberId } from '@/store/room';

function initLocalMedia(type: 'chat' | 'screen'): IMediaVO {
  const memberId = selfMemberId();
  return {
    imid: memberId + '@' + type,
    nickname: 'Me',
    videoId: '',
    audioId: ''
  };
}

/**
 * mic
 */
export async function pubMic() {
  // pub mic audio
  const mediaStream = await getUserMedia('mic');
  const audioTrack = mediaStream.getAudioTracks()[0];
  const micId = await MediaManager.pubMedia(audioTrack, {
    appData: {
      type: 'mic'
    }
  });
  // update media store
  const MediaStore = useMediaStore();
  MediaStore.localMic = micId;
  MediaStore.localMicMuted = false;
}
export async function unpubMic() {
  const MediaStore = useMediaStore();
  if (!MediaStore.localMic) return;
  await MediaManager.unpubMedia(MediaStore.localMic);
  MediaStore.localMic = '';
  MediaStore.localMicMuted = true;
}
/**
 * camera
 */
export async function pubCamera() {
  const MediaStore = useMediaStore();
  if (MediaStore.localCameraMedia) return;
  // pub camera media
  const mediaStream = await getUserMedia('camera');
  const videoTrack = mediaStream.getVideoTracks()[0];
  const cameraId = await MediaManager.pubMedia(videoTrack, {
    appData: {
      type: 'camera'
    }
  });
  // update media store
  const imedia = initLocalMedia('chat');
  imedia.videoId = cameraId;
  MediaStore.localCameraMedia = imedia;
}
export async function unpubCamera() {
  const MediaStore = useMediaStore();
  if (!MediaStore.localCameraMedia) return;
  await MediaManager.unpubMedia(MediaStore.localCameraMedia.videoId);
  MediaStore.localCameraMedia = null;
}
/**
 * screen
 */
export async function pubScreen() {
  const MediaStore = useMediaStore();
  if (MediaStore.localScreenMedia) return;
  // pub camera media
  const mediaStream = await getUserMedia('screen');
  const videoTrack = mediaStream.getVideoTracks()[0];
  const screenId = await MediaManager.pubMedia(videoTrack, {
    appData: {
      type: 'screen'
    }
  });
  // update media store
  const imedia = initLocalMedia('screen');
  imedia.videoId = screenId;
  MediaStore.localScreenMedia = imedia;
}
export async function unpubScreen() {
  const MediaStore = useMediaStore();
  if (!MediaStore.localScreenMedia) return;
  await MediaManager.unpubMedia(MediaStore.localScreenMedia.videoId);
  MediaStore.localScreenMedia = null;
}

export async function getUserMedia(
  type: 'mic' | 'camera' | 'screen',
  options?: any
): Promise<MediaStream> {
  if (!IS_ELECTRON) {
    if (type === 'mic') {
      return navigator.mediaDevices.getUserMedia({
        audio: true
      });
    }
    if (type === 'camera') {
      return navigator.mediaDevices.getUserMedia({
        video: {
          width: {
            ideal: 1920
          },
          height: {
            ideal: 1080
          }
        }
      });
    }
    if (type === 'screen') {
      return navigator.mediaDevices.getDisplayMedia({
        video: {
          width: {
            ideal: 1920
          },
          height: {
            ideal: 1080
          }
        }
      });
    }
  }
  return Promise.reject('[getUserMedia] not implemented yet');
}
