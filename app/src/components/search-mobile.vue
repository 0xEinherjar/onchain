<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { Icon } from "./";
import { useSearchStore } from "../store/search.js";
import { storeToRefs } from "pinia";
const searchStore = useSearchStore();
const { openSearch } = storeToRefs(searchStore);
const props = defineProps(["className"]);
const open = ref(false);
const formSearch = ref("");
const router = useRouter();

function search() {
  if (!formSearch.value) return;
  router.push({ path: `/${formSearch.value.toLowerCase()}` });
  formSearch.value = "";
  open.value = false;
  searchStore.close();
}

function close() {
  open.value = false;
  searchStore.close();
}
</script>
<!-- prettier-ignore -->
<template>
<Teleport to="body">
  <div v-if="open || openSearch" class="c-search-mobile">
    <div class="c-search-mobile__header u-flex-line">
      <form @submit.prevent="search" class="search u-flex-line">
        <button class="search__button u-flex-line">
          <icon iconClass="c-icon" name="search"/>
        </button>
        <input class="search__input" type="text" v-model="formSearch" placeholder="Search">
      </form>
      <button @click="close" type="button"><icon iconClass="c-icon" name="close"/></button>
    </div>
  </div>
</Teleport>
<div :class="props.className" @click="open = true">
  <slot></slot>
</div>
</template>
<style>
.c-search-mobile {
  position: fixed;
  inset: 0 0 0 0;
  background-color: var(--bg-color-primary);
  z-index: 101;
}
.c-search-mobile__header {
  gap: 16px;
  padding: 16px;
}
.c-search-mobile__header .search {
  flex-grow: 1;
}
</style>
