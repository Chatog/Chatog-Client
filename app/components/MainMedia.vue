<template>
  <div class="main-media">
    <video id="mainMedia" ref="videoRef"></video>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const videoRef = ref<HTMLVideoElement | null>(null);
</script>

<style>
.main-media {
  width: 100%;
  height: 100%;
}
</style>
