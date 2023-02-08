import { ref } from 'vue';
import { defineStore } from 'pinia';

export interface IMediaVO {
  imid: string;
  nickname: string;
  videoId: string;
  audioId: string;
}

export const useMediaStore = defineStore('media', () => {
  /**
   * media panel
   */
  const localMic = ref('');
  const localMicMuted = ref(true);
  const localCameraMedia = ref<IMediaVO | null>(null);
  const localScreenMedia = ref<IMediaVO | null>(null);
  const remoteMedias = ref<IMediaVO[]>([]);

  function updateRemoteMedias(mediaList: IMediaVO[]) {
    remoteMedias.value = mediaList;
    // dont set mainMediaId, the first media-item will do this
  }

  function getIMedia(imid: string): IMediaVO | undefined {
    if (localCameraMedia.value?.imid === imid) return localCameraMedia.value;
    if (localScreenMedia.value?.imid === imid) return localScreenMedia.value;
    return remoteMedias.value.find((m) => m.imid === imid);
  }

  /**
   * main media
   */
  const mainMediaId = ref('');

  /**
   * record
   */
  const isRecording = ref(false);

  return {
    localMic,
    localMicMuted,
    localCameraMedia,
    localScreenMedia,
    remoteMedias,
    mainMediaId,
    isRecording,

    updateRemoteMedias,
    getIMedia
  };
});

/**
 * imid => MediaStream
 */
export const imediaStreams: Map<string, MediaStream> = new Map();
