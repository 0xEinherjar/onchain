<script setup>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAccountStore } from "../store/account.js";
import { useUserStore } from "../store/user.js";
import { pinProfileToIPFS } from "../infra/pinata.js";
import { Loading } from "../components";
import {
  useAccount,
  useDisconnect,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "@wagmi/vue";
import { abi, contract } from "../contracts/";
import { useProfile } from "../composables/useProfile.js";
import { useErrorStore } from "../store/error.js";
const { disconnect } = useDisconnect();
const errorStore = useErrorStore();
const { address } = useAccount();
const { data, writeContractAsync, error } = useWriteContract();
const isLoading = ref(false);
const avatarURL = ref("");
const bannerURL = ref("");
const form = ref({
  name: "",
  description: "",
  location: "",
  avatar: null,
  banner: null,
});
const router = useRouter();
const accountStore = useAccountStore();
const userStore = useUserStore();

function onFileChange(event) {
  const file = event.target.files[0] || event.dataTransfer.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.readAsDataURL(file);
  if (event.target.name == "avatar") {
    form.value.avatar = file;
    reader.onload = () => (avatarURL.value = reader.result);
  } else {
    form.value.banner = file;
    reader.onload = () => (bannerURL.value = reader.result);
  }
}

function checkForm() {
  if (
    form.value.name.length >= 3 &&
    form.value.name.length <= 50 &&
    form.value.description.length <= 400 &&
    address.value
  )
    return true;
  return false;
}
async function create() {
  if (!checkForm()) return;
  isLoading.value = true;
  try {
    const metadata = await pinProfileToIPFS({
      avatar: form.value.avatar,
      banner: form.value.banner,
      location: form.value.location,
      name: form.value.name,
      description: form.value.description,
      createdAt: new Date().toISOString(),
    });
    if (metadata.success == false) {
      isLoading.value = false;
      return;
    }
    await writeContractAsync({
      abi: abi.Onchain,
      address: contract.Onchain,
      functionName: "createProfile",
      args: [metadata.data],
    });
  } catch (error) {}
  isLoading.value = false;
}

function restore() {
  avatarURL.value = "";
  bannerURL.value = "";
  form.value = {
    name: "",
    description: "",
    location: "",
    avatar: null,
    banner: null,
  };
}

const changeFormCounter = computed(() => {
  let counter = 0;
  if (form.value.name.length) counter += 1;
  if (form.value.avatar) counter += 1;
  if (form.value.banner) counter += 1;
  if (form.value.description.length) counter += 1;
  if (form.value.location.length) counter += 1;
  return counter;
});

const { isSuccess } = useWaitForTransactionReceipt({
  hash: data,
});
const { getProfile } = useProfile();
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) {
    try {
      accountStore.setWallet(address.value);
      accountStore.setConnected();
      accountStore.setHasAccount();
      const profile = await getProfile(address.value);
      if (profile.success) {
        userStore.setUser(profile.data);
        router.push({ path: `/${address.value}` });
      } else {
        disconnect();
        accountStore.resetAccount();
        router.push({ path: `/` });
      }
    } catch (error) {
      disconnect();
      accountStore.resetAccount();
      router.push({ path: `/` });
    }
  }
});
watch(error, (newError) => {
  if (newError) {
    errorStore.setError(newError);
    isLoading.value = false;
    setTimeout(() => {
      disconnect();
      accountStore.resetAccount();
      router.push({ path: `/` });
    }, 5000);
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <form class="setting__section" @submit.prevent="create">
    <div class="setting__section-head">
      <h4>Welcome to Onchain</h4>
      <p class="setting__subtitle u-text-secondary">Create your account to get started</p>
    </div>
    <div class="setting__section-line"></div>
    <div class="setting__form">
      <div class="setting__form-attachment-field u-flex-line">
        <img v-if="avatarURL" :src="avatarURL" class="setting__form-picture">
        <img v-else src="../assets/avatar-default.png" class="setting__form-picture">
        <div class="setting__form-attachment-text">Avatar</div>
        <label class="setting__form-attachment-label u-pointer" for="avatar">Choose Avatar</label>
        <input @change="onFileChange" class="is-hidden" type="file" name="avatar" id="avatar" accept="image/*">
      </div>
      <div class="setting__form-attachment-field u-flex-line">
        <img v-if="bannerURL" :src="bannerURL" class="setting__form-picture">
        <div v-else class="setting__form-picture--placeholder"></div>
        <div class="setting__form-attachment-text">Banner</div>
        <label class="setting__form-attachment-label u-pointer" for="banner">Choose Banner</label>
        <input @change="onFileChange" class="is-hidden" type="file" name="banner" id="banner" accept="image/*">
      </div>
      <div class="setting__form-field">
        <label class="setting__form-label u-text-secondary">Name</label>
        <input class="setting__form-input" type="text" v-model="form.name" placeholder="Enter your name">
      </div>
      <div class="setting__form-field">
        <label class="setting__form-label u-text-secondary">Description</label>
        <input class="setting__form-input" type="text" v-model="form.description" placeholder="Brief description for your profile">
      </div>
      <div class="setting__form-field">
        <label class="setting__form-label u-text-secondary">Location</label>
        <input class="setting__form-input" type="text" v-model="form.location" placeholder="Where in the world are you?">
      </div>
      <div class="setting__section-line"></div>
      <div class="u-flex-line-between">
        <div>
          <button v-show="changeFormCounter" @click="restore" type="button" class="setting__form-restore u-flex-line">
            <div class="setting__form-restore-box u-flex-line-center">
              <svg class="u-text-danger" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.0699 5.23C19.4599 5.07 17.8499 4.95 16.2299 4.86V4.85L16.0099 3.55C15.8599 2.63 15.6399 1.25 13.2999 1.25H10.6799C8.34991 1.25 8.12991 2.57 7.96991 3.54L7.75991 4.82C6.82991 4.88 5.89991 4.94 4.96991 5.03L2.92991 5.23C2.50991 5.27 2.20991 5.64 2.24991 6.05C2.28991 6.46 2.64991 6.76 3.06991 6.72L5.10991 6.52C10.3499 6 15.6299 6.2 20.9299 6.73C20.9599 6.73 20.9799 6.73 21.0099 6.73C21.3899 6.73 21.7199 6.44 21.7599 6.05C21.7899 5.64 21.4899 5.27 21.0699 5.23Z" fill="currentColor"/>
                <path d="M19.23 8.14C18.99 7.89 18.66 7.75 18.32 7.75H5.67999C5.33999 7.75 4.99999 7.89 4.76999 8.14C4.53999 8.39 4.40999 8.73 4.42999 9.08L5.04999 19.34C5.15999 20.86 5.29999 22.76 8.78999 22.76H15.21C18.7 22.76 18.84 20.87 18.95 19.34L19.57 9.09C19.59 8.73 19.46 8.39 19.23 8.14Z" fill="currentColor"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.58008 17C9.58008 16.5858 9.91586 16.25 10.3301 16.25H13.6601C14.0743 16.25 14.4101 16.5858 14.4101 17C14.4101 17.4142 14.0743 17.75 13.6601 17.75H10.3301C9.91586 17.75 9.58008 17.4142 9.58008 17Z" fill="#F4F4F4"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.75 13C8.75 12.5858 9.08579 12.25 9.5 12.25H14.5C14.9142 12.25 15.25 12.5858 15.25 13C15.25 13.4142 14.9142 13.75 14.5 13.75H9.5C9.08579 13.75 8.75 13.4142 8.75 13Z" fill="#F4F4F4"/>
              </svg>
            </div>
            <span>Delete {{ changeFormCounter }} modifications</span>
          </button>
        </div>
        <button class="c-button c-button--small c-button--success u-flex-line" :disabled="!checkForm()" type="submit">
          <loading v-if="isLoading" type="small" />
          <template v-else>Create</template>
        </button>
      </div>
    </div>
  </form>
</template>
<style scoped>
.setting__section {
  width: 100%;
}
</style>
