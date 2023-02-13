<template>
  <!-- replace system toolbar in electron -->
  <v-toolbar v-if="IS_ELECTRON" class="enable-move" height="40">
    <v-spacer></v-spacer>
    <v-btn icon="mdi-close" :size="32" @click="closeWindow"> </v-btn>
  </v-toolbar>
  <v-main>
    <router-view />
  </v-main>
</template>

<script setup lang="ts">
import { IS_ELECTRON } from '@/utils/common';
import ELECTRON_API from '@/modules/electron/api';

function closeWindow() {
  ELECTRON_API.closeWindow();
}
</script>
