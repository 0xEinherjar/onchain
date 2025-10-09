<script setup>
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../contracts/";
import { watch } from "vue";
import { useErrorStore } from "../store/error";
const props = defineProps(["id"]);
const emit = defineEmits(["reactivate"]);
const { writeContractAsync, data, error } = useWriteContract();
const errorStore = useErrorStore();

async function restoreProfile() {
  await writeContractAsync({
    abi: abi.Onchain,
    address: contract.Onchain,
    functionName: "restoreProfile",
    args: [props.id],
  });
}
const { isSuccess } = useWaitForTransactionReceipt({
  hash: data,
});
watch(error, (newError) => {
  if (newError) {
    errorStore.setError(newError);
  }
});
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) {
    emit("reactivate");
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <button class="c-button c-button--small c-button--success u-flex-line" @click="restoreProfile">
    Reactivate
  </button>
</template>
