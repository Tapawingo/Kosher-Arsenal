<template>
  <UTooltip class="item-tooltip" text="Add Item" :popper="{ placement: 'bottom' }" :ui="classOverride">
    <div class="item add-item" @click="">
      <div class="item-title">
        <NuxtImg src="arsenal/icons/icon_plus.svg"/>
      </div>
    </div>
  </UTooltip>
</template>

<script lang="ts" setup>
  const props = withDefaults(defineProps<{isSub: boolean}>(), {
    isSub: false
  });
  
  const classOverride = {
    background: '',
    base: "arsenal-tooltip",
    ring: '',
    color: "white"
  };
</script>

<style lang="scss">
  .item-tooltip {
    width: 100%;
    display: block;
  }

  .add-item {
    padding: 0rem;
    
    .item-title {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0rem;

      img {
        height: 4rem;
      }
    }
  }
</style>