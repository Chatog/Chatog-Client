<template>
  <div class="home-form-page">
    <div class="text-h5 home-form-page__title">CREATE NEW ROOM</div>
    <div class="home-form-page__form">
      <v-text-field
        label="Nickname"
        variant="outlined"
        v-model="createRoomForm.nickname"
      ></v-text-field>
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
    <v-btn variant="flat" color="primary" @click="confirmCreateRoom"
      >Confirm</v-btn
    >
    <v-btn variant="tonal" @click="$router.push('/home')">Cancel</v-btn>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { reqCreateRoom } from '@/api/room';
import { IS_ELECTRON } from '@/utils/common';
import { alert } from '@/store/alert';
import { defaultNickname } from '@/utils/storage';
import { configureRoomPageWindow } from '@/modules/electron-api';

const createRoomForm = reactive({
  nickname: defaultNickname(),
  roomName: '',
  banVideo: false,
  banAudio: false,
  banScreen: false,
  banChat: false
});

const router = useRouter();
async function confirmCreateRoom() {
  // validate
  if (createRoomForm.roomName === '') {
    alert('warning', 'please enter a room name');
    return;
  }
  reqCreateRoom(createRoomForm).then((res) => {
    const memberId = res.data;
    if (IS_ELECTRON) {
      configureRoomPageWindow();
    }
    router.push(`/room/${memberId}`);
    // save latest nickname
    defaultNickname(createRoomForm.nickname);
  });
}
</script>

<style scoped>
.home-form-page__form .v-col {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
