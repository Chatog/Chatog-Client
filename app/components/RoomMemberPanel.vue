<template>
  <div class="room-member-panel">
    <div class="room-member-panel__title">Total: {{ roomMembers.length }}</div>
    <v-divider color="#FFF" class="my-2" thickness="2"></v-divider>
    <div class="room-member-panel__list mb-4">
      <RoomMemberItem
        v-for="roomMember of roomMembers"
        :key="'room-member-' + roomMember.memberId"
        :roomMember="roomMember"
      ></RoomMemberItem>
    </div>
    <div class="room-member-panel__actions">
      <v-text-field
        placeholder="search member"
        density="compact"
        :hideDetails="true"
        bgColor="#fff"
        appendInnerIcon="mdi-account-search"
        :loading="isSearching"
        @click:appendInner.stop="searchMember"
      ></v-text-field>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoomStore } from '@/store/room';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import RoomMemberItem from './room-member-panel/RoomMemberItem.vue';

const { roomMembers } = storeToRefs(useRoomStore());

const isSearching = ref(false);
function searchMember() {
  isSearching.value = true;
  setTimeout(() => {
    isSearching.value = false;
  }, 1500);
}
</script>

<style scoped>
.room-member-panel {
  width: 300px;
  height: 100%;
  background-color: #141414;

  display: flex;
  flex-direction: column;
  padding: 16px 24px;
}
.room-member-panel__title {
  color: #fff;
  font-weight: 300;
  user-select: none;
}
.room-member-panel__list {
  flex: 1;
  overflow: auto;
}
</style>
