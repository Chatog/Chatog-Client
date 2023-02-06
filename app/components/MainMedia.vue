<template>
  <div class="main-media">
    <video id="mainMedia" ref="videoRef" autoplay></video>
  </div>
</template>

<script setup lang="ts">
import { imediaStreams, useMediaStore } from '@/store/media';
import { storeToRefs } from 'pinia';
import { ref, watchEffect, onBeforeUnmount } from 'vue';

const { mainMediaId } = storeToRefs(useMediaStore());

const videoRef = ref<HTMLVideoElement | null>(null);

const cleanSetMainMediaEffect = watchEffect(() => {
  if (videoRef.value) {
    videoRef.value.srcObject = imediaStreams.get(mainMediaId.value) || null;
  }
});

onBeforeUnmount(() => {
  cleanSetMainMediaEffect();
});
</script>

<style>
.main-media {
  position: absolute;
  width: 100%;
  height: 100%;
}
#mainMedia {
  width: 100%;
  height: 100%;
}
</style>
