<template>
  <div
    class="room-toolbox-btn clickable"
    @click="$emit('click', $event)"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
    :style="{
      'background-color': backgroundColor
    }"
  >
    <v-tooltip v-show="hint" activator="parent" location="top">{{
      hint
    }}</v-tooltip>
    <v-icon :size="size" :color="iconColor">{{ icon }}</v-icon>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from 'vue';

defineEmits(['click']);

const props = defineProps<{
  // icon and button size
  size?: number;
  // icon name: mdi-camera
  icon: string;
  // button background color
  backgroundColor?: string;
  // icon fill color
  iconColor?: string;
  // hint when hover
  hint?: string;
  // active state (keep hover style)
  active?: boolean;
}>();

const size = ref(props.size || 24);
const iconColor = ref(props.iconColor || '#FFF');
const hint = ref(props.hint || '');
const active = toRef(props, 'active');

const defaultBackgroundColor = props.backgroundColor || 'transparent';
const hoverBackgroundColor = 'rgb(82,82,82)';
const isHover = ref(false);
const backgroundColor = computed(() => {
  return active.value
    ? hoverBackgroundColor
    : isHover.value
    ? hoverBackgroundColor
    : defaultBackgroundColor;
});
</script>

<style>
.room-toolbox-btn {
  border-radius: 4px;
  padding: 12px;
}
</style>
