<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "../../store/user.js";
import { pinProfileToIPFS } from "../../infra/pinata.js";
import { Loading } from "../";
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../../contracts/";
import { useProfile } from "../../composables/useProfile.js";
import { useErrorStore } from "../../store/error.js";
const errorStore = useErrorStore();
const { writeContractAsync, data, error } = useWriteContract();
const { getProfile } = useProfile();
const userStore = useUserStore();
const { setUser } = userStore;
const { user } = storeToRefs(userStore);
const showMoreForm = ref(false);
const isLoading = ref(false);
const avatarURL = ref("");
const bannerURL = ref("");
const description = ref("");
const biography = ref("");
const form = ref({
  avatar: null,
  banner: null,
  name: "",
  description: "",
  createdAt: "",
  biography: "",
  location: "",
  links: {
    twitter: "",
    youtube: "",
    twitch: "",
    website: "",
  },
});

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

const setFormValues = (source) => {
  Object.assign(form.value, source, {
    links: { ...source.links },
  });
  description.value = source.description;
  biography.value = source.biography;
};

function restore() {
  setFormValues(user.value);
  avatarURL.value = "";
  bannerURL.value = "";
}

async function update() {
  isLoading.value = true;
  const metadata = await pinProfileToIPFS(
    Object.assign({}, form.value, {
      description: description.value,
      biography: biography.value,
    })
  );
  if (metadata.success) {
    await writeContractAsync({
      abi: abi.Onchain,
      address: contract.Onchain,
      functionName: "updateProfile",
      args: [metadata.data],
    });
  }
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
    const profile = await getProfile(user.value.owner);
    if (profile.success) setUser(profile.data);
    isLoading.value = false;
  }
});

const changeFormCounter = computed(() => {
  let counter = 0;
  if (biography.value != user.value.biography) counter += 1;
  if (description.value != user.value.description) counter += 1;
  if (form.value.name != user.value.name) counter += 1;
  if (form.value.avatar != user.value.avatar) counter += 1;
  if (form.value.banner != user.value.banner) counter += 1;
  if (form.value.createdAt != user.value.createdAt) counter += 1;
  if (form.value.location != user.value.location) counter += 1;
  if (form.value.links.website != user.value.links.website) counter += 1;
  if (form.value.links.twitch != user.value.links.twitch) counter += 1;
  if (form.value.links.twitter != user.value.links.twitter) counter += 1;
  if (form.value.links.youtube != user.value.links.youtube) counter += 1;
  return counter;
});

function showPlaceholder({ target: { id, innerText, parentNode } }) {  
  if (id == "description") {
    description.value = String(innerText).replace(/[\r|\n]/g, "\n");
  } else if (id == "biography") {
    biography.value = String(innerText).replace(/[\r|\n]/g, "\n");
  }
  parentNode
    .querySelector(".setting__textarea-placeholder")
    .classList.toggle("is-hidden", innerText.length > 0);
}

