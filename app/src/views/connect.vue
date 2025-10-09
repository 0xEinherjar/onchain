<script setup>
import { ref } from "vue";
import { PanelCreateUser } from "../components";

const enableForm = ref(false);

async function enableFormCreate() {
  enableForm.value = true;
}

</script>
<!-- prettier-ignore -->
<template>
  <div class="connect">
    <div v-if="!enableForm" class="setting__section">
      <div class="setting__section-head">
        <h4>Your journey starts here</h4>
        <p class="setting__subtitle u-text-secondary">Create a new profile or reactivate yours to rejoin the community.</p>
      </div>
      <div class="setting__section-line"></div>
      <div class="actions u-flex-line-between">
        <button class="u-flex-line-center" @click="enableFormCreate" type="button">
          Create Profile
        </button>
        <router-link class="u-flex-line-center" to="/reactivate">
          Reactivate profile
        </router-link>
      </div>
    </div>
    <PanelCreateUser v-if="enableForm" />
  </div>
</template>
<style>
.setting__section {
  width: 100%;
}
.actions {
  padding: 24px;
  gap: 24px;
}
.actions > * {
  flex-grow: 1;
  height: 56px;
  border-radius: 12px;
  font-size: var(--step--2);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.connect {
  grid-column: sidebar / main-end;
  flex-direction: column;
  gap: 48px;
  min-height: 100vh;
  padding-block: 100px;
  width: min(520px, 100%);
  margin-inline: auto;
}
@media (width < 600px) {
  .connect {
    padding: 32px 24px;
  }
}
@media (width < 450px) {
  .actions {
    flex-direction: column;
    gap: 16px;
  }
  .actions > * {
    width: 100%;
  }
}
</style>
