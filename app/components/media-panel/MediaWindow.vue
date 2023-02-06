<template>
  <div
    class="media-window"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <!-- @TODO local media mute/unmute -->
    <!-- <div class="media-window__actions">
        <v-icon color="#FFF" class="mb-4" @click.stop="() => {}"
          >mdi-microphone</v-icon
        >
        <v-icon color="#FFF" :size="20" @click.stop="() => {}"
          >mdi-camera</v-icon
        >
      </div> -->

    <div v-show="isHover" class="media-window__stats">
      <v-icon color="#FFF">mdi-chart-box-outline</v-icon>
    </div>

    <div class="media-window__name">{{ media.nickname }}</div>

    <div v-show="isMainMedia" class="media-window__showing">
      <v-icon color="#FFF" :size="32">mdi-arrow-right-bold-box</v-icon>
    </div>
    <video
      autoplay
      playsinline
      ref="videoRef"
      class="media-window__video"
      @click="switchMainMedia"
    ></video>
  </div>
</template>

<script setup lang="ts">
import { imediaStreams, IMediaVO, useMediaStore } from '@/store/media';
import { storeToRefs } from 'pinia';
import {
  ref,
  toRefs,
  computed,
  onMounted,
  watchEffect,
  onBeforeUnmount
} from 'vue';
import MediaManager from '@/media';

const props = defineProps<{
  media: IMediaVO;
}>();
const { media } = toRefs(props);

const { mainMediaId } = storeToRefs(useMediaStore());

const isHover = ref(false);
const isMainMedia = computed(() => media.value.imid === mainMediaId.value);
const videoRef = ref<HTMLVideoElement | null>(null);

onMounted(async () => {
  // sub audio and video track
  const audioTrack =
    media.value.audioId !== ''
      ? await MediaManager.subMedia(media.value.audioId)
      : null;
  const videoTrack =
    media.value.videoId !== ''
      ? await MediaManager.subMedia(media.value.videoId)
      : null;
  // track to playable stream
  const tracks = [];
  audioTrack && tracks.push(audioTrack);
  videoTrack && tracks.push(videoTrack);
  const stream = new MediaStream(tracks);
  imediaStreams.set(media.value.imid, stream);
  // the first media-window should handle main media issue
  if (mainMediaId.value === '') {
    mainMediaId.value = media.value.imid;
  } else if (!isMainMedia.value) {
    videoRef.value!.srcObject = stream;
  }
});

const cleanMainMediaSwitchEffect = watchEffect(() => {
  if (!videoRef.value) return;
  if (isMainMedia.value) {
    // main media not play in window
    videoRef.value.srcObject = null;
  } else {
    videoRef.value.srcObject = imediaStreams.get(media.value.imid) || null;
  }
});

onBeforeUnmount(() => {
  cleanMainMediaSwitchEffect();
  videoRef.value!.srcObject = null;
  if (media.value.audioId !== '') MediaManager.unsubMedia(media.value.audioId);
  if (media.value.videoId !== '') MediaManager.unsubMedia(media.value.videoId);
  imediaStreams.delete(media.value.imid);
});

function switchMainMedia() {
  // already main media
  if (isMainMedia.value) return;

  mainMediaId.value = media.value.imid;
}
</script>

<style>
.media-window {
  width: 160px;
  height: 100px;
  background-color: #040404;
  border-radius: 4px;

  position: relative;
}
.media-window:hover {
  outline: 2px solid #9e9e9e;
  cursor: pointer;
}
.media-window__cover {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
}
.media-window__stats {
  position: absolute;
  top: 4px;
  left: 4px;
}
.media-window__name {
  position: absolute;
  bottom: 4px;
  left: 8px;
  color: #fff;
  font-size: 12px;
}
.media-window__showing {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-55%, -50%);
}
.media-window__actions {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.media-window__video {
  width: 100%;
  height: 100%;
}
</style>
