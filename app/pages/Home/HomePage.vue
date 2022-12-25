<template>
  <div class="home-page">
    <!-- @TODO we need better logo-->
    <div class="logo">
      <v-icon class="logo__icon" size="52">mdi-message-video</v-icon>
      <div class="logo__text">CHATOG</div>
    </div>

    <!-- join room -->
    <div class="input-container">
      <v-text-field
        class=""
        label="Room ID"
        variant="outlined"
        v-model="roomId"
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

    <!-- view records: not supported in web -->
    <div
      v-if="IS_ELECTRON"
      class="view-records clickable"
      style="text-decoration: underline"
      @click="viewRecords"
    >
      view records
    </div>
  </div>
</template>

<script setup lang="ts">
import { IS_ELECTRON } from '@/utils/common';
import { recordsSavePath } from '@/utils/storage';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { reqJoinRoom } from '@/api/room';
import { alert } from '@/store/alert';

function viewRecords() {
  window.ELECTRON_API?.openPath(recordsSavePath());
}

const roomId = ref('');

const router = useRouter();
async function confirmJoinRoom() {
  // validate
  if (roomId.value === '') {
    alert('warning', 'please enter the room id');
    return;
  }
  const res = await reqJoinRoom(roomId.value);
  if (IS_ELECTRON) {
    window.ELECTRON_API?.reconfigureWindow('room');
  }
  router.push(`/room/${res.data.roomId}`);
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
  margin-top: 16px;
  margin-bottom: 32px;
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
