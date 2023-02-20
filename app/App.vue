<template>
  <v-app>
    <router-view />
  </v-app>
  <!-- alert -->
  <div class="global-alert-container" :style="alertStyle">
    <v-fade-transition>
      <v-alert class="global-alert" :type="alertType" v-show="alertShow">{{
        alertText
      }}</v-alert></v-fade-transition
    >
  </div>
  <!-- loading -->
  <div class="global-loading-container" v-show="loadingShow">
    <v-progress-circular
      indeterminate
      size="56"
      color="#FFF"
    ></v-progress-circular>
    <div class="global-loading-text">{{ loadingText }}</div>
  </div>
  <!-- dialog -->
  <div class="global-dialog-container">
    <v-dialog v-model="dialogShow" width="80%" max-width="360" persistent>
      <v-card>
        <v-card-title>{{ dialogTitle }}</v-card-title>
        <v-card-text>{{ dialogText }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#666" @click="onDialogCancel">Cancel</v-btn>
          <v-btn color="primary" @click="onDialogConfirm">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { IS_ELECTRON, IS_MOBILE } from '@/utils/common';
import { storeToRefs } from 'pinia';
import { useAlertStore } from '@/store/alert';
import { useLoadingStore } from '@/store/loading';
import { useDialogStore } from '@/store/dialog';

const { alertType, alertText, alertShow } = storeToRefs(useAlertStore());
const alertStyle = {
  // must under toolbar in electron
  top: IS_ELECTRON ? `${40 + 16}px` : '16px'
};

const { loadingText, loadingShow } = storeToRefs(useLoadingStore());

const { dialogShow, dialogTitle, dialogText, dialogResolve, dialogReject } =
  storeToRefs(useDialogStore());
function onDialogCancel() {
  dialogShow.value = false;
  dialogReject.value();
}
function onDialogConfirm() {
  dialogShow.value = false;
  // wait until dialog hide animation ended
  setTimeout(() => dialogResolve.value(undefined), 280);
}

// avoid mobile bottom bar's block
if (IS_MOBILE) {
  onMounted(() => {
    document
      .querySelector('.v-application__wrap')
      ?.setAttribute('style', `min-height: ${window.innerHeight}px`);
  });
}
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

.global-dialog-container {
  position: absolute;
  z-index: 999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
