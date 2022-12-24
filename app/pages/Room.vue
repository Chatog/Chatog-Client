<template>
  <v-toolbar v-if="IS_ELECTRON" class="enable-move"></v-toolbar>
  <div>ROOM</div>
  <v-btn @click="quitRoom">Hang up</v-btn>
</template>

<script setup lang="ts">
import { IS_ELECTRON } from '@/utils/common';
import { useRouter } from 'vue-router';

const router = useRouter();
function quitRoom() {
  window.ELECTRON_API?.reconfigureWindow('home');
  router.push({ path: '/home' });
}
</script>
