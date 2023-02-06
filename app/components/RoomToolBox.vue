<template>
  <div class="room-toolbox">
    <ToolboxButton
      icon="mdi-microphone"
      hint="microphone"
      :active="!localMicMuted"
      @click="toggleMuteMic"
    ></ToolboxButton>
    <ToolboxButton
      icon="mdi-camera"
      hint="camera"
      :active="cameraActive"
      @click="togglePubCamera"
    ></ToolboxButton>
    <ToolboxButton
      icon="mdi-monitor"
      hint="share screen"
      :active="screenActive"
      @click="togglePubScreen"
    ></ToolboxButton>
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
import ToolboxButton from './room-toolbox/RoomToolboxButton.vue';
import { computed } from 'vue';
import { showDialog } from '@/store/dialog';
import { useRoomMemberPanelStore } from '@/store/ui';
import { storeToRefs } from 'pinia';
import { useRoomStore } from '@/store/room';
import { alert } from '@/store/alert';
import { reqQuitRoom } from '@/api/room';
import {
  pubMic,
  pubCamera,
  unpubCamera,
  unpubScreen,
  pubScreen
} from '@/modules/media';
import { useMediaStore } from '@/store/media';
import MediaManager from '@/media';

const { localMic, localMicMuted, localCameraMedia, localScreenMedia } =
  storeToRefs(useMediaStore());

/**
 * mic
 */
async function toggleMuteMic() {
  // if no mic, just pub
  if (localMic.value === '') {
    await pubMic();
    return;
  }
  // toggle local mic track.enabled
  const track = MediaManager.getMediaTrack(localMic.value);
  if (!track) return;
  if (localMicMuted.value) {
    track.enabled = true;
    localMicMuted.value = false;
  } else {
    track.enabled = false;
    localMicMuted.value = true;
  }
}

/**
 * camera
 */
const cameraActive = computed(() => localCameraMedia.value !== null);
async function togglePubCamera() {
  if (cameraActive.value) {
    await unpubCamera();
  } else {
    await pubCamera();
  }
}

/**
 * screen
 */
const screenActive = computed(() => localScreenMedia.value !== null);
async function togglePubScreen() {
  if (screenActive.value) {
    await unpubScreen();
  } else {
    await pubScreen();
  }
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
