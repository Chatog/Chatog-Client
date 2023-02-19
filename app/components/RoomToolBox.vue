<template>
  <div class="room-toolbox">
    <ToolboxButton
      icon="mdi-microphone"
      hint="microphone"
      :active="!localMicMuted"
      @click="toggleMuteMic"
    ></ToolboxButton>
    <ToolboxButton
      v-if="!IS_MOBILE"
      icon="mdi-camera"
      hint="camera"
      :active="cameraActive"
      @click="togglePubCamera"
    ></ToolboxButton>
    <ToolboxButton
      v-if="!IS_MOBILE"
      icon="mdi-monitor"
      hint="share screen"
      :active="screenActive"
      @click="togglePubScreen"
    ></ToolboxButton>
    <ToolboxButton
      v-if="!IS_MOBILE"
      icon="mdi-account-voice"
      hint="noise suppression"
      :active="noiseSuppressionOn"
      @click="toggleNoiseSuppression"
    ></ToolboxButton>
    <ToolboxButton
      v-if="IS_ELECTRON"
      icon="mdi-camera-enhance"
      hint="switch video mode"
      @click="videoModeDialogShow = true"
    ></ToolboxButton>
    <ToolboxButton
      v-if="IS_ELECTRON"
      icon="mdi-radiobox-marked"
      hint="local record"
      :active="isRecording"
      @click="toggleRecord"
    ></ToolboxButton>
    <ToolboxButton
      v-if="!roomInfo.banChat"
      icon="mdi-chat"
      hint="online chat"
      :active="chatPanelShow"
      @click="toggleChatPanel"
    ></ToolboxButton>
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
import { useUIStore } from '@/store/ui';
import { storeToRefs } from 'pinia';
import { useRoomStore } from '@/store/room';
import { alert } from '@/store/alert';
import { reqQuitRoom } from '@/api/room';
import {
  pubMic,
  pubCamera,
  pubScreen,
  unpubMic,
  unpubCamera,
  unpubScreen
} from '@/modules/media';
import { useMediaStore } from '@/store/media';
import MediaManager from '@/media';
import RecordAgent from '@/modules/record-agent';
import { useMediaControlStore } from '@/store/media-control';
import { IS_ELECTRON, IS_MOBILE } from '@/utils/common';
import ELECTRON_API from '@/modules/electron/api';

const UIStore = useUIStore();
const {
  roomMemberPanelShow,
  recordDialogShow,
  chatPanelShow,
  videoModeDialogShow
} = storeToRefs(UIStore);
const {
  localMic,
  localMicMuted,
  localCameraMedia,
  localScreenMedia,
  isRecording
} = storeToRefs(useMediaStore());

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
 * noise suppression
 */
const { noiseSuppressionOn } = storeToRefs(useMediaControlStore());
async function toggleNoiseSuppression() {
  noiseSuppressionOn.value = !noiseSuppressionOn.value;
  /**
   * @FIX Producer.replaceTrack will cause original track ended
   * if mic already pubed, then repub
   */
  if (localMic.value !== '') {
    unpubMic();
    alert('warning', 'republishing microphone, please wait......');
    await pubMic();
  }
}

/**
 * record
 */
function toggleRecord() {
  if (isRecording.value) {
    showDialog('Are you sure to stop recording and save?')
      .then(() => {
        RecordAgent.stopRecord();
        isRecording.value = RecordAgent.isRecording();
      })
      .catch(() => {});
  } else {
    console.log(localMic.value, cameraActive.value, screenActive.value);
    if (localMic.value === '' && !cameraActive.value && !screenActive.value) {
      alert('warning', "you havn't publish any media");
      return;
    }
    recordDialogShow.value = true;
  }
}

/**
 * room member
 */
function toggleRoomMemberPanel() {
  UIStore.toggleRoomMemberPanelShow();
}

/**
 * chat
 */
function toggleChatPanel() {
  UIStore.toggleChatPanelShow();
}

/**
 * invite
 */
const { roomInfo } = storeToRefs(useRoomStore());
async function invite() {
  if (IS_ELECTRON) {
    ELECTRON_API.copyToClipboard(roomInfo.value.roomId);
  } else {
    await navigator.clipboard.writeText(roomInfo.value.roomId);
  }
  alert('success', 'room number copied to clipboard');
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
