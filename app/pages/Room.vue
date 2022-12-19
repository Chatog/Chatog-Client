<template>
  <v-toolbar class="enable-move"></v-toolbar>
  <div>ROOM</div>
  <v-btn @click="quitRoom">Hang up</v-btn>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
function quitRoom() {
  window.ELECTRON_API?.reconfigureWindow('home');
  router.push({ path: '/home' });
}
</script>
