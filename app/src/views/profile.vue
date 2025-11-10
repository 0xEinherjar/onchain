<script setup>
import { useUtils } from "../composables/useUtils.js";
import { useAccountStore } from "../store/account.js";
import { useFavoriteStore } from "../store/favorite.js";
import { computed, onBeforeMount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "../store/user.js";
import { storeToRefs } from "pinia";
import {
  Back,
  ButtonFollow,
  Sidebar,
  CreatePost,
  Post,
  PostPlaceholder,
  ProfileNav,
  ProfileAbout,
  Followers,
  Following,
  Icon,
  ModalReport,
  ProfilePlaceholder,
  SidebarMobile,
  ButtonFollowModulePaid,
  Issues
} from "../components";
import { useProfile } from "../composables/useProfile.js";
import { usePublication } from "../composables/usePublication.js";
import { contract } from "../contracts/index.js";
import { zeroAddress } from "viem";
const { getProfile: getProfile2 } = useProfile();
const { getPublication } = usePublication();
const userStore = useUserStore();
const favoriteStore = useFavoriteStore();
const { user } = storeToRefs(userStore);
const route = useRoute();
const profile = ref(null);
const navActive = ref("Publications");
const publications = ref([]);
const isLoadingPost = ref(true);
const isLoadingPostScroll = ref(false);
const isLoadingProfile = ref(true);
const accountStore = useAccountStore();
const { account } = storeToRefs(accountStore);
const {
  isAddress,
  truncateAddress,
  hashtagDecorator,
  makerLink,
  copyContent,
  formatLinkDisplay,
} = useUtils();
const isFavorite = ref(false);
const observer = ref(null);
const cursorPag = ref(0);
const lengthPag = ref(15);
const isDescriptionShort = ref(false);
const activeDescriptionShort = ref(false);
const profileErrorInfo = ref({ isBanned: null, username: "" });

function toggleFavorite() {
  if (isFavorite.value == false) {
    favoriteStore.setFavorite({
      id: profile.value.id,
      avatar: profile.value.avatar,
      name: profile.value.name,
      path: profile.value.handle || profile.value.owner,
    });
    isFavorite.value = true;
  } else {
    favoriteStore.removeFavorite(profile.value.id);
    isFavorite.value = false;
  }
}

const username = computed(() => {
  return !!profile.value.handle ? profile.value.handle : profile.value.owner;
});

const isMyProfile = computed(() => {
  return (
    String(user.value?.owner).toLocaleLowerCase() ==
    String(profile.value?.owner).toLocaleLowerCase()
  );
});

function profileNavActive(nav) {
  navActive.value = nav;
}

async function fetchPost(cursorParams) {
  isLoadingPostScroll.value = true;
  const { data, cursor } = await getPublication(
    profile.value.owner,
    cursorParams,
    lengthPag.value
  );
  cursorPag.value = cursor;
  publications.value.push(...data);
  isLoadingPostScroll.value = false;
  if (cursor == 0) {
    observer.value?.disconnect();
    return;
  }
}

async function getProfile() {
  let routeParam;
  if (route.params.profile.startsWith("@")) {
    routeParam = route.params.profile.replace("@", "");
  } else {
    routeParam = route.params.profile;
  }
  const result = await getProfile2(routeParam);
  isLoadingProfile.value = false;
  publications.value = [];
  if (result.success) {    
    profile.value = result.data;
    isDescriptionShort.value = profile.value.description.length > 53;
    document.title = `${profile.value.name}'s profile (@${
      profile.value.handle || truncateAddress(profile.value.owner)
    }) | Onchain`;
    cursorPag.value = result.data.postLength;
    result.data.isFollowing;
    isFavorite.value = favoriteStore.isFavorite(result.data.id);
    await fetchPost(cursorPag.value);
    isLoadingPost.value = false;
  } else {
    profile.value = null;
    publications.value = [];
    profileErrorInfo.value.type = result.message;
    profileErrorInfo.value.username = routeParam;
  }
}

watch(
  () => route.params.profile,
  async (_) => {
    await getProfile();
  }
);
onBeforeMount(async () => {
  await getProfile();
  if (cursorPag.value != 0) {
    observer.value = new IntersectionObserver(async (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        const cursor = await fetchPost(cursorPag.value);
        if (cursor == 0) observer.value.disconnect();
      }
    });
    observer.value.observe(document.getElementById("sentinel"));
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <create-post v-if="account.hasAccount"/>
  <sidebar/>
  <sidebar-mobile/>
  <main class="main">
    <div class="u-flex-line-between">
      <back/>
      <issues/>
    </div>
    <template v-if="!isLoadingProfile">
      <template v-if="profile">
        <div class="profile__header">
          <img v-if="profile.banner" class="c-banner" :src="profile.banner" alt="Profile Banner">
          <div v-else class="c-banner--placeholder"></div>
          <div class="profile__section-1 u-flex-line-between">
            <img v-if="profile.avatar" class="profile__avatar" :src="profile.avatar" alt="User avatar">
            <img v-else class="profile__avatar" src="../assets/avatar-default.png" alt="User avatar">
            <div class="profile__actions u-flex-line">
              <ul class="u-flex-line">
                <li class="dropdown">
                  <icon iconClass="c-icon" name="link"/>
                  <div class="dropdown__group">
                    <ul class="dropdown__menu">
                      <li class="dropdown__item u-flex-line">
                        <button type="button" @click="copyContent(profile.owner)">
                          <icon iconClass="c-icon" name="copy"/>
                        </button>
                        <span class="dropdown__item-text-grow">{{ truncateAddress(profile.owner) }}</span>
                      </li>
                    </ul>
                  </div>
                </li>
                <li class="dropdown">
                  <icon iconClass="c-icon" name="more"/>
                  <div class="dropdown__group">
                    <ul class="dropdown__menu">
                      <li>
                        <modal-report :account="profile.owner"/>
                      </li>
                    </ul>
                  </div>
                </li>
                <li v-if="profile && !isMyProfile">
                  <template v-if="account.hasAccount">
                    <button-follow v-if="!isMyProfile && profile.module == zeroAddress" :isFollowing="profile?.isFollowing" :profile="profile.owner"/>
                    <button-follow-module-paid v-if="!isMyProfile && profile.module == contract.PaidFollowModule" :isFollowing="profile?.isFollowing" :profile="profile.owner"/>
                  </template>
                  <button v-else class="profile__button u-font-500" disabled>Follow</button>
                </li>
              </ul>
            </div>
          </div>
          <div class="profile__texts">
            <div class="profile__name-wrap u-flex-line">
              <h1 class="profile__name">{{ profile.name }}</h1>
              <icon v-if="profile.hasSubscription" iconClass="c-icon" name="verify"/>
              <svg v-if="!isMyProfile && account.hasAccount" @click="toggleFavorite" class="profile__favorite" :class="{'is-active': isFavorite}" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.7299 3.51014L15.4899 7.03014C15.7299 7.52014 16.3699 7.99014 16.9099 8.08014L20.0999 8.61014C22.1399 8.95014 22.6199 10.4301 21.1499 11.8901L18.6699 14.3701C18.2499 14.7901 18.0199 15.6001 18.1499 16.1801L18.8599 19.2501C19.4199 21.6801 18.1299 22.6201 15.9799 21.3501L12.9899 19.5801C12.4499 19.2601 11.5599 19.2601 11.0099 19.5801L8.01991 21.3501C5.87991 22.6201 4.57991 21.6701 5.13991 19.2501L5.84991 16.1801C5.97991 15.6001 5.74991 14.7901 5.32991 14.3701L2.84991 11.8901C1.38991 10.4301 1.85991 8.95014 3.89991 8.61014L7.08991 8.08014C7.61991 7.99014 8.25991 7.52014 8.49991 7.03014L10.2599 3.51014C11.2199 1.60014 12.7799 1.60014 13.7299 3.51014Z" stroke="#0177FB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <strong class="profile__username u-text-secondary u-font-500">{{ isAddress(username) ? truncateAddress(username) : `@${username}` }}</strong>
            </div>
            <div v-if="profile.description" class="profile__description">
              <p :class="{ 'is-short': !activeDescriptionShort }" v-html="makerLink(hashtagDecorator(profile.description))"></p>
              <span v-if="isDescriptionShort" @click="activeDescriptionShort = !activeDescriptionShort" class="profile__description-btn">show {{ activeDescriptionShort ? "less" : "more" }}</span>
            </div>
            <div v-if="profile.links.website || profile.location" class="profile__details u-flex-line">
              <div v-if="profile.location" class="u-flex-line u-text-secondary u-text-ellipsis">
                <icon iconClass="c-icon--small" name="locationLine"/> {{ profile.location }}
              </div>
              <div v-if="profile.links.website" class="u-flex-line u-text-ellipsis">
                <icon iconClass="c-icon--small" name="link"/>
                <a class="c-link" :href="profile.links.website">{{ formatLinkDisplay(profile.links.website) }}</a>
              </div>
            </div>
            <p class="profile__infos u-flex-line">
              <span>{{ profile.followers }} <span class="u-text-secondary">{{ profile.followers == 1 ? 'follower' : 'followers' }}</span></span>
              <span>{{ profile.following }} <span class="u-text-secondary">{{ profile.following == 1 ? 'following' : 'followings' }}</span></span>
              <span>{{ profile.postLength }} <span class="u-text-secondary">{{ profile.postLength == 1 ? 'post' : 'posts' }}</span></span>
            </p>
          </div>
        </div>
        <profile-nav :address="profile.owner" :links="profile.links" @profile-nav="profileNavActive"/>
        <div v-if="profile.role == 2" class="profile__info u-flex-line-center">
          <icon iconClass="c-icon" name="info1"/>
          <p class="profile__info-text-desktop">
            Profile under evaluation. Check the <a class="profile__info-link u-font-500" href="https://onchain-vote.netlify.app/#/">voting</a> page to learn more.
          </p>
          <p class="profile__info-text-mobile">
            <a class="profile__info-link u-font-500" href="https://onchain-vote.netlify.app/#/">Profile under evaluation.</a>
          </p>
        </div>
        <template v-if="navActive == 'Publications'">
          <template v-if="!isLoadingPost">
            <section v-if="publications.length > 0" class="l-post">
              <template v-for="item of publications">
                <post
                  :userRepost="profile.name"
                  :id="item.id"
                  :name="item.authorName"
                  :avatar="item.authorAvatar"
                  :attachment="item.attachment"
                  :handle="item.authorHandle"
                  :text="item.text"
                  :owner="item.owner"
                  :authorHasSubscription="item.authorHasSubscription"
                  :date="item.createdAt"
                  :like="item.totalLike"
                  :shared="item.totalShared"
                  :comment="item.totalComments"
                  :hasLiked="item.hasLiked"
                  :hasShared="item.hasShared"
                  :module="item.postModule"
                  :isConnected="account.isConnected"
                  :isMyProfile="isMyProfile"
                />
              </template>
              <div class="sentinel" id="sentinel">
                <post-placeholder v-if="isLoadingPostScroll"/>
              </div>
            </section>
            <section v-else style="text-align: center; margin-top: 80px">
              No publications have been made yet.
            </section>
          </template>
          <template v-else>
            <section class="l-post">
              <post-placeholder />
            </section>
          </template>
        </template>
        <template v-else-if="navActive == 'Followers'">
          <followers :id="profile.id" :length="profile.followers" :isConnected="account.isConnected"/>
        </template>
        <template v-else-if="navActive == 'Following'">
          <following :id="profile.id" :length="profile.following" :isConnected="account.isConnected"/>
        </template>
        <template v-else-if="navActive == 'About'">
          <profile-about :profile="profile"/>
        </template>
      </template>
      <div v-else>
        <profile-placeholder :type="profileErrorInfo.type" :username="profileErrorInfo.username"/>
      </div>
    </template>
  </main>
  <router-link v-if="!account.hasAccount" class="c-button-connect u-flex-line-center" to="/">Connect</router-link>
</template>
<style>
.profile__section-1 {
  position: relative;
  margin-block: 13px 16px;
  padding-inline: 24px;
}
.profile__avatar {
  width: clamp(80px, 15vw, 148px);
  height: clamp(80px, 15vw, 148px);
  border-radius: 240px;
  object-fit: cover;
  border: 5px solid var(--bg-color-primary);
  box-sizing: content-box;
  position: absolute;
  left: 19px;
  bottom: -5px;
}
.profile__texts {
  display: grid;
  gap: 8px;
  padding-left: 24px;
}
.profile__actions {
  margin-left: auto;
  height: 48px;
}
.profile__actions ul {
  gap: 32px;
}
.profile__details {
  gap: 24px;
}
.profile__details > div {
  gap: 8px;
  max-width: 270px;
  white-space: nowrap;
}
.profile__details .c-icon--small {
  color: var(--text-color-secondary) !important;
  flex-shrink: 0;
}
.profile__info {
  height: 56px;
  width: 100%;
  background-color: var(--bg-color-secondary);
  font-size: var(--step--1);
  border-radius: 12px;
  margin-top: 40px;
}
.profile__info > svg {
  color: var(--color-yellow) !important;
  margin-right: 8px;
}
.profile__info-text-mobile {
  display: none;
}
.profile__info-link {
  padding-inline: 2px;
  text-decoration: underline;
  height: 100%;
  line-height: 56px;
}
.profile__header {
  display: grid;
  padding: 24px 0 40px 0;
}
.profile__name-wrap {
  gap: 8px;
}
.profile__name-wrap svg {
  cursor: pointer;
  height: 22px !important;
  width: 22px !important;
}
.profile__name-wrap svg.is-active {
  fill: var(--color-blue);
}
.profile__name {
  font-size: var(--step-6);
  font-weight: bold;
  line-height: 121%;
}
.profile__username {
  font-size: 14px;
}
.profile__infos {
  gap: 12px;
}
.profile__description {
  width: 100%;
  max-width: 610px;
}
.profile__description p {
  display: inline;
  text-overflow: ellipsis;
  white-space: normal;
  overflow: visible;
  vertical-align: top;
  max-width: 520px;
  word-break: break-all;
}
.profile__description p.is-short {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
}
.profile__description .profile__description-btn {
  white-space: nowrap;
  vertical-align: top;
  color: rgb(155, 155, 155);
  cursor: pointer;
  margin-left: 4px;
}
.profile__button {
  height: 48px;
  border-radius: 12px;
  background-color: var(--bg-color-quaternary);
  color: var(--text-color-quinary);
  font-size: var(--step--1);
  padding-inline: 24px;
}
.c-button-connect {
  background-color: var(--bg-color-quaternary);
  border-radius: 12px;
  height: 56px;
  padding-inline: 24px;
  position: absolute;
  width: min(400px, 100%);
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  font-weight: 500;
  font-size: var(--step--1);
  color: var(--text-color-quinary);
  display: none !important;
}
@media (width < 1200px) {
  .c-button-connect {
    display: flex !important;
  }
}
@media (width < 900px) {
  .profile__info-text-mobile {
    display: block;
  }
  .profile__info-text-desktop {
    display: none;
  }
  .profile__avatar {
    width: clamp(80px, 17vw, 148px);
    height: clamp(80px, 17vw, 148px);
  }
}
@media (width < 600px) {
  .profile__texts {
    padding-left: 0;
  }
  .profile__avatar {
    left: 13px;
    border-width: 3px;
  }
  .c-banner--placeholder, .c-banner {
    border-radius: 8px !important;
  }
  .profile__name {
    font-weight: 500;
  }
  .profile__details {
    gap: 16px;
  }
  .profile__details > div {
    gap: 6px;
  }
  .profile__header {
    padding: 24px 0 16px 0;
  }
  .profile__button {
    height: 34px;
    border-radius: 8px;
    font-size: 12px;
    padding-inline: 16px;
  }
  .profile__button span {
    display: none;
  }
  .profile__section-1 {
    margin-block: 12px 24px;
    padding-inline: 16px;
  }
  .profile__actions {
    height: 40px;
  }
  .profile__actions > ul {
    gap: 24px;
  }
  .c-button-connect {
    display: none !important;
  }
  .profile__info {
    padding-inline: 16px;
    height: 40px;
    border-radius: 8px;
  }
  .profile__info-link {
    line-height: 40px;
  }
  .profile__info > svg {
    margin-right: 4px;
    height: 20px;
    width: 20px;
  }
  .profile__favorite {
    display: none;
  }
}
</style>
