<template>
  <div class="home-form-page">
    <div class="text-h5 home-form-page__title">CREATE NEW ROOM</div>
    <div class="home-form-page__form">
      <v-text-field
        label="Room Name"
        variant="outlined"
        v-model="createRoomForm.roomName"
      ></v-text-field>
      <v-row>
        <v-col>
          <v-checkbox
            hide-details
            label="Ban Video"
            v-model="createRoomForm.banVideo"
          ></v-checkbox
        ></v-col>
        <v-col>
          <v-checkbox
            hide-details
            label="Ban Audio"
            v-model="createRoomForm.banAudio"
          ></v-checkbox
        ></v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-checkbox
            hide-details
            label="Ban Screen"
            v-model="createRoomForm.banScreen"
          ></v-checkbox
        ></v-col>
        <v-col>
          <v-checkbox
            hide-details
            label="Ban Chat"
            v-model="createRoomForm.banChat"
          ></v-checkbox
        ></v-col>
      </v-row>
    </div>
    <v-btn variant="flat" color="primary" @click="confirm">Confirm</v-btn>
    <v-btn variant="tonal" @click="$router.push('/home')">Cancel</v-btn>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { reqCreateRoom } from '@/api/room';
import { IS_ELECTRON } from '@/utils/common';
import { alert } from '@/store/alert';

const createRoomForm = reactive({
  roomName: '',
  banVideo: false,
  banAudio: false,
  banScreen: false,
  banChat: false
});

const router = useRouter();
async function confirm() {
  // validate
  if (createRoomForm.roomName === '') {
    alert('warning', 'please enter a room name');
    return;
  }
  const res = await reqCreateRoom(createRoomForm);
  if (IS_ELECTRON) {
    window.ELECTRON_API?.reconfigureWindow('room');
  }
  router.push(`/room/${res.data.roomId}`);
}
</script>

<style scoped>
.home-form-page__form .v-col {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
