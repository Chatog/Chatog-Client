<template>
  <div class="room-toolbox">
    <ToolboxButton
      icon="mdi-microphone"
      hint="microphone"
      :active="micActive"
      @click="toggleMic"
    ></ToolboxButton>
    <ToolboxButton icon="mdi-camera" hint="camera"></ToolboxButton>
    <ToolboxButton icon="mdi-monitor-share" hint="share screen"></ToolboxButton>
    <ToolboxButton icon="mdi-chat" hint="online chat"></ToolboxButton>
    <ToolboxButton
      icon="mdi-account-multiple"
      hint="room members"
    ></ToolboxButton>
    <ToolboxButton
      icon="mdi-phone-hangup-outline"
      icon-color="#fff"
      backgroundColor="#F44336"
      hint="quit room"
      @click="hangUp"
    ></ToolboxButton>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import ToolboxButton from './RoomToolboxButton.vue';
import { ref } from 'vue';

const router = useRouter();

const micActive = ref(false);
function toggleMic() {
  micActive.value = !micActive.value;
}

function hangUp() {
  window.ELECTRON_API?.reconfigureWindow('home');
  router.push('/home');
}
</script>

<style scoped>
.room-toolbox {
  padding: 8px;
  background-color: rgb(20, 20, 20);
  border-radius: 4px;
  display: flex;
  flex-direction: row;
}
.room-toolbox div:not(:last-child) {
  margin-right: 8px;
}
</style>
