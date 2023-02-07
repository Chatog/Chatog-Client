<template>
  <div class="record-hint">
    <v-icon class="mr-1" icon="mdi-record" size="20" color="red"></v-icon>
    <div class="mr-1">Recording</div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.record-hint {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 4px;
  background-color: rgb(30, 30, 30);
  padding: 4px;
  color: #fff;
}
.record-hint div {
  font-size: 14px;
}
</style>
