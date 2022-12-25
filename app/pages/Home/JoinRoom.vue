<template>
  <div>
    <h1>Join Room</h1>
    <v-text-field
      label="Room Number"
      variant="outlined"
      v-model="roomNumber"
    ></v-text-field>
    <v-btn @click="confirm">Confirm</v-btn>
    <v-btn @click="$router.push('/home')">Cancel</v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { reqJoinRoom } from '@/api/room';
import { IS_ELECTRON } from '@/utils/common';

const roomNumber = ref('');

const router = useRouter();
async function confirm() {
  const res = await reqJoinRoom(roomNumber.value);
  if (IS_ELECTRON) {
    window.ELECTRON_API?.reconfigureWindow('room');
  }
  router.push(`/room/${res.data.roomId}`);
}
</script>
