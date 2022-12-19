<template>
  <!-- replace system toolbar in electron -->
  <v-toolbar v-if="isElectron()" class="enable-move" color="transparent">
    <v-btn icon="mdi-cog" @click="$router.push({ path: '/home/app-config' })">
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn icon="mdi-close" @click="closeApp"> </v-btn>
  </v-toolbar>
  <v-main>
    <router-view />
  </v-main>
</template>

<script setup lang="ts">
import { isElectron } from '@/utils/common';

function closeApp() {
  window.ELECTRON_API?.closeWindow();
}
</script>
