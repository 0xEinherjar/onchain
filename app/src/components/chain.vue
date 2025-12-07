<script setup></script>
<!-- prettier-ignore -->
<template>
  <button type="button" class="c-chain"><span class=""></span>Arc Testnet</button>
</template>
<style>
.c-chain {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #28292b;
  height: 48px;
  border-radius: 12px;
  color: var(--text-color-primary);
  font-size: 15px;
  font-weight: 500;
  padding-inline: 24px;
  white-space: nowrap;
}
.light-mode .c-chain {
  background-color: #f3f8fd;
}
.c-chain span {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: #2fc687;
}
@media (width < 600px) {
  .c-chain {
    height: 40px;
    font-size: 13px;
    padding-inline: 16px;
    gap: 8px;
    margin-left: auto;
  }
  .c-chain span {
    height: 8px;
    width: 8px;
  }
}
</style>
