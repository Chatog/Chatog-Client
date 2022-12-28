<template>
  <v-toolbar v-if="IS_ELECTRON" class="enable-move" height="40">
    <v-spacer></v-spacer>
    <v-btn icon="mdi-minus" size="32" class="mr-2" @click="minimize"> </v-btn>
    <v-btn
      :icon="isFullScreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
      size="32"
      @click="toggleFullScreen"
    >
    </v-btn>
  </v-toolbar>
  <v-main class="room__main">
    <!-- room title -->
    <div class="room-title-container" :style="roomTitleContainerTop">
      <v-slide-y-transition>
        <RoomTitle
          v-if="roomTitleShow"
          :roomName="roomInfo.roomName"
          :roomStartTime="roomInfo.roomStartTime"
        ></RoomTitle
      ></v-slide-y-transition>
    </div>
    <!-- room toolbox -->
    <div class="room-toolbox-container">
      <v-slide-y-reverse-transition>
        <RoomToolbox v-if="roomToolboxShow"></RoomToolbox>
      </v-slide-y-reverse-transition>
    </div>
  </v-main>
</template>

<script setup lang="ts">
import { IS_ELECTRON } from '@/utils/common';
import { ref, reactive, onMounted, computed } from 'vue';
import RoomTitle from '@/components/RoomTitle.vue';
import { RoomInfo, reqGetRoomInfo } from '@/api/room';
import RoomToolbox from '@/components/RoomToolbox.vue';
import { useIdle } from '@vueuse/core';

const props = defineProps<{
  roomId: string;
}>();

let roomInfo: RoomInfo = reactive({
  roomId: '',
  roomName: '',
  roomStartTime: 0
});
onMounted(async () => {
  const res = await reqGetRoomInfo({ roomId: props.roomId });
  roomInfo.roomName = res.data.roomName;
  roomInfo.roomStartTime = res.data.roomStartTime;
});

/**
 * toolbar
 */
function minimize() {
  window.ELECTRON_API?.minimizeWindow();
}

const isFullScreen = ref(false);
function toggleFullScreen() {
  const target = !isFullScreen.value;
  window.ELECTRON_API?.setFullScreen(target);
  isFullScreen.value = target;
}

/**
 * room title
 */
const roomTitleContainerTop = {
  top: IS_ELECTRON ? `${16 + 40}px` : '16px'
};

/**
 * room title and room toolbox auto hide
 */
// hide when idle for 4s
const { idle } = useIdle(4 * 1000);
const roomTitleShow = computed(() => roomInfo.roomStartTime && !idle.value);
// @ATTENTION: toolbox should also hide when fetching room info
const roomToolboxShow = computed(() => roomInfo.roomStartTime && !idle.value);
</script>

<style scoped>
.room__main {
  background-color: rgb(4, 4, 4);
}
.room-title-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.room-toolbox-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 32px;
}
</style>
