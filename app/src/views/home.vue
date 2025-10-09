<script setup>
import { useAccountEffect } from "@wagmi/vue";
import { useRouter } from "vue-router";
import { Logo2, ModalConnect, Chain, Icon } from "../components";
import { useAccountStore } from "../store/account.js";
import { useUserStore } from "../store/user.js";
import { useProfile } from "../composables/useProfile.js";
const router = useRouter();
const accountStore = useAccountStore();
const userStore = useUserStore();
const { getProfile } = useProfile();

useAccountEffect({
  async onConnect(data) {
    accountStore.setWallet(data.address);
    accountStore.setConnected();
    const result = await getProfile(data.address);
    if (result.success == false) {
      router.push({
        path: "/create",
      });
    } else if (result.success) {
      userStore.setUser(result.data);
      accountStore.setHasAccount();
      router.push({
        path: `/${result.data.handle ? result.data.handle : data.address}`,
      });
    }
  },
  onDisconnect() {
    accountStore.resetAccount();
  },
});
</script>
<!-- prettier-ignore -->
<template>
  <main class="home">
    <header class="header u-flex-line u-flex-line-center">
      <div class="header__logo u-flex-line c-dropdown-header">
        <logo2/>
        <svg class="header__arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.4807 13.2302L11.6907 8.18018H6.08072C5.12072 8.18018 4.64073 9.34018 5.32073 10.0202L10.5007 15.2002C11.3307 16.0302 12.6807 16.0302 13.5107 15.2002L15.4807 13.2302Z" fill="currentColor"/>
          <path opacity="0.4" d="M17.9195 8.18018H11.6895L15.4795 13.2302L18.6895 10.0202C19.3595 9.34018 18.8795 8.18018 17.9195 8.18018Z" fill="currentColor"/>
        </svg>
        <div class="c-dropdown-header__content">
          <div class="c-dropdown-header__group">
            <h3 class="c-dropdown-header__title">Protocol</h3>
            <ul class="c-dropdown-header__menu">
              <li class="c-dropdown-header__menu-item"><a href="https://onchain-app.netlify.app/#/">Website</a></li>
              <li class="c-dropdown-header__menu-item"><a href="https://onchain-docs.netlify.app/">Documentation</a></li>
              <li class="c-dropdown-header__menu-item"><a href="https://onchain-vote.netlify.app/#/">Vote</a></li>
            </ul>
          </div>
          <div class="c-dropdown-header__line"></div>
          <ul class="c-dropdown-header__menu-horizontal u-flex-line">
            <li>
              <a href="" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M18 17H13.0625L9.19551 12.1062L4.76756 17.0003H2.3125L8.04974 10.6562L2 3H7.0625L10.5575 7.47359L14.5974 3H17.0509L11.6949 8.92946L18 17ZM13.7422 15.5782H15.1012L6.32587 4.34668H4.86719L13.7422 15.5782Z" fill="currentColor"/>
                </svg>
              </a>
            </li>
            <li>
              <a href="" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">
                  <path d="M15.9683 0.276016C15.9427 0.155767 15.8538 0.058882 15.7363 0.0230158C15.526 -0.0189056 15.3084 -0.0033598 15.1063 0.0680158C15.1063 0.0680158 1.08725 5.10602 0.286252 5.66402C0.114252 5.78502 0.056252 5.85402 0.027252 5.93602C-0.110748 6.33602 0.320252 6.50902 0.320252 6.50902L3.93325 7.68602C3.99425 7.69702 4.05701 7.69325 4.11625 7.67502C4.93825 7.15602 12.3863 2.45302 12.8163 2.29502C12.8843 2.27502 12.9343 2.29502 12.9163 2.34402C12.7443 2.94402 6.31025 8.66302 6.27525 8.69802C6.2406 8.72696 6.2223 8.77104 6.22625 8.81602L5.88925 12.344C5.88925 12.344 5.74725 13.444 6.84525 12.344C7.62425 11.565 8.37225 10.919 8.74525 10.606C9.98725 11.464 11.3243 12.412 11.9013 12.906C12.0965 13.0962 12.3609 13.1984 12.6333 13.189C12.973 13.147 13.2516 12.8995 13.3333 12.567C13.3333 12.567 15.8943 2.29202 15.9793 0.909016C15.9873 0.774016 16.0003 0.692016 16.0003 0.592016C16.0039 0.48572 15.9931 0.37942 15.9683 0.276016Z" fill="currentColor"/>
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <nav class="header__nav u-flex-line">
        <a class="header__nav-item" target="_blank" href="https://onchain-vote.netlify.app/#/">Vote</a>
        <a class="header__nav-item" target="_blank" href="https://onchain-docs.netlify.app/">Docs</a>
      </nav>
      <chain/>
    </header>
    <div class="u-flex-line-center">
      <modal-connect/>
    </div>
  </main>
</template>
<style>
.c-dropdown-header {
  cursor: pointer;
  position: relative;
}
.c-dropdown-header__content {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: var(--bg-color-secondary);
  padding: 20px 24px;
  border-radius: 12px;
  min-width: 220px;
  width: max-content;
  gap: 20px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: none;
}
.c-dropdown-header__menu {
  display: grid;
  gap: 12px;
}
.c-dropdown-header__menu-item {
  color: var(--text-color-secondary);
  font-size: var(--step-0);
  cursor: pointer;
}
.c-dropdown-header:hover .c-dropdown-header__content {
  display: grid;
}
.c-dropdown-header__menu-horizontal {
  gap: 20px;
}
.c-dropdown-header__group {
  display: grid;
  gap: 16px;
}
.c-dropdown-header__line {
  height: 1px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}
.header {
  height: 100px;
  gap: 40px;
}
.header__logo {
  gap: 4px;
}
.header__arrow {
  height: 16px;
  width: 16px;
}
.header__nav {
  flex-grow: 1;
  gap: 24px;
}
.header__nav-item {
  color: var(--text-color-primary);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}
.home {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-column: sidebar-start / main-end;
  padding-inline: 40px;
}
.home__button {
  height: 87px;
  width: min(100%, 370px);
  color: var(--text-color-primary);
  border-radius: 16px;
  font-weight: 600;
  margin-bottom: 100px;
  gap: 16px;
  background-color: #28292b;
  border: 1px solid rgba(255, 255, 255, 0.12);
}
@media (width < 600px) {
  .home {
    padding-inline: 24px;
  }
  .header {
    justify-content: flex-start !important;
    gap: 24px;
    height: 80px;
  }
  .header__nav {
    display: none !important;
  }
  .home__button {
    height: 80px;
  }
  .home .c-logo {
    width: 90%;
  }
}
</style>
