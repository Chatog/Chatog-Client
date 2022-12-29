<template>
  <div class="room-member-item">
    <v-avatar class="mr-4" color="#fff" :size="32">{{
      roomMember.nickname.substring(0, 1)
    }}</v-avatar>
    <div class="room-member-item__name">{{ roomMember.nickname }}</div>
    <v-spacer></v-spacer>
    <div class="room-member-item__actions">
      <v-icon class="mr-3" color="#fff" :size="22">mdi-microphone</v-icon>
      <v-icon class="mr-3" color="#fff" :size="22">mdi-camera</v-icon>
      <v-icon class="mr-4" color="#fff" :size="20">mdi-monitor</v-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
const props = defineProps<{
  roomMember: {
    nickname: string;
  };
}>();

const { roomMember } = toRefs(props);
</script>

<style>
.room-member-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 0;
}
.room-member-item__name {
  color: #fff;
}
</style>
