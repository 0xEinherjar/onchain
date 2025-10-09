<script setup>
import { ref, watch } from "vue";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "@wagmi/vue";
import { ButtonReactivate, Loading } from "../components";
import { abi, contract } from "../contracts/";
const { writeContractAsync, data } = useWriteContract();
const isLoading = ref(false);
const reactivateProfileId = ref(null);
const { address } = useAccount();

async function reactivateProfile() {
  if (!reactivateProfileId || !address.value) return;
  isLoading.value = true;
  await writeContractAsync({
    abi: abi.ProfileNFT,
    address: contract.ProfileNFT,
    functionName: "approve",
    args: [contract.Onchain, reactivateProfileId.value],
  });
}
const { isSuccess } = useWaitForTransactionReceipt({
  hash: data,
});
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) {
    isLoading.value = false;
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <div class="connect">
    <form class="setting__section" @submit.prevent="reactivateProfile">
      <div class="setting__section-head">
        <h4>Welcome back to Onchain</h4>
        <p class="setting__subtitle u-text-secondary">Reactivate your profile and pick up right where you left off.</p>
      </div>
      <div class="setting__section-line"></div>
      <div class="setting__form">
        <div class="setting__form-field">
          <label class="setting__form-label u-text-secondary">Profile id</label>
          <input class="setting__form-input" type="text" v-model="reactivateProfileId" placeholder="Enter with your profile id">
        </div>
        <div class="setting__section-line"></div>
        <div class="u-flex-line-between">
          <div>
          </div>
          <button v-if="!isSuccess" class="c-button c-button--small c-button--success u-flex-line" :disabled="!reactivateProfileId" type="submit">
            <loading v-if="isLoading" type="small" />
            <template v-else>Approve</template>
          </button>
          <button-reactivate v-else :id="reactivateProfileId"/>
        </div>
      </div>
    </form>
  </div>
</template>

<style></style>
