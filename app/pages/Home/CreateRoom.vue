<template>
  <div>
    <h1>Create Room</h1>
    <v-text-field
      label="Room Name"
      variant="outlined"
      v-model="createRoomForm.roomName"
    ></v-text-field>
    <v-checkbox
      label="Ban Video"
      v-model="createRoomForm.banVideo"
    ></v-checkbox>
    <v-checkbox
      label="Ban Audio"
      v-model="createRoomForm.banAudio"
    ></v-checkbox>
    <v-checkbox
      label="Ban Screen Sharing"
      v-model="createRoomForm.banScreen"
    ></v-checkbox>
    <v-checkbox label="Ban Chat" v-model="createRoomForm.banChat"></v-checkbox>
    <v-btn @click="confirm">Confirm</v-btn>
    <v-btn @click="$router.push('/home')">Cancel</v-btn>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { reqCreateRoom } from '@/api/room';
import { IS_ELECTRON } from '@/utils/common';

const createRoomForm = reactive({
  roomName: '',
  banVideo: false,
  banAudio: false,
  banScreen: false,
  banChat: false
});

const router = useRouter();
async function confirm() {
  const res = await reqCreateRoom(createRoomForm);
  if (IS_ELECTRON) {
    window.ELECTRON_API?.reconfigureWindow('room');
  }
  router.push(`/room/${res.data.roomId}`);
}
</script>
