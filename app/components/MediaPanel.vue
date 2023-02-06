<template>
  <div class="media-panel">
    <MediaWindow v-for="media of medias" :key="media.imid" :media="media" />
  </div>
</template>

<script setup lang="ts">
import { useMediaStore } from '@/store/media';
import { storeToRefs } from 'pinia';
import MediaWindow from './media-panel/MediaWindow.vue';
import { computed } from 'vue';

const { localCameraMedia, localScreenMedia, remoteMedias } = storeToRefs(
  useMediaStore()
);

// sort: camera, screen, remote...
const medias = computed(() => {
  const ret = [...remoteMedias.value];
  if (localScreenMedia.value) {
    ret.unshift(localScreenMedia.value);
  }
  if (localCameraMedia.value) {
    ret.unshift(localCameraMedia.value);
  }
  return ret;
});
</script>

<style scoped>
.media-panel {
  height: 100%;
  padding: 12px;
  /* 160 + 12*2 */
  min-width: 184px;
}
.media-panel > div:not(:last-child) {
  margin-bottom: 8px;
}
</style>
