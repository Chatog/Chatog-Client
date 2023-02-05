<template>
  <div class="room-toolbox">
    <ToolboxButton
      icon="mdi-microphone"
      hint="microphone"
      :active="micActive"
      @click="toggleMic"
    ></ToolboxButton>
    <ToolboxButton
      icon="mdi-camera"
      hint="camera"
      :active="cameraActive"
      @click="toggleCamera"
    ></ToolboxButton>
    <ToolboxButton icon="mdi-monitor" hint="share screen"></ToolboxButton>
    <ToolboxButton icon="mdi-chat" hint="online chat"></ToolboxButton>
    <ToolboxButton
      icon="mdi-account-multiple"
      hint="room members"
      :active="roomMemberPanelShow"
      @click="toggleRoomMemberPanel"
    ></ToolboxButton>
    <ToolboxButton
      icon="mdi-account-plus"
      hint="invite others"
      @click="invite"
    ></ToolboxButton>
    <ToolboxButton
      icon="mdi-phone-hangup-outline"
      backgroundColor="#F44336"
      hint="quit room"
      @click="hangUp"
    ></ToolboxButton>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import ToolboxButton from './room-toolbox/RoomToolboxButton.vue';
import { ref } from 'vue';
import { showDialog } from '@/store/dialog';
import { useRoomMemberPanelStore } from '@/store/ui';
import { storeToRefs } from 'pinia';
import { useRoomStore } from '@/store/room';
import { alert } from '@/store/alert';
import { reqQuitRoom } from '@/api/room';
import { pubCamera, unpubCamera } from '@/modules/media';

const router = useRouter();

/**
 * mic
 */
const micActive = ref(false);
function toggleMic() {
  micActive.value = !micActive.value;
}

/**
 * camera
 */
const cameraActive = ref(false);
async function toggleCamera() {
  if (cameraActive.value) {
    await unpubCamera();
  } else {
    await pubCamera();
  }
  cameraActive.value = !cameraActive.value;
}

/**
 * room member
 */
const { roomMemberPanelShow } = storeToRefs(useRoomMemberPanelStore());
function toggleRoomMemberPanel() {
  roomMemberPanelShow.value = !roomMemberPanelShow.value;
}

/**
 * invite
 */
const { roomInfo } = storeToRefs(useRoomStore());
async function invite() {
  await navigator.clipboard.writeText(roomInfo.value.roomId);
  alert('success', 'room number copied to clipboard', 2000);
}

/**
 * hang up
 */
function hangUp() {
  showDialog('Are you sure to quit room?')
    .then(() => {
      reqQuitRoom();
    })
    .catch(() => {});
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
