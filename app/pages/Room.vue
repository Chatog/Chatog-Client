<template>
  <v-toolbar v-if="IS_ELECTRON" class="enable-move" height="40">
    <v-spacer></v-spacer>
    <v-btn
      icon="mdi-minus"
      size="32"
      class="mr-2"
      @click="ELECTRON_API.minimizeWindow"
    >
    </v-btn>
    <v-btn
      :icon="isFullScreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
      size="32"
      @click="toggleFullScreen"
    >
    </v-btn>
  </v-toolbar>
  <v-main class="room__main">
    <!-- room title -->
    <div class="room-title-container">
      <v-slide-y-transition>
        <RoomTitle
          v-show="roomTitleShow"
          :roomName="roomInfo.roomName"
          :roomStartTime="roomInfo.roomStartTime"
        ></RoomTitle
      ></v-slide-y-transition>
    </div>
    <!-- room toolbox -->
    <div class="room-toolbox-container">
      <v-slide-y-reverse-transition>
        <RoomToolbox v-show="roomToolboxShow"></RoomToolbox>
      </v-slide-y-reverse-transition>
    </div>
    <!-- room member panel -->
    <div class="room-member-panel-container">
      <v-slide-x-reverse-transition>
        <RoomMemberPabel v-show="roomMemberPanelShow"></RoomMemberPabel>
      </v-slide-x-reverse-transition>
    </div>
    <!-- media panel -->
    <div
      class="media-panel-container"
      :style="{
        left: mediaPanelShow ? '0' : '-184px'
      }"
    >
      <MediaPanel></MediaPanel>
      <div class="media-panel-arrow">
        <v-icon color="#FFF" @click="toggleMediaPanel">{{
          mediaPanelShow ? 'mdi-chevron-left' : 'mdi-chevron-right'
        }}</v-icon>
      </div>
    </div>
  </v-main>
</template>

<script setup lang="ts">
import { IS_ELECTRON } from '@/utils/common';
import { ref, onMounted, computed } from 'vue';
import { reqGetRoomInfo, reqGetRoomMembers } from '@/api/room';
import { useIdle } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { useMediaPanelStore, useRoomMemberPanelStore } from '@/store/ui';
import { useRoomStore } from '@/store/room';
import ELECTRON_API from '@/modules/electron-api';

import RoomTitle from '@/components/RoomTitle.vue';
import RoomToolbox from '@/components/RoomToolbox.vue';
import RoomMemberPabel from '@/components/RoomMemberPanel.vue';
import MediaPanel from '@/components/MediaPanel.vue';

const props = defineProps<{
  roomId: string;
}>();

const roomStore = useRoomStore();
const { roomInfo } = storeToRefs(roomStore);
// fetch room info
onMounted(async () => {
  const res = await reqGetRoomInfo(props.roomId);
  roomInfo.value = res.data;
});
// fetch room members
onMounted(async () => {
  const res = await reqGetRoomMembers(props.roomId);
  roomStore.updateRoomMembers(res.data);
});

/**
 * toolbar
 */
const isFullScreen = ref(false);
function toggleFullScreen() {
  const nextVal = !isFullScreen.value;
  ELECTRON_API.fullscreenWindow(nextVal);
  isFullScreen.value = nextVal;
}

/**
 * room title and room toolbox auto hide
 */
// hide when idle for 4s
const { idle } = useIdle(4 * 1000);
const roomTitleShow = computed(
  () => roomInfo.value.roomStartTime && !idle.value
);
// @ATTENTION: toolbox should also hide when fetching room info
const roomToolboxShow = computed(
  () => roomInfo.value.roomStartTime && !idle.value
);

/**
 * room member panel
 */
const { roomMemberPanelShow } = storeToRefs(useRoomMemberPanelStore());

/**
 * media panel
 */
const { mediaPanelShow } = storeToRefs(useMediaPanelStore());
function toggleMediaPanel() {
  mediaPanelShow.value = !mediaPanelShow.value;
}
</script>

<style scoped>
.room__main {
  background-color: rgb(4, 4, 4);
  position: relative;
}
.room-title-container {
  position: absolute;
  left: 50%;
  top: 16px;
  transform: translateX(-50%);
}
.room-toolbox-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 32px;
}
.room-member-panel-container {
  position: absolute;
  right: 0;
  height: 100%;
}
.media-panel-container {
  position: absolute;
  left: 0;
  height: 100%;
  transition: left 0.6s ease-in-out;
}
.media-panel-container > div {
  background-color: #141414;
}
.media-panel-arrow {
  position: absolute;
  top: 16px;
  left: 184px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  padding: 4px 0;
}
.media-panel-arrow:hover {
  cursor: pointer;
}
</style>
