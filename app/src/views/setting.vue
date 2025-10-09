<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "../store/user.js";
import {
  FormReactivatePost,
  FormHandle,
  FormUpdate,
  FormRedeem,
  FollowModule,
  Back,
  Sidebar,
  SidebarMobile,
} from "../components";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const sectionActive = ref("");
const content = ref(null);
const description = ref("");
const biography = ref("");
const form = ref({
  avatar: null,
  name: "",
  description: "",
  createdAt: "",
  biography: "",
  location: "",
  links: {
    twitter: "",
    youtube: "",
    twitch: "",
    instagram: "",
  },
});

const setFormValues = (source) => {
  Object.assign(form.value, source, {
    links: { ...source.links },
  });
  description.value = source.description;
  biography.value = source.biography;
};

function scrollMeTo(refName) {
  const top = document.getElementById(refName).offsetTop;
  window.scrollTo({ top, behavior: "smooth" });
}

onMounted(() => {
  setFormValues(user.value);
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {          
          sectionActive.value = entry.target.getAttribute("id");
        }
      });
    },
    {
      threshold: 0.7,
    }
  );
  content.value.querySelectorAll("section").forEach((section) => {    
    observer.observe(section);
  });
});
</script>
<!-- prettier-ignore -->
<template>
  <sidebar/>
  <sidebar-mobile/>
  <main class="main">
    <div class="u-flex-line-between">
      <back/>
    </div>
    <div class="setting">
      <div class="setting__content" ref="content">
        <div class="setting__heading">
          <h3 class="setting__title u-font-500">Settings</h3>
          <p class="u-text-secondary">Manage your account security and preferences</p>
        </div>
        <form-update/>
        <form-handle v-if="user.hasSubscription" :user-handle="user.handle"/>
        <div class="setting__heading">
          <h3 class="setting__title u-font-500">Choose Your Modules</h3>
          <p class="u-text-secondary">Customize how others interact with your profile</p>
        </div>
        <follow-module/>
        <div class="setting__heading">
          <h3 class="setting__title u-font-500">Profile Actions</h3>
          <p class="u-text-secondary">Perform key actions such as adding content or withdrawing your profile.</p>
        </div>
        <form-reactivate-post/>
        <form-redeem/>
      </div>
      <aside class="setting__nav">
        <h5 class="setting__nav-caption u-flex-line u-text-secondary">On This Page</h5>
        <div class="setting__nav-list">
          <span class="setting__nav-pointer"></span>
          <a @click="scrollMeTo('pictures')" :class="{'is-active' : sectionActive == 'pictures'}" class="setting__nav-text">Pictures</a>
          <span class="setting__nav-pointer"></span>
          <a @click="scrollMeTo('accounts')" :class="{'is-active' : sectionActive == 'accounts'}" class="setting__nav-text">Account</a>
          <template v-if="user.hasSubscription">
            <span class="setting__nav-pointer"></span>
            <a @click="scrollMeTo('handle')" :class="{'is-active' : sectionActive == 'handle'}" class="setting__nav-text">Update Handle</a>
          </template>
          <span class="setting__nav-pointer"></span>
          <a @click="scrollMeTo('follow')" :class="{'is-active' : sectionActive == 'follow'}" class="setting__nav-text">Follow Modules</a>
          <span class="setting__nav-pointer"></span>
          <a @click="scrollMeTo('import')" :class="{'is-active' : sectionActive == 'import'}" class="setting__nav-text">Import Publication</a>
          <span class="setting__nav-pointer"></span>
          <a @click="scrollMeTo('redeem')" :class="{'is-active' : sectionActive == 'redeem'}" class="setting__nav-text">Redeem Profile</a>
        </div>
      </aside>
    </div>
  </main>
