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
    <div class="room-title-container" :style="roomTitleContainerTop">
      <v-slide-y-transition>
        <RoomTitle
          v-if="roomInfo.roomStartTime !== 0"
          :roomName="roomInfo.roomName"
          :roomStartTime="roomInfo.roomStartTime"
        ></RoomTitle
      ></v-slide-y-transition>
    </div>
  </v-main>
</template>

<script setup lang="ts">
import { IS_ELECTRON } from '@/utils/common';
import { ref, reactive, onMounted } from 'vue';
import RoomTitle from '@/component/RoomTitle.vue';
import { RoomInfo, reqGetRoomInfo } from '@/api/room';

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
</style>
