<template>
  <v-app>
    <router-view />
  </v-app>
  <!-- alert -->
  <div class="global-alert-container" :style="alertStyle">
    <v-fade-transition>
      <v-alert class="global-alert" :type="alertType" v-if="alertShow">{{
        alertText
      }}</v-alert></v-fade-transition
    >
  </div>
  <!-- loading -->
  <div class="global-loading-container" v-if="loadingShow">
    <v-progress-circular
      indeterminate
      size="56"
      color="#FFF"
    ></v-progress-circular>
    <div class="global-loading-text">{{ loadingText }}</div>
  </div>
</template>

<script setup lang="ts">
import { useAlertStore } from '@/store/alert';
import { storeToRefs } from 'pinia';
import { useLoadingStore } from '@/store/loading';
import { IS_ELECTRON } from '@/utils/common';

const { alertType, alertText, alertShow } = storeToRefs(useAlertStore());
const alertStyle = {
  // must under toolbar in electron
  top: IS_ELECTRON ? `${64 + 16}px` : '16px'
};

const { loadingText, loadingShow } = storeToRefs(useLoadingStore());
</script>

<style>
/* hide scroll bar */
html,
body {
  overflow: hidden !important;
}

/* support drag to move window */
.enable-move {
  -webkit-app-region: drag;
}
/* button draggable will stop click */
.enable-move button {
  -webkit-app-region: no-drag;
}

.global-alert-container {
  position: absolute;
  z-index: 999;
  width: 96%;
  max-width: 480px;
  left: 50%;
  transform: translateX(-50%);
}

.global-loading-container {
  position: absolute;
  z-index: 999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.global-loading-text {
  font-size: 14px;
  margin-top: 8px;
  margin-bottom: -8px;
  color: #fff;
}
</style>
