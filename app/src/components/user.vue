<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../contracts/";
import { useUtils } from "../composables/useUtils.js";
import { Avatar, Loading } from "./";
import { useErrorStore } from "../store/error.js";
import { useUserStore } from "../store/user.js";
import { storeToRefs } from "pinia";
const { user } = storeToRefs(useUserStore());
const errorStore = useErrorStore();
const { truncateAddress } = useUtils();
const { writeContractAsync, data, error } = useWriteContract();
const isFollowing = ref(false);
const isLoading = ref(false);
const props = defineProps([
  "avatar",
  "name",
  "handle",
  "owner",
  "hasSubscription",
  "isFollowing",
  "isConnected",
]);
const username = computed(() => {
  return Boolean(props.handle) ? props.handle : props.owner;
});
const isMyProfile = computed(() => {
  return user.value?.owner == props.owner;
});
async function follow(address) {
  isLoading.value = true;
  await writeContractAsync({
    abi: abi.Onchain,
    address: contract.Onchain,
    functionName: "follow",
    args: [address],
  });
}

const { isSuccess } = useWaitForTransactionReceipt({
  hash: data,
});
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) {
    isFollowing.value = !isFollowing.value;
    isLoading.value = false;
  }
});
watch(error, (newError) => {
  if (newError) {
    errorStore.setError(newError);
    isLoading.value = false;
  }
});
onMounted(() => {
  isFollowing.value = props.isFollowing;
});
</script>
<!-- prettier-ignore -->
<template>
  <div class="c-user">
    <router-link :to="`/${username}`">
      <img v-if="props.avatar" class="c-user__avatar" :src="props.avatar" alt="User avatar">
      <img v-else class="c-user__avatar" src="../assets/avatar-default.png" alt="User avatar">
    </router-link>
    <div class="c-user__text">
      <h4 class="c-user__name u-text-ellipsis">{{ props.name }}</h4>
      <span class="c-user__username u-text-ellipsis">{{ username.length == 42 ? truncateAddress(username) : `@${username}` }}</span>
    </div>
    <button v-if="!props.isConnected" class="c-user__action" type="button">Follow</button>
    <template v-else>
      <button v-if="!isMyProfile" class="c-user__action u-flex-line-center" type="button" @click="follow(props.owner)">
        <template v-if="!isLoading">{{ isFollowing ? "Following" : "Follow"}}</template>
        <loading v-else type="small" theme="dark"/>
      </button>
      <button v-else class="c-user__action c-user__action--none" type="button">You</button>
    </template>
  </div>
</template>
<style>
.c-user {
  display: grid;
  gap: 4px;
  justify-items: center;
  width: max-content;
  max-width: 110px;
}
.c-user__avatar {
  height: 104px;
  width: 104px;
  border-radius: 50%;
  object-fit: cover;
}
.c-user__text {
  display: grid;
  gap: 4px;
  justify-items: center;
}
.c-user__name {
  font-size: 15px;
  line-height: 20px;
  font-weight: 500;
}
.c-user__username {
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  color: var(--text-color-secondary);
}
.c-user__name,
.c-user__username {
  display: block;
  width: 100%;
  text-align: center;
}
.c-user__action {
  height: 32px;
  border-radius: 8px;
  padding-inline: 16px;
  font-size: 12px;
  font-weight: 600;
  background-color: var(--text-color-primary);
  color: var(--bg-color-primary);
  margin-top: 12px;
  display: block;
}
.c-user__action--none {
  color: var(--text-color-primary);
  background-color: var(--bg-color-tertiary);
}
@media (width < 600px) {
  .c-user {
    max-width: none;
    gap: 24px;
    width: 100%;
    display: flex;
    align-items: center;
  }
  .c-user__text {
    gap: 0;
    align-content: flex-start;
    flex-grow: 1;
  }
  .c-user__name,
  .c-user__username {
    text-align: left;
  }
  .c-user__avatar {
    height: 50px;
    width: 50px;
  }
  .c-user__action {
    margin-top: 0;
  }
}
</style>
