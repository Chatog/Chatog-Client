<template>
  <div>
    <div>LOGO</div>
    <v-btn @click="$router.push('/home/create-room')">Create Room</v-btn>
    <v-btn @click="$router.push('/home/join-room')">Join Room</v-btn>

    <!-- view records: not supported in web -->
    <div
      v-if="IS_ELECTRON"
      class="clickable"
      style="text-decoration: underline"
      @click="viewRecords"
    >
      view records
    </div>
  </div>
</template>

<script setup lang="ts">
import { IS_ELECTRON } from '@/utils/common';
import { recordsSavePath } from '@/utils/storage';

function viewRecords() {
  window.ELECTRON_API?.openPath(recordsSavePath());
}
</script>
