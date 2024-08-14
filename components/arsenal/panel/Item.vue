<template>
  <div class="item" :class="selectedClass" @click="toggleItem()">
    <div class="item-title">{{ item.title }}</div>
    <div class="item-content">{{ item.description }}</div>
  </div>
</template>

<script lang="ts" setup>
  import { ArsenalItem } from '~/classes/ArsenalItem';
  
  const props = withDefaults(defineProps<{item: ArsenalItem, isSub: boolean}>(), {
    isSub: false
  });

  const selectedItem = useState<ArsenalItem | undefined>(props.isSub ? 'sub-item' : 'item');
  const selectedSubCategory = useState<ArsenalItem | undefined>('sub-category');

  const itemState = ref(false);
  const selectedClass = reactive({
    selected: itemState
  })

  watch(selectedItem, (newItem: ArsenalItem | undefined) => {
    if (!newItem) return;

    if (newItem != props.item) {
      itemState.value = false;
    } else if (!props.isSub) {
      selectedSubCategory.value = undefined;
    }
  })

  const toggleItem = () => {
    itemState.value = !itemState.value;
    selectedItem.value = itemState.value ? props.item : undefined;

    if (!props.isSub && !itemState.value) {
      selectedSubCategory.value = undefined;
    }
  }
</script>

<style lang="scss">
  .item {
    background-color: rgba(85, 85, 85, 0.6);
    margin-bottom: 1px;
    cursor: pointer;
    user-select: none;
    
    .item-title {
      padding: 1.25rem 0.5rem 1.25rem 0.5rem;
    }
    
    .item-content {
      transition: 0.25s linear height;
      padding: 0.2rem;
      padding-bottom: 0;
      font-size: 0.75rem;
      overflow: hidden;
      height: 0px;
    }

    &.selected .item-title {
      background-color: rgba(255, 255, 255, 0.25);
    }

    &.selected .item-content {
      padding: 0.2rem;
      height: 4rem;
    }
  }
</style>