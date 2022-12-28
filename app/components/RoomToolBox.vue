<template>
  <div class="room-toolbox">
    <ToolBoxButton
      icon="mdi-microphone"
      :active="micActive"
      @click="toggleMic"
    ></ToolBoxButton>
    <ToolBoxButton icon="mdi-camera"></ToolBoxButton>
    <ToolBoxButton icon="mdi-monitor-share"></ToolBoxButton>
    <ToolBoxButton icon="mdi-chat"></ToolBoxButton>
    <ToolBoxButton icon="mdi-account-multiple"></ToolBoxButton>
    <ToolBoxButton
      icon="mdi-phone-hangup-outline"
      icon-color="#fff"
      backgroundColor="#F44336"
      @click="hangUp"
    ></ToolBoxButton>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import ToolBoxButton from './RoomToolBoxButton.vue';
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
