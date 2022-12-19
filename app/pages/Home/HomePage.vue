<template>
  <div>
    <div>LOGO</div>
    <v-btn @click="$router.push({ path: '/home/create-room' })"
      >Create Room</v-btn
    >
    <v-btn @click="$router.push({ path: '/home/join-room' })">Join Room</v-btn>
  </div>
</template>
