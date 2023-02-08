<template>
  <div class="media-stats-item">
    <div class="media-stats-item__label">{{ label }}:</div>
    <div class="media-stats-item__value">{{ value }}</div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';

const props = defineProps<{
  label: string;
  value: string;
}>();
const { label, value } = toRefs(props);
</script>

<style>
.media-stats-item {
  display: flex;
  flex-direction: row;
  font-size: 14px;
  line-height: 18px;
  font-weight: 300;
  margin-left: 8px;
}
.media-stats-item__label {
  width: 92px;
}
.media-stats-item__value {
  width: 100px;
}
</style>
