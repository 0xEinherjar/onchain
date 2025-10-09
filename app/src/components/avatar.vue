<script setup>
const { length, radius, avatar } = defineProps(["length", "radius", "avatar"]);
</script>
<!-- prettier-ignore -->
<template>
  <img v-if="avatar" class="c-avatar" :src="avatar" :style="{width: length, height: length, 'border-radius': radius || length}" alt="User avatar">
  <img v-else class="c-avatar--placeholder" :style="{width: length, height: length, 'border-radius': radius || length}" src="../assets/avatar-default.png" alt="User avatar placeholder">
</template>
<style>
.c-avatar {
  flex-shrink: 0;
  object-fit: cover;
}
.c-avatar--placeholder {
  object-fit: cover;
  flex-shrink: 0;
}
</style>