</template>
<style>
.setting__form {
  display: grid;
  gap: 24px;
  padding: 24px;
}
.setting__form-option {
  gap: 16px;
  padding: 10px 16px;
  border-right: 1px solid rgba(255, 255, 255, 0.12);
  border-left: 1px solid rgba(255, 255, 255, 0.12);
  font-size: var(--step--2);
  display: grid;
  grid-template-columns: 1fr max-content;
  align-items: center;
}
.setting__form-field {
  display: grid;
}
.setting__form-label {
  font-size: 12px;
  line-height: 100%;
}
.setting__form-input {
  height: 40px;
}
.setting__form-more {
  font-size: 12px;
}
.setting__form-more-box {
  padding: 5px;
  background-color: rgba(53, 117, 174, 0.25);
  border-radius: 8px;
  display: flex;
  color: #3575AE;
  height: min-content;
}
.setting__form-more-box.is-active {
  color: #35AE47;
  background-color: rgba(53, 174, 71, 0.25);
}
.setting__form-row {
  gap: 16px;
}
.setting__form-row > .setting__form-field {
  flex-grow: 1;
}
.setting__form-button {
  background-color: #3575AE;
  border-radius: 8px;
  height: 40px;
  padding-inline: 16px;
  font-size: 14px;
}
.setting__form-attachment-field {
  gap: 16px;
  padding-block: 4px;
}
.setting__form-attachment-text {
  font-size: var(--step--2);
  flex-grow: 1;
}
.setting__form-attachment-label {
  font-size: var(--step--2);
  color: #3575AE;
}
.setting__form-picture {
  height: 32px;
  width: 32px;
  border-radius: 8px;
  object-fit: cover;
}
.setting__form-picture--placeholder {
  height: 32px;
  width: 32px;
  border-radius: 8px;
  background-color: var(--bg-color-tertiary);
}
.setting__form-footer {
  padding-inline: 24px;
  border-radius: 16px;
  background-color: var(--bg-color-secondary);
  height: 80px;
  position: sticky;
  width: 100%;
  top: 22px;
  z-index: 20;
}
.setting__form-restore {
  gap: 8px;
  color: var(--color-red);
  font-size: 12px;
}
.setting__form-restore svg {
  height: 16px;
  width: 16px;
}
.setting__form-restore-box {
  background-color: rgba(174, 53, 53, 0.25);
  padding: 5px;
  border-radius: 8px;
}
.setting__textarea {
  position: relative;
}
.setting__textarea-placeholder {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  z-index: 2;
  min-height: 40px;
  line-height: 40px;
  color: #757575;
}
.setting__textarea-input {
  min-height: 40px;
  max-height: 120px;
  position: relative;
  overflow-y: auto;
  z-index: 3;
  outline: none;
  word-break: break-word;
  padding-block: 8px;
}
.setting__textarea-input::-webkit-scrollbar-track {
  background: transparent;
}
.setting__textarea-input::-webkit-scrollbar-thumb {
  background-color: var(--bg-color-secondary);
  border-radius: 10px;
}
.setting__textarea-input::-webkit-scrollbar {
  width: 6px;
}

.setting {
  padding-block: 32px;
  display: flex;
  align-items: flex-start;
  gap: 56px;
}
.setting__heading {
  display: grid;
  gap: 8px;
}
.setting__nav {
  min-width: 160px;
  position: sticky;
  top: 32px;
  flex-shrink: 0;
  width: min(292px, 100%);
  width: 17vw;
}
.setting__nav-caption {
  font-size: var(--step--2);
  line-height: 1;
  font-weight: 500;
  margin-bottom: 32px;
}
.setting__nav-list {
  display: grid;
  grid-template-columns: max-content 1fr;
  align-items: center;
  gap: 32px 16px;
  position: relative;
}
.setting__nav-list::before {
  content: "";
  position: absolute;
  width: 1px;
  grid-column: 1/2;
  justify-self: center;
  height: 100%;
  background-color: var(--bg-color-quinary);
  opacity: 0.6;
  z-index: -1;
}
.setting__nav-pointer {
  justify-self: center;
  height: 9px;
  width: 9px;
  border-radius: 50%;
  border: 1px solid var(--bg-color-quaternary);
  background-color: var(--bg-color-primary);
  box-shadow: 0 0 0 4px var(--bg-color-primary);
}
.setting__nav-pointer:has(+ .setting__nav-text.is-active) {
  height: 15px;
  width: 15px;
}
.setting__nav-text {
  font-size: 14px;
  line-height: 16px;
  color: rgba(189, 193, 198, 0.6);
  color: var(--text-color-secondary);
}
.setting__nav-text.is-active {
  font-weight: 400;
  font-size: 15px;
  color: var(--text-color-primary);
  opacity: 0.9;
}
.setting__content {
  flex-grow: 1;
  display: grid;
  gap: 32px;
  position: relative;
}
.setting__section {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
}
.setting__section-head {
  display: grid;
  gap: 2px;
  padding: 24px;
}
.setting__section-line {
  background-color: rgba(255, 255, 255, 0.12);
  width: 100%;
  height: 1px;
}
.setting__title {
  font-size: var(--step-2);
}
.setting__subtitle {
  font-size: var(--step--2);
}
@media (width < 1200px) {
  .setting__nav {
    width: max-content;
  }
}
@media (width < 900px) {
  .setting__nav {
    display: none;
  }
}
@media (width < 600px) {
  
}
</style>
