<script setup>
import { onBeforeMount } from "vue";
import { storeToRefs } from "pinia";
import { useErrorStore } from "./store/error.js";
import { useAccountStore } from "./store/account.js";
const errorStore = useErrorStore();
const { error } = storeToRefs(errorStore);
const { account } = storeToRefs(useAccountStore());
import { Toast } from "./components";
onBeforeMount(() => {
  if (account.value.isConnected) {
    document.querySelector("html").classList.add("is-connected");
  }
})
</script>
<!-- prettier-ignore -->
<template>
  <toast v-if="error"/>
  <router-view></router-view>
</template>
<style></style>
