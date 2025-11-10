<script setup>
import { CardPayment, Icon, SearchMobile, ModalFaucet } from "./";
import { storeToRefs } from "pinia";
import { useUserStore } from "../store/user.js";
import { useAccountStore } from "../store/account.js";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useDisconnect } from "@wagmi/vue";
const userStore = useUserStore();
const accountStore = useAccountStore();
const { user } = storeToRefs(userStore);
const { account } = storeToRefs(accountStore);
const { disconnect } = useDisconnect();
const router = useRouter();
const { resetAccount } = accountStore;
const { removeUser } = userStore;

const pathProfile = computed(() => {
  return user.value?.handle ? user.value?.handle : user.value?.owner;
});

function logout() {
  const path = pathProfile.value;
  resetAccount();
  removeUser();
  disconnect();
  router.push({ path: `/${path}` });
}
</script>
<!-- prettier-ignore -->
<template>
  <aside class="sidebar-mobile">
    <ul v-if="account.hasAccount" class="sidebar-mobile__list u-flex-line-between">
      <li class="">
        <router-link class="sidebar-mobile__item" to="/feed">
          <icon iconClass="c-icon" name="home"/>
        </router-link>
      </li>
      <li>
        <router-link class="sidebar-mobile__item" :to="`/${pathProfile}`">
          <icon iconClass="c-icon" name="profile"/>
        </router-link>
      </li>
      <li>
        <router-link class="sidebar-mobile__item" to="/settings">
          <icon iconClass="c-icon" name="setting"/>
        </router-link>
      </li>
      <li>
        <search-mobile className="sidebar-mobile__item">
          <icon iconClass="c-icon" name="search"/>
        </search-mobile>
      </li>
      <li>
        <div class="sidebar-mobile__item dropdown">
          <icon iconClass="c-icon" name="more"/>
          <div class="dropdown__group">
            <ul class="dropdown__menu">
              <li>
                <card-payment className="dropdown__item u-flex-line">
                  <icon iconClass="c-icon" name="star"/>
                  <span class="dropdown__item-text-grow">Subscription</span>
                </card-payment>
              </li>
              <li>
                <modal-faucet className="dropdown__item u-flex-line">
                  <icon iconClass="c-icon" name="wallet"/>
                  <span class="dropdown__item-text-grow">Faucet</span>
                </modal-faucet>
              </li>
              <li>
                <div @click="logout" class="dropdown__item u-flex-line">
                  <icon iconClass="c-icon" name="logout"/>
                  <span class="dropdown__item-text-grow">Logout</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
    <router-link v-else class="sidebar-mobile__button u-flex-line-center" to="/">Connect</router-link>
  </aside>
</template>
<style>
.sidebar-mobile {
  grid-column: sidebar-start / main-end;
  grid-row: sidebar;
  position: relative;
  align-items: center;
  justify-content: space-between;
  display: none;
  height: 60px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}
.sidebar-mobile__button {
  height: 40px;
  border-radius: 8px;
  background-color: var(--text-color-primary);
  color: var(--bg-color-primary);
  font-weight: 500;
  cursor: pointer;
  width: calc(100% - 48px);
  margin-inline: auto;
  font-size: 15px;
}
.sidebar-mobile__list {
  width: 100%;
  height: 100%;
}
.sidebar-mobile__item {
  padding-inline: 24px;
  height: 100%;
  cursor: pointer;
}
.sidebar-mobile__item.dropdown .dropdown__group {
  top: -178px;
  right: 24px;
  z-index: 101;
}
.dropdown__group .sidebar__item {
  height: auto;
  padding: 0;
}
@media (width < 600px) {
  .sidebar-mobile {
    display: flex;
  }
}
</style>
