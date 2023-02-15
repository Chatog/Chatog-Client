<template>
  <div class="home-page">
    <div class="logo">
      <v-icon class="logo__icon" size="52">mdi-message-video</v-icon>
      <div class="logo__text">CHATOG</div>
    </div>

    <!-- join room -->
    <div class="input-container">
      <v-text-field
        label="Nickname"
        variant="outlined"
        v-model="joinRoomForm.nickname"
      ></v-text-field>
    </div>
    <div class="input-container">
      <v-text-field
        label="Room ID"
        variant="outlined"
        v-model="joinRoomForm.roomNumber"
      ></v-text-field>
    </div>
    <v-btn variant="flat" color="primary" @click="confirmJoinRoom"
      >Join Room</v-btn
    >

    <div class="divider-container">
      <v-divider></v-divider>
      <div class="divider__text">or you can</div>
      <v-divider></v-divider>
    </div>

    <!-- create room -->
    <v-btn
      variant="flat"
      color="primary"
      @click="$router.push('/home/create-room')"
      >Create Room</v-btn
    >
  </div>
</template>

<script setup lang="ts">
import { IS_ELECTRON } from '@/utils/common';
import { defaultNickname } from '@/utils/storage';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { reqJoinRoom } from '@/api/room';
import { alert } from '@/store/alert';
import { configureWindow } from '@/modules/electron/api';

const joinRoomForm = reactive({
  nickname: defaultNickname(),
  roomNumber: ''
});

const router = useRouter();
async function confirmJoinRoom() {
  // validate
  if (joinRoomForm.nickname === '') {
    alert('warning', 'nickname cannot be empty');
    return;
  }
  if (joinRoomForm.roomNumber === '') {
    alert('warning', 'please enter the room id');
    return;
  }

  reqJoinRoom(joinRoomForm).then((res) => {
    const memberId = res.data;
    if (IS_ELECTRON) {
      configureWindow('room');
    }
    router.push(`/room/${memberId}`);
    // save latest nickname
    defaultNickname(joinRoomForm.nickname);
  });
}
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  height: 100%;
}
.logo {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 24px;
  user-select: none;
}
.logo__icon {
  margin-right: 16px;
}
.logo__text {
  font-size: 2rem;
  margin-bottom: 8px;
}
.input-container {
  width: 100%;
}
.home-page button {
  width: 100%;
}
.divider-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 16px 0;
}
.divider__text {
  font-size: 12px;
  font-weight: 300;
  color: #666;
  min-width: fit-content;
  margin: 0 6px;
}
.view-records {
  margin-top: auto;
}
</style>
