<template>
  <div class="room-member-item">
    <v-avatar class="mr-2" color="#fff" :size="32">{{
      roomMember.nickname.substring(0, 1)
    }}</v-avatar>
    <div class="room-member-item__name text-overflow mr-2">
      {{ roomMember.nickname }}
    </div>
    <!-- tag: self and room owner -->
    <div class="chatog-tag" v-show="isSelf">Me</div>
    <div class="chatog-tag" v-show="roomMember.isRoomOwner">Owner</div>

    <div class="room-member-item__actions" v-show="showMediaControlActions">
      <v-icon
        class="ban-mic-btn"
        color="#fff"
        :size="20"
        @click="() => toggleBanMedia(roomMember.banAudio, MediaType.MIC)"
        >{{
          roomMember.banAudio ? 'mdi-microphone-off' : 'mdi-microphone'
        }}</v-icon
      >
      <v-icon
        class="ban-camera-btn"
        color="#fff"
        :size="20"
        @click="() => toggleBanMedia(roomMember.banVideo, MediaType.CAMERA)"
        >{{ roomMember.banVideo ? 'mdi-camera-off' : 'mdi-camera' }}</v-icon
      >
      <v-icon
        class="ban-screen-btn"
        color="#fff"
        :size="18"
        @click="() => toggleBanMedia(roomMember.banScreen, MediaType.SCREEN)"
        >{{ roomMember.banScreen ? 'mdi-monitor-off' : 'mdi-monitor' }}</v-icon
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { RoomMemberVO } from '@/api/room';
import { toRefs, computed } from 'vue';
import { selfMemberId, useRoomStore } from '@/store/room';
import { storeToRefs } from 'pinia';
import { MediaType } from '@/modules/media';
import { reqAllowMedia, reqBanMedia } from '@/api/media';
import { alert } from '@/store/alert';

const props = defineProps<{
  roomMember: RoomMemberVO;
}>();

const { roomMember } = toRefs(props);
const { roomInfo } = storeToRefs(useRoomStore());

const isSelf = computed(() => selfMemberId() === roomMember.value.memberId);
const showMediaControlActions = computed(
  () => selfMemberId() === roomInfo.value.roomOwnerId && !isSelf.value
);

// avoid quick clicks
let working = false;
function toggleBanMedia(banNow: boolean, type: MediaType) {
  if (working) return;
  if (banNow) {
    working = true;
    reqAllowMedia(roomMember.value.memberId, type)
      .then(() => {
        alert('success', `${type} allowed`);
      })
      .finally(() => (working = false));
  } else {
    reqBanMedia(roomMember.value.memberId, type)
      .then(() => {
        alert('success', `${type} baned`);
      })
      .finally(() => (working = false));
  }
}
</script>

<style>
/* width = 300 - 16 * 2 = 268 */
.room-member-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 0;
  position: relative;
}
.room-member-item__name {
  color: #fff;
}
.room-member-item__actions {
  margin-left: auto;
  /* 4 + 20 + 4 + 20 + 8 + 18 */
  min-width: 74px;
}
.ban-mic-btn {
  margin-left: 4px;
  margin-bottom: 1px;
}
.ban-camera-btn {
  margin-left: 4px;
}
.ban-screen-btn {
  margin-left: 8px;
  margin-bottom: 1px;
}
</style>
