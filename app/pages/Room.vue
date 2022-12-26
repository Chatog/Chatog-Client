<template>
  <v-toolbar v-if="IS_ELECTRON" class="enable-move">
    <v-spacer></v-spacer>
    <v-btn icon="mdi-minus" @click="minimize"> </v-btn>
    <v-btn
      :icon="isFullScreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
      @click="toggleFullScreen"
    >
    </v-btn>
  </v-toolbar>
  <div>ROOM ({{ props.roomId }})</div>
  <v-btn @click="quitRoom">Hang up</v-btn>
</template>

<script setup lang="ts">
import { IS_ELECTRON } from '@/utils/common';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  roomId: string;
}>();

/**
 * toolbar
 */
function minimize() {
  window.ELECTRON_API?.minimizeWindow();
}

const isFullScreen = ref(false);
function toggleFullScreen() {
  const target = !isFullScreen.value;
  window.ELECTRON_API?.setFullScreen(target);
  isFullScreen.value = target;
}

const router = useRouter();
function quitRoom() {
  if (IS_ELECTRON) {
    window.ELECTRON_API?.reconfigureWindow('home');
  }
  router.push('/home');
}
</script>
