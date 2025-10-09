<script setup>
import { useUtils } from "../composables/useUtils.js";
import { useAccountStore } from "../store/account.js";
import { computed, onBeforeMount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "../store/user.js";
import { storeToRefs } from "pinia";
import { useGetPost } from "../composables/useGetPost.js";
import {
  Back,
  Sidebar,
  CreatePost,
  SidebarMobile,
  CardUserPost,
  CreateComment,
  Comment,
  Post,
} from "../components";
import { useComments } from "../composables/useComments.js";
const postData = ref({});
const userStore = useUserStore();
const isLoading = ref(true);
const { user } = storeToRefs(userStore);
const route = useRoute();
const accountStore = useAccountStore();
const { account } = storeToRefs(accountStore);
const { hashtagDecorator, makerLink } = useUtils();
const { getPost } = useGetPost();
const cursorPag = ref(0);
const lengthPag = ref(10);
const comments = ref([]);
const hasFound = ref(true);
const { getComments } = useComments();
const onComment = (data) => comments.value.unshift(data);

const isMyProfile = computed(() => {
  return user.value?.id === postData.value.id;
});

async function fetchComments() {
  const { success, data, cursor } = await getComments(
    postData.value.postId,
    cursorPag.value,
    lengthPag.value
  );
  if (success) {
    comments.value.unshift(...data);
    cursorPag.value = cursor;
  }
}

onBeforeMount(async () => {
  const result = await getPost(route.params.id);
  if (result.success) {
    postData.value = result.data;
    if (postData.value.text) {
      document.title = `${postData.value.name}'s post on Onchain`;
    }
    if (postData.value.totalComments) {
      await fetchComments();
    }
  } else {
    hasFound.value = false;
  }
  isLoading.value = false;
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
    </div>
    <div v-if="!isLoading && hasFound" class="l-page-post">
      <div class="l-page-post__post">
        <post v-if="postData"
          :id="postData.postId"
          :name="postData.name"
          :avatar="postData.avatar"
          :attachment="postData.attachment"
          :handle="postData.handle"
          :text="postData.text"
          :shared="postData.totalShared"
          :owner="postData.owner"
          :hasShared="false"
          :authorHasSubscription="postData.hasSubscription"
          :date="postData.postCreatedAt"
          :like="postData.totalLike"
          :comment="postData.totalComments"
          :hasLiked="postData.hasLiked"
          :module="postData.postModule"
          :isConnected="account.isConnected"
          :isMyProfile="isMyProfile"
          :isPage="true"
        />
        <create-comment v-if="account.isConnected" @new-comment="onComment" :id="postData.postId"/>
        <div v-else class="l-page-post__line"></div>
        <template v-if="comments.length">
          <template v-for="item in comments">
            <comment :date="item.createdAt" :text="item.text" :name="item.authorName" :avatar="item.authorAvatar"/>
            <div class="l-page-post__line"></div>
          </template>
          <button v-if="cursorPag != 0" @click="fetchComments" class="sentinel-comment" type="button">Load more comments</button>
        </template>
      </div>
      <card-user-post :owner="postData.owner" :avatar="postData.avatar" :name="postData.name" :handle="postData.handle" :description="postData.description"/>
    </div>
    <h1 v-if="!isLoading && !hasFound" class="l-page-post__title">Post not found</h1>
  </main>
  <router-link v-if="!account.hasAccount" class="c-button-connect u-flex-line-center" to="/">Connect</router-link>
</template>
<style>
.l-page-post {
  display: grid;
  grid-template-columns: 600px 1fr;
  gap: 48px;
  align-items: start;
  margin-top: 32px;
}
.l-page-post__title {
  text-align: center;
  margin-top: 32px;
}
.l-page-post__post {
  display: grid;
  gap: 18px;
}
.l-page-post .c-create-comment {
  border-color: rgba(255, 255, 255, 0.12) !important;
}
.l-page-post .c-comment {
  gap: 16px 12px;
}
.l-page-post .c-comment__paragraph {
  grid-column: 1 / 3;
}
.l-page-post__line {
  background-color: rgba(255, 255, 255, 0.12);
  width: 100%;
  height: 1px;
}
@media (width < 1350px) {
  .l-page-post {
    grid-template-columns: 7fr 4fr;
  }
}
@media (width < 900px) {
  .l-page-post {
    grid-template-columns: 1fr;
  }
}
</style>
