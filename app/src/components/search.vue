<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { Icon } from "./";
import { useSearchStore } from "../store/search.js";
const searchStore = useSearchStore();
const router = useRouter();
const formSearch = ref("");

function search() {
  if (!formSearch.value) return;
  router.push({ path: `/${formSearch.value.toLowerCase()}` });
  formSearch.value = "";
}
</script>
<!-- prettier-ignore -->
<template>
  <form class="search u-flex-line hidden-tab-land" @submit.prevent="search">
    <button class="search__button u-flex-line">
      <icon iconClass="c-icon" name="search"/>
    </button>
    <input class="search__input" type="text" v-model="formSearch" placeholder="Search">
  </form>
  <div class="search u-flex-line is-hidden show-tab-land">
    <button @click="searchStore.open()" class="search__button u-flex-line" type="button">
      <icon iconClass="c-icon" name="search"/>
    </button>
  </div>
</template>
<style>
.search {
  gap: 16px;
  height: 48px;
  width: 100%;
  border-radius: 12px;
  background-color: var(--bg-color-secondary);
  padding-inline: 16px;
}
.search__input {
  width: 100%;
  height: 100%;
}
.search__button {
  height: 100%;
}
@media (width < 1200px) {
  .search {
    width: auto;
  }
}
</style>
