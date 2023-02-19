<template>
  <div class="room-member-panel">
    <div class="room-member-panel__title">
      <div>Total: {{ roomMembers.length }}</div>
      <v-icon
        icon="mdi-close"
        color="#fff"
        @click="
          () => {
            roomMemberPanelShow = false;
          }
        "
      ></v-icon>
    </div>
    <v-divider color="#FFF" class="my-2" thickness="2"></v-divider>
    <div class="room-member-panel__list mb-4">
      <RoomMemberItem
        v-for="roomMember of roomMembers"
        :key="'room-member-' + roomMember.memberId"
        :roomMember="roomMember"
      ></RoomMemberItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoomStore } from '@/store/room';
import { useUIStore } from '@/store/ui';
import { storeToRefs } from 'pinia';
import RoomMemberItem from './room-member-panel/RoomMemberItem.vue';

const roomStore = useRoomStore();
const { roomMembers } = storeToRefs(roomStore);
const { roomMemberPanelShow } = storeToRefs(useUIStore());
</script>

<style scoped>
.room-member-panel {
  width: 300px;
  height: 100%;
  background-color: #141414;

  display: flex;
  flex-direction: column;
  padding: 16px 16px;
}
.room-member-panel__title {
  color: #fff;
  font-weight: 300;
  user-select: none;
  display: flex;
  flex-direction: row;
}
.room-member-panel__title i {
  margin-left: auto;
}
.room-member-panel__list {
  flex: 1;
  overflow: auto;
}
</style>
