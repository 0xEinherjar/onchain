<script setup>
  import { Icon } from "./";
</script>
<!-- prettier-ignore -->
<template>
  <div class="dropdown">
    <icon iconClass="c-icon--small" name="flag"/>
    <div class="dropdown__group">
      <div class="dropdown__menu">
        <div class="dropdown__item u-flex-line">
          <icon iconClass="c-icon--small" name="directBox"/>
          Send app feedback
        </div>
        <div class="dropdown__item u-flex-line">
          <icon iconClass="c-icon--small" name="flag"/>
          Report legal issue
        </div>
      </div>
    </div>
  </div>
</template>