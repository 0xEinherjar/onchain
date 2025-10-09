<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { useUserStore } from "../../store/user.js";
import { Loading } from "../";
import { useReadOnchainContract } from "../../composables/useReadOnchainContract.js";
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../../contracts/";
import { useErrorStore } from "../../store/error.js";
const errorStore = useErrorStore();
const { writeContractAsync, data, error } = useWriteContract();
const { readOnchainContract } = useReadOnchainContract();
const { userHandle } = defineProps(["userHandle"]);
const userStore = useUserStore();
const handle = ref("");
const handleNote = ref("username");
const isAvailable = ref(false);
const isLoading = ref(false);
const isCorrect = ref(null);

async function isHandleAvailable() {
  if (handle.value.length == 0) {
    isCorrect.value = null;
    return;
  }
  if (handle.value.length <= 3) {
    if (userHandle.length > 0) {
      handleNote.value = userHandle;
    } else {
      handleNote.value = "username";
    }
    isAvailable.value = false;
    isCorrect.value = false;
    return;
  }
  handleNote.value = handle.value;
  try {
    const result = await readOnchainContract("ownerOfHandle", [handle.value]);
    if (String(result) == "0x0000000000000000000000000000000000000000") {
      isAvailable.value = true;
    } else {
      isAvailable.value = false;
    }
    isCorrect.value = true;
  } catch (error) {
    isCorrect.value = false;
  }
}

async function updateHandle() {
  isLoading.value = true;
  await writeContractAsync({
    abi: abi.Onchain,
    address: contract.Onchain,
    functionName: "updateHandle",
    args: [handle.value],
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
    userStore.updateHandle(handle.value);
    isLoading.value = false;
  }
});

onBeforeMount(() => {
  if (userHandle.length > 0) {
    handle.value = userHandle;
    handleNote.value = userHandle;
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <section class="setting__section" id="handle">
    <div class="setting__section-head">
      <h4>Choose Your Username</h4>
      <p class="setting__subtitle u-text-secondary">This will be your unique identifier on Onchain</p>
    </div>
    <div class="setting__section-line"></div>
    <div class="setting__form">
      <div class="setting__form-row u-flex-line">
        <div class="setting__form-field">
          <label class="setting__form-label u-text-secondary">Username</label>
          <input class="setting__form-input" :class="{'u-text-danger': isCorrect === false}" @input="isHandleAvailable" v-model="handle" type="text" placeholder="Input your username">
        </div>
        <button class="setting__form-button u-flex-line" :disabled="!isAvailable" @click="updateHandle">
          <loading v-if="isLoading" type="small"/>
          <template v-else>Set Username</template>
        </button>
      </div>
    </div>
  </section>
</template>
