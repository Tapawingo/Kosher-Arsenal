<template>
  <div class="category" :class="selectedClass" @click="toggleCategory()">
    <img :src="category.icon" alt="" />
  </div>
</template>

<script lang="ts" setup>
import type { ArsenalCategory } from '~/classes/ArsenalCategory';

  defineProps<{
    category: ArsenalCategory
  }>();

  const categorySelected = ref(false);
  const selectedClass = reactive({
    selected: categorySelected
  })

  const toggleCategory = () => {
    categorySelected.value = !categorySelected.value;
  }
</script>