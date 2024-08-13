<template>
  <div class="item" :class="selectedClass" @click="toggleItem()">
    <div class="item-title">Example Item</div>
    <div class="item-content">Example item description</div>
  </div>
</template>

<script lang="ts" setup>
  const itemSelected = ref(false);
  const selectedClass = reactive({
    selected: itemSelected
  })

  const toggleItem = () => {
    itemSelected.value = !itemSelected.value;
  }
</script>