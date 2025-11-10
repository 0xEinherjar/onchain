<script setup>
import { Avatar, Icon } from "../";
import { useUtils } from "../../composables/useUtils";
const props = defineProps(["type", "username"]);
const { isAddress, truncateAddress } = useUtils();
</script>
<!-- prettier-ignore -->
<template>
  <div class="c-profile-placeholder u-flex-line">
    <img class="c-profile-placeholder__avatar" src="../../assets/avatar-default.png" alt="User avatar">
    <div>
      <div class="c-profile-placeholder__title">Profile {{ props.type == 'UserBanned' ? "Banned" : props.type == 'UserDisabled' ? "Disabled" : "Not Found" }}</div>
      <strong class="c-profile-placeholder__name u-font-500">{{ isAddress(props.username) ? truncateAddress(props.username) : `@${username}` }}</strong>
    </div>
  </div>
  <div v-if="props.type == 'UserBanned'" class="c-profile-placeholder__info u-flex-line-center">
    <icon iconClass="c-icon" name="info1"/>
    <p class="c-profile-placeholder__info-text-desktop">
      Banned profile. For more information, please visit the <a class="c-profile-placeholder__info-link u-font-500" href="https://onchain-vote.netlify.app/#/">voting</a> page.
    </p>
    <p class="c-profile-placeholder__info-text-mobile">
      <a class="c-profile-placeholder__info-link u-font-500" href="https://onchain-vote.netlify.app/#/">Banned profile.</a>
    </p>
  </div>
</template>
<style>
.c-profile-placeholder {
  gap: 40px;
  padding: 55px 40px 55px 0;
}
.c-profile-placeholder__avatar {
  width: clamp(90px, 11vw, 180px);
  height: clamp(90px, 11vw, 180px);
  border-radius: 50%;
  object-fit: cover;
}
.c-profile-placeholder__title {
  font-size: var(--step-5);
  font-weight: 600;
  line-height: 135%;
}
.c-profile-placeholder__name {
  font-size: 14px;
  color: var(--text-color-secondary);
  margin-top: 4px;
}
.c-profile-placeholder__info {
  height: 56px;
  width: 100%;
  background-color: var(--bg-color-secondary);
  font-size: var(--step--1);
  border-radius: var(--border-radius-default);
}
.c-profile-placeholder__info > svg {
  color: var(--color-red) !important;
  margin-right: 8px;
}
.c-profile-placeholder__info-link {
  padding-inline: 5px;
  text-decoration: underline;
  height: 100%;
  line-height: 56px;
}
@media (width < 900px) {
  .c-profile-placeholder__info-text-mobile {
    display: block;
  }
  .c-profile-placeholder__info-text-desktop {
    display: none;
  }
}
@media (width < 600px) {
  .c-profile-placeholder {
    flex-direction: column;
    gap: 16px;
    padding: 32px 0;
    align-items: flex-start !important;
  }
  .c-profile-placeholder__info {
    padding-inline: 16px;
    height: 40px;
    border-radius: 8px;
  }
  .c-profile-placeholder__info-link {
    line-height: 40px;
  }
  .c-profile-placeholder__info > svg {
    margin-right: 4px;
    height: 20px;
    width: 20px;
  }
}
</style>
