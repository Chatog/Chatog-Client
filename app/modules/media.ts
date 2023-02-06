import { IS_ELECTRON } from '@/utils/common';
import MediaManager from '@/media';
import { IMediaVO, useMediaStore } from '@/store/media';
import { selfMemberId } from '@/store/room';
import { alert } from '@/store/alert';

export enum IMediaType {
  CHAT = 'chat',
  SCREEN = 'screen'
}
function initLocalIMedia(type: IMediaType): IMediaVO {
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
  const mediaStream = await getUserMedia(MediaType.MIC);
  const audioTrack = mediaStream.getAudioTracks()[0];
  MediaManager.pubMedia(audioTrack, {
    appData: {
      type: MediaType.MIC
    }
  })
    .then((micId) => {
      // update media store
      const MediaStore = useMediaStore();
      MediaStore.localMic = micId;
      MediaStore.localMicMuted = false;
    })
    .catch((e) => {
      alert('error', e);
    });
}
export function unpubMic() {
  const MediaStore = useMediaStore();
  if (!MediaStore.localMic) return;
  MediaManager.unpubMedia(MediaStore.localMic);
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
  const mediaStream = await getUserMedia(MediaType.CAMERA);
  const videoTrack = mediaStream.getVideoTracks()[0];
  await MediaManager.pubMedia(videoTrack, {
    appData: {
      type: MediaType.CAMERA
    }
  })
    .then((cameraId) => {
      // update media store
      const imedia = initLocalIMedia(IMediaType.CHAT);
      imedia.videoId = cameraId;
      MediaStore.localCameraMedia = imedia;
    })
    .catch((e) => {
      alert('error', e);
    });
}
export function unpubCamera() {
  const MediaStore = useMediaStore();
  if (!MediaStore.localCameraMedia) return;
  MediaManager.unpubMedia(MediaStore.localCameraMedia.videoId);
  MediaStore.localCameraMedia = null;
}
/**
 * screen
 */
export async function pubScreen() {
  const MediaStore = useMediaStore();
  if (MediaStore.localScreenMedia) return;
  // pub camera media
  const mediaStream = await getUserMedia(MediaType.SCREEN);
  const videoTrack = mediaStream.getVideoTracks()[0];
  await MediaManager.pubMedia(videoTrack, {
    appData: {
      type: MediaType.SCREEN
    }
  })
    .then((screenId) => {
      // update media store
      const imedia = initLocalIMedia(IMediaType.SCREEN);
      imedia.videoId = screenId;
      MediaStore.localScreenMedia = imedia;
    })
    .catch((e) => {
      alert('error', e);
    });
}
export function unpubScreen() {
  const MediaStore = useMediaStore();
  if (!MediaStore.localScreenMedia) return;
  MediaManager.unpubMedia(MediaStore.localScreenMedia.videoId);
  MediaStore.localScreenMedia = null;
}

export enum MediaType {
  MIC = 'mic',
  CAMERA = 'camera',
  SCREEN = 'screen'
}
export async function getUserMedia(
  type: MediaType,
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
