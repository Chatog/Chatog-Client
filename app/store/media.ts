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

    updateRemoteMedias
  };
});

/**
 * imid => MediaStream
 */
export const imediaStreams: Map<string, MediaStream> = new Map();
