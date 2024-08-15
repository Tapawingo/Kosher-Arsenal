<template>
  <div class="item" :class="selectedClass" @click="toggleItem()">
    <div class="item-title">{{ item.title }}</div>
    <div class="item-content" @click.stop>{{ item.description }}</div>
  </div>
</template>

<script lang="ts" setup>
  import { type ArsenalItemJson } from '~/classes/ArsenalItem';
  import { storeToRefs } from 'pinia'
  
  const props = withDefaults(defineProps<{item: ArsenalItemJson, isSub: boolean}>(), {
    isSub: false
  });

  const arsenalStore = useArsenalStore();
  const { selectedItem, selectedSubItem } = storeToRefs(arsenalStore)

  const itemState = ref(false);
  const selectedClass = reactive({
    selected: itemState
  })

  watch(props.isSub ? selectedSubItem : selectedItem, () => {
    if (!props.isSub && selectedItem.value != props.item) {
      itemState.value = false;
      arsenalStore.setSelectedSubCategory(null);
    } else if (props.isSub && selectedSubItem.value != props.item) {
      itemState.value = false;
    }
  })

  const toggleItem = () => {
    itemState.value = !itemState.value;

    if (props.isSub) {
      arsenalStore.setSelectedSubItem(itemState.value ? props.item : null);
    } else {
      arsenalStore.setSelectedItem(itemState.value ? props.item : null);
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
      background-color: rgba(79, 79, 79, 0.6);
      transition: 0.25s linear height;
      padding: 0rem 0.2rem;
      padding-bottom: 0;
      font-size: 0.75rem;
      overflow: hidden;
      cursor: auto;
      text-overflow: ellipsis;
      height: 0px;
    }

    &.selected .item-title {
      background-color: rgba(255, 255, 255, 0.25);
    }

    &.selected .item-content {
      padding: 0.5rem;
      height: 6rem;
    }
  }
</style>