<template>
  <div>
    <v-dialog
      v-model="videoModeDialogShow"
      width="60%"
      max-width="360"
      persistent
    >
      <v-card>
        <v-card-title>Video Mode Select</v-card-title>
        <div class="video-mode-dialog__main">
          <v-radio-group
            v-model="cameraModeInput"
            label="Camera Video Mode"
            inline
          >
            <v-radio label="Stable" :value="VideoMode.STABLE"></v-radio>
            <v-radio label="QUALITY" :value="VideoMode.QUALITY"></v-radio>
            <v-radio label="SMOOTH" :value="VideoMode.SMOOTH"></v-radio>
          </v-radio-group>
          <v-radio-group
            v-model="screenModeInput"
            label="Screen Sharing Video Mode"
            inline
          >
            <v-radio label="Stable" :value="VideoMode.STABLE"></v-radio>
            <v-radio label="QUALITY" :value="VideoMode.QUALITY"></v-radio>
            <v-radio label="SMOOTH" :value="VideoMode.SMOOTH"></v-radio>
          </v-radio-group>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#666" @click="videoModeDialogShow = false"
            >Cancel</v-btn
          >
          <v-btn color="primary" @click="confirm">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '@/store/ui';
import { storeToRefs } from 'pinia';
import { useMediaControlStore, VideoMode } from '@/store/media-control';
import { ref } from 'vue';
import { alert } from '@/store/alert';

const { videoModeDialogShow } = storeToRefs(useUIStore());
const { localCameraMode, localScreenMode } = storeToRefs(
  useMediaControlStore()
);

const cameraModeInput = ref<VideoMode>(localCameraMode.value);
const screenModeInput = ref<VideoMode>(localScreenMode.value);

function confirm() {
  localCameraMode.value = cameraModeInput.value;
  localScreenMode.value = screenModeInput.value;
  // @TODO real impl
  alert('success', 'video mode changed');
  videoModeDialogShow.value = false;
}
</script>

<style scoped>
.video-mode-dialog__main {
  padding: 0 16px;
  margin-top: 8px;
}
</style>
