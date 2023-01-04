<template>
  <div class="room-member-item">
    <v-avatar class="mr-4" color="#fff" :size="32">{{
      roomMember.nickname.substring(0, 1)
    }}</v-avatar>
    <div class="room-member-item__name">{{ roomMember.nickname }}</div>
    <v-spacer></v-spacer>
    <div class="room-member-item__actions">
      <v-icon v-show="isShow.mic" class="mr-3" color="#fff" :size="22"
        >mdi-microphone</v-icon
      >
      <v-icon v-show="isShow.camera" class="mr-3" color="#fff" :size="22"
        >mdi-camera</v-icon
      >
      <v-icon v-show="isShow.screen" class="mr-4" color="#fff" :size="20"
        >mdi-monitor</v-icon
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { RoomMemberVO } from '@/api/room';
import { storeToRefs } from 'pinia';
import { toRefs, reactive, computed } from 'vue';
import { useRoomStore } from '@/store/room';

const props = defineProps<{
  roomMember: RoomMemberVO;
}>();

const { roomMember } = toRefs(props);
const isShow = reactive({
  mic: false,
  camera: false,
  screen: false
});

const { myMemberId } = storeToRefs(useRoomStore());
const isSelf = computed(() => {
  myMemberId?.value &&
    roomMember?.value?.memberId &&
    myMemberId.value === roomMember.value.memberId;
});
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
