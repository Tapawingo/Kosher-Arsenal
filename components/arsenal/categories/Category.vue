<template>
  <UTooltip :text="category.title" :popper="{ placement: 'right' }" :ui="classOverride" :prevent="categoryState">
    <div class="category" :class="selectedClass" @click="toggleCategory()" @contextmenu.prevent="onContextMenu">
      <NuxtImg :src="category.icon" fit="cover" placeholder/>
    </div>
  </UTooltip>

  <UContextMenu v-model="isOpen" :virtual-element="virtualElement" :ui="{ background: '', ring: '', shadow: '', rounded: '' }">
    <div class="context-menu">
      <div>Edit</div>
      <div>Delete</div>
    </div>
  </UContextMenu>
</template>

<script lang="ts" setup>
  import { useMouse, useWindowScroll } from '@vueuse/core'
  import type { ArsenalCategory } from '~/classes/ArsenalCategory';
  import { ArsenalItem } from '~/classes/ArsenalItem';

  const props = withDefaults(defineProps<{category: ArsenalCategory, isSub: boolean}>(), {
    isSub: false
  });
  const selectedCategory = useState<ArsenalCategory | undefined>(props.isSub ? 'sub-category' : 'category');
  const selectedItem = useState<ArsenalItem | undefined>('item');
  const selectedSubItem = useState<ArsenalCategory | undefined>('sub-item');
  const selectedSubCategory = useState<ArsenalCategory | undefined>('sub-category');

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

  watch(selectedCategory, (newCategory: ArsenalCategory | undefined) => {
    if (!newCategory) return;

    if (newCategory != props.category) {
      categoryState.value = false;
    } else if (!props.isSub) {
      selectedItem.value = undefined;
      selectedSubCategory.value = undefined;
    }
  })

  const toggleCategory = () => {
    categoryState.value = !categoryState.value;
    selectedCategory.value = categoryState.value ? props.category : undefined;

    if (!props.isSub && !categoryState.value) {
      selectedItem.value = undefined;
      selectedSubItem.value = undefined;
      selectedSubCategory.value = undefined;
    }
  }

  const isOpen = ref(false);
  const { x, y } = useMouse()
  const { y: windowY } = useWindowScroll()

  const virtualElement = ref({ getBoundingClientRect: () => ({}) })
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
      cursor: pointer;

      &:last-child {
        border-top: 1px solid rgba(255, 255, 255, 0.25);
      }
    }
  }
</style>