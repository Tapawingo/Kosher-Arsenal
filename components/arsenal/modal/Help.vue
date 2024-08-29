<template>
  <UModal class="arsenal-modal" v-model="isOpen">
    <div class="arsenal-modal-body">
      <UFormGroup :label="`${ currentMode } Help`">
        <ContentDoc />
      </UFormGroup>
    </div>
  </UModal>
</template>

<script lang="ts" setup>
  const arsenalStore = useArsenalStore();

  const currentMode = computed(() => {
    if (arsenalStore.mode === ArsenalMode.view) return 'Preview';
    if (arsenalStore.mode === ArsenalMode.buylist) return 'Buylist';
    if (arsenalStore.mode === ArsenalMode.edit) return 'Edit';
  });

  const isOpen = defineModel('isOpen', { type: Boolean, default: true });

</script>