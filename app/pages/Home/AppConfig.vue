<template>
  <div class="app-config">
    <h1>App Config</h1>
    <v-divider></v-divider>
    <v-text-field readonly variant="outlined" v-model="rsp">
      <template v-slot:append-inner>
        <v-btn icon="mdi-folder" @click="selectRSP"></v-btn>
      </template>
    </v-text-field>
    <v-btn @click="confirm">Confirm</v-btn>
    <v-btn @click="$router.push({ path: '/home' })">Cancel</v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { recordsSavePath } from '@/utils/storage';

const rsp = ref(recordsSavePath());

async function selectRSP() {
  const newRSP = await window.ELECTRON_API?.selectPath();
  rsp.value = newRSP!;
}

function confirm() {
  recordsSavePath(rsp.value);
}
</script>
