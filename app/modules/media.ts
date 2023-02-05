import { IS_ELECTRON } from '@/utils/common';
import MediaManager from '@/media';

let cameraMediaId = '';

export async function pubCamera() {
  const mediaStream = await getUserMedia('camera');
  const videoTrack = mediaStream.getVideoTracks()[0];
  cameraMediaId = await MediaManager.pubMedia(videoTrack);
}

export async function unpubCamera() {
  await MediaManager.unpubMedia(cameraMediaId);
}

export async function getUserMedia(
  type: 'mic' | 'camera' | 'screen',
  options?: any
): Promise<MediaStream> {
  if (!IS_ELECTRON) {
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
  }
  return Promise.reject('[getUserMedia] not implemented yet');
}
