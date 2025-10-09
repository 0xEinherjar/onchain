<script setup>
import { useUserStore } from "../../store/user.js";
import { useAccountStore } from "../../store/account.js";
import { useRouter } from "vue-router";
import { Loading } from "../";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  useDisconnect,
} from "@wagmi/vue";
import { abi, contract } from "../../contracts/";
import { ref, watch } from "vue";
import { useErrorStore } from "../../store/error.js";
const errorStore = useErrorStore();
const { writeContractAsync, data, error } = useWriteContract();
const { disconnect } = useDisconnect();
const router = useRouter();
const { resetAccount } = useAccountStore();
const { removeUser } = useUserStore();
const isLoading = ref(false);

async function redeem() {
  isLoading.value = true;
  await writeContractAsync({
    abi: abi.Onchain,
    address: contract.Onchain,
    functionName: "disableProfile",
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
    resetAccount();
    removeUser();
    disconnect();
    router.push({ path: "/" });
  }
  isLoading.value = false;
});
</script>
<!-- prettier-ignore -->
<template> 
  <section class="setting__section" id="redeem">
    <div class="setting__section-head">
      <h4>Redeem Your Profile</h4>
      <p class="setting__subtitle u-text-secondary">This action disconnects your profile from the platform. You'll retain ownership and can re-import it later.</p>
    </div>
    <div class="setting__section-line"></div>
    <div class="setting__form u-flex-line-between">
      <p>Transfer your profile NFT fully to your wallet</p>
      <button type="button" @click="redeem">
        <Loading v-if="isLoading" type="small"/>
        <template v-else>Redeem Profile</template>
      </button>
    </div>
  </section>
</template>
<style scoped>
.setting__form button {
  color: #AE3535;
}
.setting__form {
  font-size: var(--step--2);
}
</style>
