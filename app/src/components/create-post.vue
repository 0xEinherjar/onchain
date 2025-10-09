<script setup>
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { Avatar, Loading, Icon } from "./";
import { pinPostToIPFS } from "../infra/pinata.js";
import { useUserStore } from "../store/user.js";
import { abi, contract } from "../contracts/";
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { useErrorStore } from "../store/error.js";
import { zeroAddress } from "viem";
const { data: hash, writeContractAsync, error } = useWriteContract();
const errorStore = useErrorStore();
const modal = ref(null);
const open = ref(false);
const isLoading = ref(false);
const textarea = ref(null);
const attachmentURL = ref("");
const module = ref("Anyone can interact");
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const form = ref({
  attachment: null,
  text: "",
  module: zeroAddress,
});

function clear() {
  attachmentURL.value = "";
  form.value.attachment = null;
}

function getText() {
  if (textarea.value.innerText.length == 0) return "";
  return String(textarea.value.innerText).replace(/[\r|\n]/g, "\n");
}

const isFormDisabled = computed(() => {
  return form.value.attachment == null && form.value.text.length == 0;
});

function showPlaceholder(event) {
  if (String(event.target.innerText).trim().length > 0) {
    form.value.text = event.target.innerText;
    event.target.parentNode
      .querySelector(".c-create__textarea-placeholder")
      .classList.add("is-hidden");
  } else {
    form.value.text = "";
    event.target.parentNode
      .querySelector(".c-create__textarea-placeholder")
      .classList.remove("is-hidden");
  }
}

