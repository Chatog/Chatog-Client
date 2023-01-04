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

    <div class="room-member-item__actions" v-show="actionShow">
      <v-icon v-show="isShow.mic" class="ml-1" color="#fff" :size="21"
        >mdi-microphone</v-icon
      >
      <v-icon v-show="isShow.camera" class="ml-1" color="#fff" :size="20"
        >mdi-camera</v-icon
      >
      <v-icon
        style="margin-bottom: 2px"
        class="ml-2"
        v-show="isShow.screen"
        color="#fff"
        :size="19"
        >mdi-monitor</v-icon
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { RoomMember } from '@/api/room';
import { storeToRefs } from 'pinia';
import { toRefs, reactive, computed } from 'vue';
import { useRoomStore } from '@/store/room';

const props = defineProps<{
  roomMember: RoomMember;
}>();

const { roomMember } = toRefs(props);
const isShow = reactive({
  mic: false,
  camera: false,
  screen: false
});

const { myMemberId } = storeToRefs(useRoomStore());
const isSelf = computed(
  () =>
    myMemberId?.value &&
    roomMember?.value?.memberId &&
    myMemberId.value === roomMember.value.memberId
);

// room owner no need to show actions
const actionShow = computed(() => {
  if (roomMember.value.isRoomOwner) {
    return false;
  } else {
    return isShow.mic || isShow.camera || isShow.screen;
  }
});
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
  /* 4 + 21 + 4 + 20 + 8 + 19 */
  min-width: 76px;
}
</style>
