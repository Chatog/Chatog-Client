<template>
  <div>
    <div>Join Room</div>
    <v-btn>Confirm</v-btn>
    <v-btn @click="$router.push({ path: '/home' })">Cancel</v-btn>
  </div>
</template>

<script setup lang="ts"></script>
