<template>
  <div ref="categoryRoot" class="list-category" :class="selectedClass" @click="toggleCategory()">
    <div class="title">

      <div class="icon">
        <NuxtImg :src="category.icon" />
      </div>

      <span>{{ props.category.title }}</span>
    </div>

    <div ref="itemContainerEl" class="body" @click.stop>
      <ArsenalListItem v-for="item in category.items" :item="item" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { ArsenalCategoryJson } from '~/classes/ArsenalCategory';

  const props = withDefaults(defineProps<{category: ArsenalCategoryJson, isSub?: boolean}>(), {
    isSub: false
  });
  
  const itemContainerEl = ref<HTMLDivElement>();
  const categoryRoot = ref<HTMLDivElement | null> (null);
  const categoryState = ref(false);
  const selectedClass = reactive({
    'selected': categoryState,
  });

  const toggleCategory = () => {
    categoryState.value = !categoryState.value;
    
    setHeight();
  }

  const setHeight = () => {
    if (!itemContainerEl.value) return;
    itemContainerEl.value.style.height = `${ calculateHeight() }px`;
    itemContainerEl.value.style.minHeight = `${ calculateHeight() }px`;

    if (!categoryState.value) return;
    setTimeout(() => {
      if (!itemContainerEl.value) return;
      itemContainerEl.value.style.height = `auto`;
    }, 300);
  }

  const calculateHeight = () => {
    if (!itemContainerEl.value || !categoryState.value) return 0;
    
    let height = 0;
    Array.from(itemContainerEl.value.children).forEach((child) => {
      const styles = window.getComputedStyle(child as HTMLElement);
      const margin = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);
  
      height += Math.ceil((child as HTMLElement).offsetHeight + margin);
    });

    return height + 5;
  }
</script>