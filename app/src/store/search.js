import { defineStore } from "pinia";
import { ref } from "vue";

export const useSearchStore = defineStore("search", () => {
  const openSearch = ref(false);

  function open() {
    openSearch.value = true;
  }
  function close() {
    openSearch.value = false;
  }

  return { openSearch, open, close };
});
