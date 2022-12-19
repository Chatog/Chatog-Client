<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<style>
/* hide scroll bar */
html,
body {
  overflow: hidden !important;
}

/* support drag to move window */
.enable-move {
  -webkit-app-region: drag;
}
/* button draggable will stop click */
.enable-move button {
  -webkit-app-region: no-drag;
}
</style>
