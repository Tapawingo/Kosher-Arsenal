<template>
  <UTooltip :text="category.title" :popper="{ placement: 'right' }" :ui="classOverride" :prevent="categoryState">
    <div class="category" :class="selectedClass" @click="toggleCategory()" @contextmenu.prevent="onContextMenu" ref="categoryRoot">
      <NuxtImg :src="category.icon" fit="cover" placeholder draggable="false"/>
    </div>
  </UTooltip>

  <UContextMenu v-model="isOpen" :virtual-element="virtualElement" :ui="{ background: '', ring: '', shadow: '', rounded: '' }">
    <div class="context-menu">
      <div>Edit</div>
      <div @click="deleteCategory">Delete</div>
    </div>
  </UContextMenu>
</template>

<script lang="ts" setup>
  import { useMouse, useWindowScroll, useMouseInElement } from '@vueuse/core'
  import type { ArsenalCategoryJson } from '~/classes/ArsenalCategory';
  import { storeToRefs } from 'pinia'

  const props = withDefaults(defineProps<{category: ArsenalCategoryJson, isSub: boolean}>(), {
    isSub: false
  });

  const arsenalStore = useArsenalStore();
  const toast = useToast()
  const { selectedCategory, selectedItem, selectedSubItem, selectedSubCategory } = storeToRefs(arsenalStore)
  
  const categoryRoot = ref<HTMLDivElement | null> (null);
  const categoryState = ref(false);
  const selectedClass = reactive({
    selected: categoryState
  })

  const classOverride = {
    background: '',
    base: "arsenal-tooltip",
    ring: '',
    color: "white"
  };

  watch(selectedCategory, () => {
    if (!selectedCategory.value) return;

    if (selectedCategory.value != props.category) {
      categoryState.value = false;
    } else if (!props.isSub) {
      selectedItem.value = null;
      selectedSubCategory.value = null;
    }
  })

  const toggleCategory = () => {
    categoryState.value = !categoryState.value;
    selectedCategory.value = categoryState.value ? props.category : null;

    if (!props.isSub && !categoryState.value) {
      selectedItem.value = null;
      selectedSubItem.value = null;
      selectedSubCategory.value = null;
    }
  }

  const isOpen = ref(false);
  const { x, y } = useMouse();
  const { y: windowY } = useWindowScroll();
  const virtualElement = ref({ getBoundingClientRect: () => ({}) });

  const { isOutside } = useMouseInElement(categoryRoot);

  onMounted(() => {
    document.addEventListener('contextmenu', () => {
      if (isOutside.value) { 
        isOpen.value = false 
      }; 
    });
  })

  const onContextMenu = () => {
    const top = unref(y) - unref(windowY)
    const left = unref(x)

    virtualElement.value.getBoundingClientRect = () => ({
      width: 0,
      height: 0,
      top,
      left
    })

    isOpen.value = true;
  }

  const deleteCategory = () => {
    /* Are you sure prompt */

    /* Close panel */
    if (selectedCategory.value == props.category) {
      selectedCategory.value = null;
    };

    let state = arsenalStore.removeCategory(props.category.id);
    
    if (state) {
      toast.add({ title: 'Deleted Category' });
    } else {
      toast.add({ title: 'Failed to delete category' });
    }

    isOpen.value = false;
  }
</script>

<style lang="scss">
  .category {
    background-color: rgba(85, 85, 85, 0.6);
    border: 1px solid rgb(0, 0, 0);
    cursor: pointer;
    width: 100%;
    aspect-ratio: 1 / 1;
    margin-bottom: 5.55px;
    user-select: none;

    &:hover {
        background-color: rgba(255, 255, 255, 0.25);
    }

    &.selected {
        background-color: rgba(255, 255, 255, 0.25);
    }
  }

  .context-menu {
    background-color: rgb(85, 85, 85);
    border-radius: 2px;
    font-size: 0.85rem;
    padding: 0.2rem 0.3rem;

    div {
      color: rgb(184, 184, 184);
      cursor: pointer;

      &:last-child {
        border-top: 1px solid rgba(255, 255, 255, 0.25);
      }

      &:hover {
        color: rgb(255, 255, 255);
      }
    }
  }
</style>