<template>
  <div class="preview" ref="previewRoot">
    <ClientOnly>
      <img :src="arsenalStore.loadout.preview.path" fit="cover" class="preview-image" alt="Preview" />
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
  const arsenalStore = useArsenalStore();
</script>

<style lang="scss">
  .arsenal > .preview {
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    padding: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;

    .preview-image {
      height: 100%;
      margin: 0;
    }
  }
</style>