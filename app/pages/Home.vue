<template>
  <!-- replace system toolbar in electron -->
  <v-toolbar v-if="IS_ELECTRON" class="enable-move" height="40">
    <v-btn icon="mdi-cog" :size="32" @click="$router.push('/home/app-config')">
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn icon="mdi-close" :size="32" @click="closeApp"> </v-btn>
  </v-toolbar>
  <v-main>
    <router-view />
  </v-main>
</template>

<script setup lang="ts">
import { IS_ELECTRON } from '@/utils/common';

function closeApp() {
  window.ELECTRON_API?.closeWindow();
}
</script>
