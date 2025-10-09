<script setup>
import { ref, onBeforeMount } from "vue";
import { Comment, CreateComment, Icon, CommentPlaceholder } from "./";
import { useComments } from "../composables/useComments";
const props = defineProps(["id", "totalComments", "isConnected", "className"]);
const open = ref(false);
const isLoading = ref(true);
const cursorPag = ref(0);
const lengthPag = ref(10);
const comments = ref([]);
const { getComments } = useComments();
const newComment = (data) => comments.value.unshift(data);

async function fetchComments() {
  const { success, data, cursor } = await getComments(
    props.id,
    cursorPag.value,
    lengthPag.value
  );
  if (success) {
    comments.value.unshift(...data);
    cursorPag.value = cursor;
  }
}
onBeforeMount(async () => {
  await fetchComments();
  isLoading.value = false;
});
</script>
<!-- prettier-ignore -->
<template>
  <button type="button" :class="props.className" @click="open = true">
    <slot></slot>
  </button>
  <teleport to="body">
    <div v-if="open" class="c-modal--backdrop u-flex-line-center">
      <div class="c-comments">
        <div class="u-flex-line-between">
          <div class="c-comments__title u-flex-line">
            <icon iconClass="c-icon" name="chat"/>
            <span>Comments <span class="c-comments__counter">{{ props.totalComments }}</span></span>
          </div>
          <button class="c-comments__close" @click="open = false" type="button">
            <icon iconClass="c-icon" name="close"/>
          </button>
        </div>
        <create-comment v-if="props.isConnected" @new-comment="newComment" :id="props.id"/>
        <template v-if="!isLoading">
          <div v-if="comments?.length > 0" class="c-comments__list">
            <template v-for="item in comments">
              <comment :date="item.createdAt" :text="item.text" :name="item.authorName" :avatar="item.authorAvatar"/>
            </template>
            <button v-if="cursorPag != 0" @click="fetchComments" class="sentinel-comment" type="button">Load more comments</button>
          </div>
          <div v-else class="c-comments__note">No comments have been made yet.</div>
        </template>
        <template v-else>
          <comment-placeholder/>
        </template>
      </div>
    </div>
  </teleport>
</template>
<style>
.sentinel-comment {
  padding-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
}
.c-comments {
  width: min(500px, 100%);
  padding: 32px 24px;
  background-color: var(--bg-color-secondary);
  border-radius: 20px;
  margin-block: 40px;
  display: grid;
  gap: 32px;
  position: relative;
}
.light-mode .c-comments {
  background-color: var(--bg-color-primary);
}
.c-comments__title {
  gap: 8px;
  font-size: 16px;
}
.c-comments__counter {
  opacity: 0.4;
}
.c-comments__list {
  display: grid;
  gap: 32px;
  max-height: 400px;
  overflow-y: auto;
}
.c-comments__list::-webkit-scrollbar-track {
  background: transparent;
}
.c-comments__list::-webkit-scrollbar-thumb {
  background-color: var(--bg-color-tertiary);
  border-radius: 10px;
}
.c-comments__list::-webkit-scrollbar {
  width: 6px;
}
.c-comments__note {
  font-size: 14px;
  text-align: center;
}
@media (width < 600px) {
  .c-comments {
    height: 100%;
    width: 100%;
    border-radius: 0;
    align-content: flex-start;
    padding: 24px;
    gap: 24px;
  }
}
</style>
