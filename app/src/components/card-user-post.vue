<script setup>
import { Avatar } from "./index.js";
import { useUtils } from "../composables/useUtils.js";
const { hashtagDecorator, makerLink } = useUtils();
const props = defineProps(["avatar", "name", "handle", "description", "owner"]);
</script>
<!-- prettier-ignore -->
<template>
  <div class="l-page-post__user">
    <router-link class="l-page-post__user-header u-flex-line" :to="`/${props.owner}`">
      <avatar length="40px" :avatar="props.avatar"/>
      <div>
        <div class="l-page-post__user-name u-font-500 u-text-ellipsis">{{props.name}}</div>
        <div class="l-page-post__user-username u-text-secondary u-font-500">{{props.handle}}</div>
      </div>
      <button class="l-page-post__user-button u-font-500" type="button">View</button>
    </router-link>
    <p v-html="makerLink(hashtagDecorator(props.description))"></p>
  </div>
</template>
<style>
.l-page-post__user {
  background-color: var(--bg-color-secondary);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: grid;
  gap: 16px;
  padding: 24px;
  width: 100%;
}
.l-page-post__user-header {
  gap: 16px;
}
.l-page-post__user-header > div {
  flex-grow: 1;
}
.l-page-post__user-name {
  line-height: 19px;
  max-width: 180px;
}
.l-page-post__user-username {
  font-size: 14px;
  line-height: 17px;
}
.l-page-post__user-button {
  height: 40px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding-inline: 16px;
}
@media (width < 900px) {
  .l-page-post__user {
    display: none !important;
  }
}
</style>