onMounted(() => {
  setFormValues(user.value);
});
</script>
<!-- prettier-ignore -->
<template>
  <div v-if="changeFormCounter > 0" class="setting__form-footer u-flex-line-between">
    <button @click="restore" type="button" class="setting__form-restore u-flex-line">
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
    <button @click="update" class="c-button c-button--small c-button--success u-flex-line" :disabled="changeFormCounter == 0" type="button">
      <loading v-if="isLoading" type="small" />
      <template v-else>Save</template>
    </button>
  </div>
  <section class="setting__section" id="pictures">
    <div class="setting__section-head">
      <h4>Pictures</h4>
      <p class="setting__subtitle u-text-secondary">Personalize your visual identity</p>
    </div>
    <div class="setting__section-line"></div>
    <div class="setting__form">
      <div class="setting__form-attachment-field u-flex-line">
        <img v-if="avatarURL || user.avatar" :src="avatarURL || user.avatar" class="setting__form-picture">
        <div v-else class="setting__form-picture--placeholder"></div>
        <div class="setting__form-attachment-text">Avatar</div>
        <label class="setting__form-attachment-label u-pointer" for="avatar">Choose Avatar</label>
        <input @change="onFileChange" class="is-hidden" type="file" name="avatar" id="avatar" accept="image/png, image/jpeg">
      </div>
      <div class="setting__form-attachment-field u-flex-line">
        <img v-if="bannerURL || user.banner" :src="bannerURL || user.banner" class="setting__form-picture">
        <div v-else class="setting__form-picture--placeholder"></div>
        <div class="setting__form-attachment-text">Banner</div>
        <label class="setting__form-attachment-label u-pointer" for="banner">Choose Banner</label>
        <input @change="onFileChange" class="is-hidden" type="file" name="banner" id="banner" accept="image/png, image/jpeg">
      </div>
    </div>
  </section>
  <section class="setting__section" id="accounts">
    <div class="setting__section-head">
      <h4>Account</h4>
      <p class="setting__subtitle u-text-secondary">Manage your account</p>
    </div>
    <div class="setting__section-line"></div>
    <div class="setting__form">
      <div class="setting__form-field">
        <label class="setting__form-label u-text-secondary">Name</label>
        <input class="setting__form-input" v-model="form.name" type="text" placeholder="What do you want to be called?">
      </div>
      <div class="setting__form-field">
        <label class="setting__form-label u-text-secondary">Description</label>
        <div class="setting__textarea">
          <span class="setting__textarea-placeholder" :class="{ 'is-hidden': form.description.length > 0 }">Brief introduction for your profile</span>
          <div class="setting__textarea-input" @keyup="showPlaceholder" id="description" contenteditable="true">
            {{ form.description }}
          </div>
        </div>
      </div>
      <div class="setting__form-field">
        <label class="setting__form-label u-text-secondary">Biography</label>
        <div class="setting__textarea">
          <span class="setting__textarea-placeholder" :class="{ 'is-hidden': form.biography.length > 0 }">Brief description for your profile</span>
          <div class="setting__textarea-input" @keyup="showPlaceholder" id="biography" contenteditable="true">
            <template v-for="item in String(form.biography).split('\n')">
              <template v-if="item.length > 0">{{ item }}</template>
              <template v-else><br /></template>
            </template>
          </div>
        </div>
      </div>
      <div class="setting__form-field">
        <label class="setting__form-label u-text-secondary">Location</label>
        <input class="setting__form-input" v-model="form.location" type="text" placeholder="Where in the world are you?">
      </div>
      <template v-if="showMoreForm">
        <div class="setting__form-row u-flex-line">
          <div class="setting__form-field">
            <label class="setting__form-label u-text-secondary">Website</label>
            <input class="setting__form-input" v-model="form.links.website" type="text" placeholder="Website">
          </div>
          <div class="setting__form-field">
            <label class="setting__form-label u-text-secondary">Twitter</label>
            <input class="setting__form-input" v-model="form.links.twitter" type="text" placeholder="@username">
          </div>
        </div>
        <div class="setting__form-row u-flex-line">
          <div class="setting__form-field">
            <label class="setting__form-label u-text-secondary">Twitch</label>
            <input class="setting__form-input" v-model="form.links.twitter" type="text" placeholder="@username">
          </div>
          <div class="setting__form-field">
            <label class="setting__form-label u-text-secondary">Youtube</label>
            <input class="setting__form-input" v-model="form.links.youtube" type="text" placeholder="@username">
          </div>
        </div>
      </template>
      <div @click="showMoreForm = !showMoreForm" :class="{ 'is-active': showMoreForm }" class="setting__form-more u-text-secondary u-flex-line-between u-pointer">
        Show more
        <div class="setting__form-more-box">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.793 1.33337H5.20634C2.77967 1.33337 1.33301 2.78004 1.33301 5.20671V10.7867C1.33301 13.22 2.77967 14.6667 5.20634 14.6667H10.7863C13.213 14.6667 14.6597 13.22 14.6597 10.7934V5.20671C14.6663 2.78004 13.2197 1.33337 10.793 1.33337Z" fill="currentColor"/>
            <path d="M8.0001 9.94005C7.87344 9.94005 7.74677 9.89338 7.64677 9.79338L5.29344 7.44005C5.1001 7.24671 5.1001 6.92671 5.29344 6.73338C5.48677 6.54005 5.80677 6.54005 6.0001 6.73338L8.0001 8.73338L10.0001 6.73338C10.1934 6.54005 10.5134 6.54005 10.7068 6.73338C10.9001 6.92671 10.9001 7.24671 10.7068 7.44005L8.35344 9.79338C8.25344 9.89338 8.12677 9.94005 8.0001 9.94005Z" fill="white"/>
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>
