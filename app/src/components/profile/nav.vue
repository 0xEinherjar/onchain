<script setup>
import { watch } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const props = defineProps(["links", "address"]);
const emit = defineEmits(["profile-nav"]);

function profileNav(router) {
  document.querySelectorAll(".profile__nav-item").forEach((item) => {
    item.classList.remove("is-active");
  });
  router.target.classList.add("is-active");
  emit("profile-nav", router.target.dataset.nav);
}

watch(
  () => route.params.profile,
  async (_) => {
    document.querySelectorAll(".profile__nav-item").forEach((item) => {
      item.classList.remove("is-active");
      if (item.dataset.nav === "Publications") item.classList.add("is-active");
    });
    emit("profile-nav", "Publications");
  }
);
</script>
<!-- prettier-ignore -->
<template>
  <nav class="profile__nav u-flex-line-between">
    <button type="button" class="profile__nav-item is-active" data-nav="Publications" @click="profileNav">Publications</button>
    <button type="button" class="profile__nav-item" data-nav="Followers" @click="profileNav">Followers</button>
    <button type="button" class="profile__nav-item" data-nav="Following" @click="profileNav">Following</button>
    <button type="button" class="profile__nav-item" data-nav="About" @click="profileNav">About</button>
  </nav>
</template>
<style>
.profile__nav {
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding-inline: 48px;
  /* padding-inline: 24px; */
  height: 48px;
  border-radius: 48px;
}
.profile__nav-item {
  color: var(--text-color-secondary);
  line-height: 19px;
  cursor: pointer;
  font-size: var(--step--2);
}
.profile__nav-item.is-active {
  color: var(--text-color-primary);
}
@media (width < 600px) {
  .profile__nav {
    overflow-x: auto;
    padding: 10px 0px;
    border: none;
  }
}
</style>
