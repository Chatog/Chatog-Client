import { IS_ELECTRON } from '@/utils/common';
import MediaManager from '@/media';
import { IMediaVO, useMediaStore } from '@/store/media';
import { selfMemberId } from '@/store/room';
import { alert } from '@/store/alert';
import ELECTRON_API from '@/modules/electron/api';
import { storeToRefs } from 'pinia';
import NSAgent from '@/modules/ns-agent';
import { useMediaControlStore } from '@/store/media-control';

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
  try {
    /**
     * @FIX we must recapture audio stream because once unpub
     * mediasoup will turn the original track to ended
     */
    const mediaStream = await getSingleMedia(MediaType.MIC);
    let audioTrack = mediaStream.getAudioTracks()[0];
    // check if noise suppression on
    const { noiseSuppressionOn } = storeToRefs(useMediaControlStore());
    if (noiseSuppressionOn.value) {
      const denoisedStream = NSAgent.startNoiseSuppression(mediaStream);
      audioTrack = denoisedStream.getAudioTracks()[0];
    } else {
      NSAgent.stopNoiseSuppression();
    }
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
  } catch (e) {
    console.error('[pubMic]', e);
  }
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
  try {
    const MediaStore = useMediaStore();
    if (MediaStore.localCameraMedia) return;
    // pub camera media
    const mediaStream = await getSingleMedia(MediaType.CAMERA);
    const videoTrack = mediaStream.getVideoTracks()[0];
    MediaManager.pubMedia(videoTrack, {
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
  } catch (e) {
    console.error('[pubCamera]', e);
  }
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
  try {
    const MediaStore = useMediaStore();
    if (MediaStore.localScreenMedia) return;
    // pub camera media
    const mediaStream = await getSingleMedia(MediaType.SCREEN);
    const videoTrack = mediaStream.getVideoTracks()[0];
    MediaManager.pubMedia(videoTrack, {
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
  } catch (e) {
    console.error('[pubScreen]', e);
  }
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
export interface GetSingleMediaOptions {
  width?: number;
  height?: number;
  framerate?: number;
}
/**
 * get single media: mic/camera/screen
 */
export async function getSingleMedia(
  type: MediaType,
  options?: GetSingleMediaOptions
): Promise<MediaStream> {
  if (type === MediaType.MIC) {
    return navigator.mediaDevices.getUserMedia({
      audio: true
    });
  }
  if (type === MediaType.CAMERA) {
    return navigator.mediaDevices.getUserMedia({
      video: {
        width: {
          ideal: options?.width ?? 1920
        },
        height: {
          ideal: options?.height ?? 1080
        },
        frameRate: options?.framerate ?? 30
      }
    });
  }
  if (type === MediaType.SCREEN) {
    if (IS_ELECTRON) {
      return ELECTRON_API.getDisplayMedia({
        width: options?.width ?? window.screen.width,
        height: options?.height ?? window.screen.height,
        framerate: options?.framerate ?? 6
      });
    } else {
      return navigator.mediaDevices.getDisplayMedia({
        video: {
          width: {
            ideal: options?.width ?? 99999
          },
          height: {
            ideal: options?.height ?? 99999
          },
          frameRate: options?.framerate ?? 6
        }
      });
    }
  }
  return Promise.reject('[getSingleMedia] invalid type');
}
