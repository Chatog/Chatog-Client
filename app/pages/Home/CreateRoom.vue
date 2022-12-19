<template>
  <div>
    <div>Create Room</div>
    <v-btn @click="createRoom">Confirm</v-btn>
    <v-btn @click="$router.push({ path: '/home' })">Cancel</v-btn>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
function createRoom() {
  window.ELECTRON_API?.reconfigureWindow('room');
  router.push('/room');
}
</script>
