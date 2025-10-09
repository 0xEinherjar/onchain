<script setup>
import { ref, watch } from "vue";
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { Loading, Icon } from "../";
import ButtonReactivate from "./button-reactivate.vue";
import { abi, contract } from "../../contracts/";
import { useErrorStore } from "../../store/error.js";
const errorStore = useErrorStore();
const { writeContractAsync, data, error } = useWriteContract();
const postId = ref("");
const isLoading = ref(false);
const open = ref(false);

async function reactivate() {
  if (!Number(postId.value)) return;
  isLoading.value = true;
  await writeContractAsync({
    abi: abi.PostNFT,
    address: contract.PostNFT,
    functionName: "approve",
    args: [contract.Onchain, postId.value],
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
</script>
<!-- prettier-ignore -->
<template>
  <teleport to="body">
    <div v-if="open" class="c-modal--backdrop u-flex-line-center">
      <div class="c-modal">
        <div class="c-modal__content">
          <div class="u-flex-line-between">
            <h3>Import a Post</h3>
            <Icon @click="open = false" iconClass="c-icon u-pointer" name="close"/>
          </div>
          <div class="c-form__field">
            <label for="follow" class="c-form__label">Publication Id</label>
            <input v-model="postId" type="text" class="c-form__input" placeholder="Enter the PostNFT ID">
          </div>
        </div>
        <div class="c-modal__footer">
          <button v-if="!isSuccess" :disabled="!postId" @click="reactivate" class="c-button c-button--extra-large c-button--success u-fluid u-flex-line-center" type="button">
            <loading v-if="isLoading" type="small"/>
            <template v-else>Approve</template>
          </button>
          <button-reactivate v-else :id="postId"/>
        </div>
      </div>
    </div> 
  </teleport>
  <section class="setting__section" id="import">
    <div class="setting__section-head">
      <h4>Import a Post</h4>
      <p class="setting__subtitle u-text-secondary">Select a previously created post to re-import and make it visible again on the platform.</p>
    </div>
    <div class="setting__section-line"></div>
    <div class="setting__form u-flex-line-between">
      <p>Make a past post visible on your profile</p>
      <button @click="open = true" type="button">Import Post</button>
    </div>
  </section>
</template>
<style scoped>
.c-form__input {
  background-color: #202124;
  border-radius: 12px;
  border: none;
  padding-inline: 16px;
}
.setting__form {
  font-size: var(--step--2);
}
.setting__form button {
  color: #3575AE;
}
</style>
