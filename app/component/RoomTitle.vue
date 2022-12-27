<template>
  <div class="room-title">
    <div class="room-title__name">{{ roomName }}</div>
    <v-divider vertical color="#fff"></v-divider>
    <div class="room-title__time">{{ roomLastTime }}</div>
  </div>
</template>

<script setup lang="ts">
import { formatTimeHMS } from '@/utils/time';
import { ref, onMounted, onUnmounted } from 'vue';
const props = defineProps<{
  roomName: string;
  roomStartTime: number;
}>();

const roomLastTime = ref(formatTimeHMS(Date.now() - props.roomStartTime));
let roomLastTimer: any;
onMounted(() => {
  roomLastTimer = setInterval(() => {
    roomLastTime.value = formatTimeHMS(Date.now() - props.roomStartTime);
  }, 1000);
});
onUnmounted(() => {
  if (roomLastTimer) roomLastTimer = null;
});
</script>

<style scoped>
.room-title {
  border-radius: 4px;
  background-color: rgb(20, 20, 20);
  width: fit-content;
  color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 0;
  user-select: none;
}
.room-title__name {
  font-size: 14px;
  padding: 0 12px;
}
.room-title .v-divider {
  margin: 2px 0;
}
.room-title__time {
  font-size: 12px;
  padding: 0 12px;
}
</style>
