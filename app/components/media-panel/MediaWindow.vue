<template>
  <div
    class="media-window"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <div v-show="isHover" class="media-window__cover">
      <div class="media-window__stats">
        <v-icon color="#FFF">mdi-chart-box-outline</v-icon>
      </div>
      <div class="media-window__actions">
        <v-icon color="#FFF" class="mb-4" @click.stop="() => {}"
          >mdi-microphone</v-icon
        >
        <v-icon color="#FFF" :size="20" @click.stop="() => {}"
          >mdi-camera</v-icon
        >
      </div>
    </div>

    <div class="media-window__name">Jacky</div>

    <div v-show="isShowing" class="media-window__showing">
      <v-icon color="#FFF" :size="32">mdi-arrow-right-bold-box</v-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isHover = ref(false);

const isShowing = ref(true);
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
</style>
