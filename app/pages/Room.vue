<template>
  <v-toolbar v-if="IS_ELECTRON" class="enable-move"></v-toolbar>
  <div>ROOM ({{ props.roomId }})</div>
  <v-btn @click="quitRoom">Hang up</v-btn>
</template>

<script setup lang="ts">
import { IS_ELECTRON } from '@/utils/common';
import { useRouter } from 'vue-router';

const props = defineProps<{
  roomId: string;
}>();

const router = useRouter();
function quitRoom() {
  if (IS_ELECTRON) {
    window.ELECTRON_API?.reconfigureWindow('home');
  }
  router.push('/home');
}
</script>
