import { IS_ELECTRON } from '@/utils/common';
import MediaManager from '@/media';
import { IMediaVO, useMediaStore } from '@/store/media';
import { selfMemberId } from '@/store/room';
import { alert } from '@/store/alert';
import ELECTRON_API from '@/modules/electron/api';
import { storeToRefs } from 'pinia';
import NSAgent from '@/modules/ns-agent';
import { useMediaControlStore, VideoMode } from '@/store/media-control';
import VideoModeAgent from './video-mode-agent';

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
    // get camera video
    const mediaStream = await getSingleMedia(MediaType.CAMERA);
    const videoTrack = mediaStream.getVideoTracks()[0];

    const { localCameraMode } = storeToRefs(useMediaControlStore());
    MediaManager.pubMedia(videoTrack, {
      codec: 'vp9',
      encodings:
        localCameraMode.value === VideoMode.SMOOTH
          ? CAMERA_SVC_ENCODINGS
          : undefined,
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
  // clean main media
  if (MediaStore.mainMediaId === MediaStore.localCameraMedia.imid) {
    MediaStore.mainMediaId = '';
  }
  MediaStore.localCameraMedia = null;
}
/**
 * screen
 */
export async function pubScreen() {
  try {
    const MediaStore = useMediaStore();
    const { localScreenMode } = storeToRefs(useMediaControlStore());
    if (MediaStore.localScreenMedia) return;
    // smooth => 15fps; stable/quality => 6fps
    const options: GetSingleMediaOptions = {
      framerate: localScreenMode.value === VideoMode.SMOOTH ? 15 : 6
    };
    const mediaStream = await getSingleMedia(MediaType.SCREEN, options);
    const videoTrack = mediaStream.getVideoTracks()[0];
    // check if need to control video encoder
    const shouldControlVideoEncoder =
      localScreenMode.value === VideoMode.QUALITY;
    if (shouldControlVideoEncoder) {
      VideoModeAgent.controlVideoEncoder(VideoMode.QUALITY);
    }

    MediaManager.pubMedia(videoTrack, {
      codec: 'vp9',
      encodings:
        localScreenMode.value === VideoMode.SMOOTH
          ? SCREEN_SVC_ENCODINGS
          : undefined,
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
      })
      .finally(() => {
        // remember to restore after publish
        if (shouldControlVideoEncoder) {
          VideoModeAgent.restoreVideoEncoder();
        }
      });
  } catch (e) {
    console.error('[pubScreen]', e);
  }
}
export function unpubScreen() {
  const MediaStore = useMediaStore();
  if (!MediaStore.localScreenMedia) return;
  MediaManager.unpubMedia(MediaStore.localScreenMedia.videoId);
  // clean main media
  if (MediaStore.mainMediaId === MediaStore.localScreenMedia.imid) {
    MediaStore.mainMediaId = '';
  }
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

const CAMERA_SVC_ENCODINGS = [{ scalabilityMode: 'S3T3_KEY' }];
const SCREEN_SVC_ENCODINGS = [{ scalabilityMode: 'S3T3', dtx: true }];
