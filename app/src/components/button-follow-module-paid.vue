<script setup>
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../contracts/";
import { ButtonFollow, Loading } from "./";
import { watch, ref, onBeforeMount } from "vue";
import { useErrorStore } from "../store/error";
import { usePaidFollowModule } from "../composables/usePaidFollowModule.js";
const props = defineProps(["isFollowing", "profile"]);
const errorStore = useErrorStore();
const { getModuleInfo } = usePaidFollowModule();
const { writeContractAsync, data, error } = useWriteContract();
const isFollowing = ref(false);
const isLoading = ref(false);
const modulePaidInfo = ref({
  fee: 0,
  feeFormatted: 0,
  symbol: "",
  token: "",
});

async function approve() {
  isLoading.value = true;
  await writeContractAsync({
    abi: abi.Token,
    address: contract.Token,
    functionName: "approve",
    args: [contract.PaidFollowModule, modulePaidInfo.value.fee],
  });
}

const { isSuccess } = useWaitForTransactionReceipt({
  hash: data,
});
watch(error, (newError) => {
  if (newError) {
    errorStore.setError(newError);
    isLoading.value = false;
  }
});
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) {
    isLoading.value = false;
  }
});
onBeforeMount(async () => {
  isFollowing.value = props.isFollowing;
  const result = await getModuleInfo();
  if (result.success) {
    modulePaidInfo.value = result.data;      
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <button v-if="!isSuccess" class="profile__button u-font-500 u-flex-line" @click="approve">
    <loading v-if="isLoading" type="small" theme="dark"/>
    <template v-else>
      <template v-if="isFollowing">Following</template>
      <template v-else>{{ `Follow for ${modulePaidInfo.feeFormatted} ${modulePaidInfo.symbol}` }}</template>
    </template>
  </button>
  <button-follow v-else :isFollowing="props.isFollowing" :profile="props.profile"/>
</template>
