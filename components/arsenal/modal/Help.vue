<template>
  <UModal class="arsenal-modal" v-model="isOpen">
    <div class="arsenal-modal-body">
      <div class="help-titlebar">
        <span><Icon name="material-symbols:help-outline" /> Help</span>
      </div>
        <UDivider />
        <ArsenalHelpPreview v-if="arsenalStore.mode === ArsenalMode.view" />
        <ArsenalHelpBuylist v-if="arsenalStore.mode === ArsenalMode.buylist" />
        <ArsenalHelpEdit v-if="arsenalStore.mode === ArsenalMode.edit" />
    </div>
  </UModal>
</template>

<script lang="ts" setup>
  const arsenalStore = useArsenalStore();

  const isOpen = defineModel('isOpen', { type: Boolean, default: true });
</script>

<style lang="scss">
  .arsenal-modal-body .help-titlebar {
    display: flex;
    justify-content: space-between;

    span {
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
  }
</style>