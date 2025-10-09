<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { Icon } from "../";

const open = ref(false);

</script>
<!-- prettier-ignore -->
<template>
  <teleport to="body">
    <div v-if="open" class="c-modal--backdrop u-flex-line-center">
      <div class="c-modal">
        <div class="c-modal__content">
          <div class="u-flex-line-between">
            <h3>Choose Your Publication Module</h3>
            <Icon @click="open = false" iconClass="c-icon u-pointer" name="close"/>
          </div>
          <div class="c-module__select">
            <div>Anyone Can Interact</div>
            <div class="u-text-secondary">Allow anyone to interact with your posts instantly without restrictions.</div>
          </div>
          <div class="c-module__select">
            <div>Only Followers</div>
            <div class="u-text-secondary">Only allow your followers to interact with your posts.</div>
          </div>
          <div class="c-module__or u-flex-line">
            <div class="c-module__or-line"></div>
            <div>or</div>
            <div class="c-module__or-line"></div>
          </div>
          <div class="c-form__field">
            <label for="follow" class="c-form__label">Add module manual</label>
            <input type="text" class="c-form__input" readonly placeholder="Contract: (0x...)">
          </div>
        </div>
        <div class="c-modal__footer">
          <button class="c-button c-button--extra-large c-button--success u-fluid u-flex-line-center" type="button">Save</button>
        </div>
      </div>
    </div> 
  </teleport>
  <section class="setting__section" id="publication">
    <div class="setting__section-head">
      <h4>Choose Your Publication Module</h4>
      <p class="setting__subtitle u-text-secondary">Control who can interact with your posts and under what conditions</p>
    </div>
    <div class="setting__section-line"></div>
    <div class="setting__form">
      <div @click="open = true" class="setting__form-option">
        Allow anyone to interact with your posts instantly without restrictions.
        <div class="setting__form-more-box">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.20634 1.33337H10.7863C13.2197 1.33337 14.6663 2.78004 14.6663 5.20671V10.7867C14.6663 13.2134 13.2197 14.66 10.793 14.66H5.20634C2.77967 14.6667 1.33301 13.22 1.33301 10.7934V5.20671C1.33301 2.78004 2.77967 1.33337 5.20634 1.33337Z" fill="#3575AE"/>
            <path d="M6.82633 4.16663C6.54633 4.16663 6.32633 4.39329 6.32633 4.66663V10.1266L5.21299 9.01329C5.01966 8.81996 4.69966 8.81996 4.50633 9.01329C4.31299 9.20663 4.31299 9.52663 4.50633 9.71996L6.47299 11.6866C6.51966 11.7333 6.57299 11.7666 6.63299 11.7933C6.69299 11.82 6.75966 11.8333 6.82633 11.8333C6.89299 11.8333 6.95299 11.82 7.01966 11.7933C7.13966 11.74 7.23966 11.6466 7.29299 11.52C7.31966 11.46 7.33299 11.3933 7.33299 11.3266V4.66663C7.32633 4.39329 7.09966 4.16663 6.82633 4.16663Z" fill="white"/>
            <path opacity="0.4" d="M11.4929 6.27996L9.52618 4.31329C9.47952 4.26663 9.42618 4.23329 9.36618 4.20663C9.24618 4.15329 9.10618 4.15329 8.98618 4.20663C8.86618 4.25996 8.76618 4.35329 8.71285 4.47996C8.68618 4.53996 8.67285 4.59996 8.67285 4.66663V11.3333C8.67285 11.6066 8.89952 11.8333 9.17285 11.8333C9.44618 11.8333 9.67285 11.6066 9.67285 11.3333V5.87329L10.7862 6.98663C10.8862 7.08663 11.0129 7.13329 11.1395 7.13329C11.2662 7.13329 11.3929 7.08663 11.4929 6.98663C11.6862 6.79329 11.6862 6.47329 11.4929 6.27996Z" fill="white"/>
          </svg>
        </div>
      </div>
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
</style>