function onFileChange(event) {
  const file = event.target.files[0] || event.dataTransfer.files[0];
  if (!file) return;
  form.value.attachment = file;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    attachmentURL.value = reader.result;
  });
  reader.readAsDataURL(file);
}
function onModule(param) {
  module.value = param;
  if (param == "Anyone can interact") {
    form.value.module = zeroAddress;
  }
  if (param == "Followers only") {
    form.value.module = contract.FollowerOnlyPostModule;
  }
}
async function create() {
  isLoading.value = true;
  const text = getText();
  try {
    const metadata = await pinPostToIPFS({
      attachment: form.value.attachment,
      text: text,
      createdAt: new Date().toISOString(),
    });
    if (metadata.success == false) {
      isLoading.value = false;
      return;
    }
    await writeContractAsync({
      abi: abi.Onchain,
      address: contract.Onchain,
      functionName: "createPost",
      args: [metadata.data, form.value.module, ""],
    });
    form.value.attachment = null;
    form.value.text = "";
    attachmentURL.value = "";
  } catch (error) {
    console.log(error);
  }
}
const { isSuccess } = useWaitForTransactionReceipt({
  hash,
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
    open.value = false;
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <teleport to="body">
    <div v-if="open" class="c-modal--backdrop u-flex-line-center">
      <div class="c-create" ref="modal">
        <form class="c-create__form" @submit.prevent="create">
          <div class="c-create__header u-flex-line-between">
            <div class="c-create__author u-flex-line">
              <div class="u-text-secondary">From:</div>
              <avatar :avatar="user?.avatar" length="24px"/>
              <h4 class="c-create__author-name">{{ user?.name }}</h4>
            </div>
            <button @click="open = false" type="button">
              <icon iconClass="c-icon" name="close"/>
            </button>
          </div>
          <div class="c-create__body">
            <div class="c-create__textarea">
              <div class="c-create__textarea-placeholder">What is new?</div>
              <div class="c-create__textarea-input" @keyup="showPlaceholder" contenteditable="true" ref="textarea"></div>
            </div>
            <div v-if="attachmentURL" class="c-create__attachment">
              <h5 class="c-create__attachment-title u-flex-line">
                <icon iconClass="c-icon" name="link"/>
                <span>Attachment</span>
              </h5>
              <ul class="c-create__attachment-previews u-flex-line">
                <li class="c-create__attachment-item">
                  <img class="c-create__attachment-image" :src="attachmentURL"/>
                  <span class="c-create__attachment-name u-text-ellipsis ">image<span class="c-create__attachment-type">.png</span></span>
                </li>
              </ul>
            </div>
          </div>
          <div class="c-create__module">
            {{ module }}
            <div class="c-create__module-list">
              <div class="c-create__module-item" @click="onModule('Anyone can interact')">Anyone can interact</div>
              <div class="c-create__module-item">Followers only</div>
              <div class="c-create__module-item">Add manual module</div>
            </div>
          </div>
          <div class="c-create__footer u-flex-line">
            <button v-if="attachmentURL" @click="clear" class="c-create__clear u-flex-line" type="button">
              <div class="c-icon-box c-icon-box--red">
                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.0471 3.98659C12.9738 3.87992 11.9004 3.79992 10.8204 3.73992V3.73325L10.6738 2.86659C10.5738 2.25325 10.4271 1.33325 8.8671 1.33325H7.12043C5.5671 1.33325 5.42043 2.21325 5.31376 2.85992L5.17376 3.71325C4.55376 3.75325 3.93376 3.79325 3.31376 3.85325L1.95376 3.98659C1.67376 4.01325 1.47376 4.25992 1.50043 4.53325C1.5271 4.80659 1.7671 5.00659 2.0471 4.97992L3.4071 4.84659C6.90043 4.49992 10.4204 4.63325 13.9538 4.98659C13.9738 4.98659 13.9871 4.98659 14.0071 4.98659C14.2604 4.98659 14.4804 4.79325 14.5071 4.53325C14.5271 4.25992 14.3271 4.01325 14.0471 3.98659Z" fill="#AE3535"/>
                  <path d="M12.8192 5.92675C12.6592 5.76008 12.4392 5.66675 12.2125 5.66675H3.78585C3.55918 5.66675 3.33252 5.76008 3.17918 5.92675C3.02585 6.09341 2.93918 6.32008 2.95252 6.55341L3.36585 13.3934C3.43918 14.4067 3.53252 15.6734 5.85918 15.6734H10.1392C12.4658 15.6734 12.5592 14.4134 12.6325 13.3934L13.0458 6.56008C13.0592 6.32008 12.9725 6.09341 12.8192 5.92675Z" fill="#AE3535"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.38672 11.8333C6.38672 11.5571 6.61058 11.3333 6.88672 11.3333H9.10672C9.38286 11.3333 9.60672 11.5571 9.60672 11.8333C9.60672 12.1094 9.38286 12.3333 9.10672 12.3333H6.88672C6.61058 12.3333 6.38672 12.1094 6.38672 11.8333Z" fill="white"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M5.83398 9.16675C5.83398 8.89061 6.05784 8.66675 6.33398 8.66675H9.66732C9.94346 8.66675 10.1673 8.89061 10.1673 9.16675C10.1673 9.44289 9.94346 9.66675 9.66732 9.66675H6.33398C6.05784 9.66675 5.83398 9.44289 5.83398 9.16675Z" fill="white"/>
                </svg>
              </div>
              <span>Delete image</span>
            </button>
            <div class="c-create__footer-group u-flex-line">
              <input class="c-create__input-file" @change="onFileChange" type="file" accept="image/png, image/jpeg" name="image" id="image"/>
              <label class="c-create__file" for="image">
                <icon iconClass="c-icon" name="upload"/>
              </label>
              <button :disabled="isFormDisabled" class="c-create__submit u-flex-line" type="submit">
                <loading v-if="isLoading" type="small"/>
                <template v-else>Save</template>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </teleport>
  <button class="c-button-write" @click="open = true" type="button">
    <icon iconClass="c-icon" name="edit"/>
    <span>Write</span>
  </button>
</template>
<style>
.c-create__module {
  position: relative;
  font-size: var(--step--2);
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  width: max-content;
  margin-left: 23px;
}
.c-create__module-list {
  width: max-content;
  font-size: var(--step--2);
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: grid;
  gap: 4px;
  position: absolute;
  background-color: var(--bg-color-secondary);
  left: 0;
  bottom: 100%;
  z-index: 100;
  display: none;
}
.c-create__module:hover .c-create__module-list {
  display: block;
}
.c-create__module-item {
  padding-block: 4px;
  cursor: pointer;
}
.c-create__module-item:nth-child(2) {
  cursor: not-allowed;
}
.c-create__module-item:last-child {
  color: #3575AE;
  cursor: not-allowed;
}
.c-button-write {
  height: 48px;
  padding-inline: 16px;
  border-radius: 12px;
  font-weight: 500;
  position: fixed;
  bottom: 32px;
  right: 40px;
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: var(--bg-color-tertiary);
  z-index: 100;
}
.c-create {
  border: none;
  width: min(520px, 100%);
  background-color: var(--bg-color-primary);
  border-radius: 20px;
}
.c-create__form {
  display: grid;
  gap: 32px;
  padding-top: 24px;
}
.c-create__header {
  padding-inline: 24px;
}
.c-create__author {
  gap: 8px;
}
.c-create__author-name {
  font-weight: 400;
}
.c-create__body {
  padding-inline: 24px;
}
.c-create__input-title {
  background-color: var(--bg-color-secondary);
  height: 50px;
  width: 100%;
  border-radius: 8px;
  margin-bottom: 24px;
  text-align: center;
  font-size: 17px;
}
.c-create__input-title::placeholder {
  color: var(--text-color-primary);
  font-size: inherit;
}
.c-create__textarea {
  position: relative;
}
.c-create__textarea-placeholder {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  z-index: 2;
  min-height: 24px;
}
.c-create__textarea-input {
  min-height: 24px;
  max-height: 120px;
  position: relative;
  z-index: 3;
  outline: none;
  word-break: break-all;
  overflow-y: auto;
  color: var(--text-color-primary);
  font-size: 16px;
}
.c-create__textarea-input::-webkit-scrollbar-track {
  background: transparent;
}
.c-create__textarea-input::-webkit-scrollbar-thumb {
  background-color: var(--bg-color-secondary);
  border-radius: 10px;
}
.c-create__textarea-input::-webkit-scrollbar {
  width: 6px;
}
.c-create__attachment {
  display: grid;
  gap: 16px;
  margin-top: 32px;
}
.c-create__attachment-title {
  gap: 8px;
  font-weight: 400;
  color: var(--text-color-secondary);
  font-size: var(--step-0);
}
.c-create__file {
  cursor: pointer;
}
.c-create__input-file {
  display: none;
}
.c-create__attachment-previews {
  gap: 16px;
}
.c-create__attachment-item {
  width: 110px;
}
.c-create__attachment-image {
  width: 100%;
  aspect-ratio: 9 / 9;
  border-radius: 8px;
  object-fit: cover;
}
.c-create__attachment-name {
  color: var(--text-color-secondary);
  font-size: 12px;
  margin-top: 8px;
  display: block;
}
.c-create__attachment-type {
  opacity: 0.4;
}
.c-create__footer {
  background-color: var(--bg-color-secondary);
  height: 80px;
  padding-inline: 24px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}
.c-create__footer-group {
  gap: 22px;
  margin-left: auto;
}
.c-create__clear {
  gap: 8px;
  color: #AE3535;
  font-size: var(--step--2);
}
.c-create__clear svg {
  width: 20px;
  height: 20px;
}
.c-create__submit {
  height: 32px;
  border-radius: 8px;
  padding-inline: 16px;
  background-color: #3575AE;
  font-size: 12px;
  font-weight: 500;
}
.c-create__submit:disabled {
  cursor: default;
  pointer-events: none;
  background-color: var(--bg-color-tertiary);
}
@media (width < 600px) {
  .c-create {
    height: 100%;
    border-radius: 0;
  }
  .c-create__form {
    gap: 24px;
    height: 100%;
    grid-template-rows: auto 1fr auto;
  }
  .c-create__attachment {
    margin-top: 24px;
  }
  .c-create__body {
    display: grid;
    grid-template-rows: 1fr auto;
  }
  .c-create__footer {
    border-radius: 0;
  }
}
</style>
