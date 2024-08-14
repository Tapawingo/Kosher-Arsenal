<template>
  <div class="preview" ref="previewRoot">
    <NuxtImg :src="arsenalStore.loadout.preview.path" fit="cover" class="preview-image" placeholder />
  </div>
</template>

<script lang="ts" setup>
  const arsenalStore = useArsenalStore();
</script>

<style>

</style>