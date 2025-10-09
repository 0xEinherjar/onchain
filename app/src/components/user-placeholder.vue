<template>
  <div class="c-user-placeholder">
    <div class="c-user-placeholder__image"></div>
    <div class="c-user-placeholder__group">
      <div class="c-user-placeholder__name"></div>
      <div class="c-user-placeholder__handle"></div>
    </div>
    <div class="c-user-placeholder__button"></div>
  </div>
</template>
<style>
.c-user-placeholder {
  display: grid;
  gap: 4px;
  justify-items: center;
  width: max-content;
  max-width: 110px;
}
.c-user-placeholder__group {
  display: grid;
  gap: 4px;
  justify-items: center;
  width: 100%;
}
.c-user-placeholder__image,
.c-user-placeholder__handle,
.c-user-placeholder__button,
.c-user-placeholder__name {
  background-color: var(--bg-color-secondary);
  position: relative;
  overflow: hidden;
}
.c-user-placeholder__image::before,
.c-user-placeholder__handle::before,
.c-user-placeholder__button::before,
.c-user-placeholder__name::before {
  content: "";
  display: block;
  height: 50vh;
  width: 50vw;
  position: absolute;
  animation: is-passing 0.6s ease-in infinite;
  background: linear-gradient(to right, transparent, #4e4f51 50%, transparent);
  z-index: 5;
}
.c-user-placeholder__image {
  height: 104px;
  width: 104px;
  border-radius: 50%;
}
.c-user-placeholder__name,
.c-user-placeholder__handle {
  border-radius: 4px;
  margin-block: 0.4px;
}
.c-user-placeholder__name {
  height: 12px;
  width: 80%;
}
.c-user-placeholder__handle {
  width: 60%;
  height: 10px;
}
.c-user-placeholder__button {
  height: 32px;
  width: 69px;
  border-radius: 8px;
  margin-top: 12px;
}
@keyframes is-passing {
  from {
    transform: translateX(-100%);
  }
}
@media (width < 600px) {
  .c-user-placeholder {
    display: flex;
    align-items: center;
    gap: 24px;
    max-width: none;
    width: 100%;
  }
  .c-user-placeholder__group {
    flex-grow: 1;
    justify-items: flex-start;
  }
  .c-user-placeholder__image {
    height: 50px;
    width: 50px;
    flex-shrink: 0;
  }
  .c-user-placeholder__button {
    flex-shrink: 0;
    margin-top: 0;
  }
  .c-user-placeholder__name {
    width: 60%;
  }
  .c-user-placeholder__handle {
    width: 40%;
  }
}
</style>
