<template>
  <div class="category" :class="selectedClass" @click="toggleCategory()">
    <img :src="icon" alt="" />
  </div>
</template>

<script lang="ts" setup>
  const icon = ref('/arsenal/icons/icon_rifle.svg');

  const categorySelected = ref(false);
  const selectedClass = reactive({
    selected: categorySelected
  })

  const toggleCategory = () => {
    categorySelected.value = !categorySelected.value;
  }
</script>