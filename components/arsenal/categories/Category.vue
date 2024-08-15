<template>
  <UTooltip :text="category.title" :popper="{ placement: 'right' }" :ui="classOverride" :prevent="categoryState">
    <div class="category" :class="selectedClass" @click="toggleCategory()" @contextmenu.prevent="onContextMenu" ref="categoryRoot">
      <NuxtImg :src="category.icon" fit="cover" placeholder draggable="false"/>
    </div>
  </UTooltip>

  <UContextMenu v-model="isContextMenuOpen" :virtual-element="virtualElement" :ui="{ background: '', ring: '', shadow: '', rounded: '' }">
    <div class="context-menu">
      <div @click="isModalOpen = true">Edit</div>
      <div @click="deleteCategory">Delete</div>
    </div>
  </UContextMenu>

  <UModal v-model="isModalOpen" :ui="{ overlay: { background: 'bg-stone-600/75' }, background: '', ring: '' }">
    <div class="modal">
      <UFormGroup label="Category Title" required>
        <UInput v-model="newCategoryTitle" />
      </UFormGroup>

      <UFormGroup label="Category Icon" required>
        <ArsenalModalIconSelect :icons="icons" v-model="newCategoryIcon"/>
      </UFormGroup>

      <div class="button-group">
        <UButton label="Cancel" color="red" @click="isModalOpen = false"/>
        <UButton label="Save" @click="updateCategory()" />
      </div>
    </div>
  </UModal>
</template>

<script lang="ts" setup>
  import { useMouse, useWindowScroll, useMouseInElement, useMagicKeys } from '@vueuse/core'
  import type { ArsenalCategoryJson } from '~/classes/ArsenalCategory';
  import { storeToRefs } from 'pinia'

  const icons = Object.values(ArsenalCategoryIcon);
  const props = withDefaults(defineProps<{category: ArsenalCategoryJson, isSub: boolean}>(), {
    isSub: false
  });

  const { ctrl } = useMagicKeys();
  const arsenalStore = useArsenalStore();
  const toast = useToast()
  const { selectedCategory, selectedItem, selectedSubItem, selectedSubCategory } = storeToRefs(arsenalStore)
  
  const categoryRoot = ref<HTMLDivElement | null> (null);
  const categoryState = ref(false);
  const selectedClass = reactive({
    selected: categoryState,
    draggable: ctrl
  })

  const classOverride = {
    background: '',
    base: "arsenal-tooltip",
    ring: '',
    color: "white"
  };

  watch(props.isSub ? selectedSubCategory : selectedCategory, () => {
    if (!selectedCategory.value) return;

    if (!props.isSub && selectedCategory.value != props.category) {
      categoryState.value = false;
      arsenalStore.setSelectedItem(null);
    } else if (props.isSub && selectedSubCategory.value != props.category) {
      categoryState.value = false;
    }
  })

  const toggleCategory = () => {
    categoryState.value = !categoryState.value;

    if (props.isSub) {
      arsenalStore.setSelectedSubCategory(categoryState.value ? props.category : null);
    } else {
      arsenalStore.setSelectedCategory(categoryState.value ? props.category : null);
    }
  }

  const isContextMenuOpen = ref(false);
  const { x, y } = useMouse();
  const { y: windowY } = useWindowScroll();
  const virtualElement = ref({ getBoundingClientRect: () => ({}) });

  const { isOutside } = useMouseInElement(categoryRoot);

  onMounted(() => {
    document.addEventListener('contextmenu', () => {
      if (isOutside.value) { 
        isContextMenuOpen.value = false 
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

    isContextMenuOpen.value = true;
  }

  const deleteCategory = () => {
    /* @TODO: prompt for verification */

    /* Close panel */
    if (selectedCategory.value == props.category) {
      selectedCategory.value = null;
    };

    let state = arsenalStore.removeCategory(props.category.id);
    
    if (state) {
      toast.add({ title: `Deleted category: "${ props.category.title }"` });
    } else {
      toast.add({ title: 'Failed to delete category: "${ props.category.title }"' });
    }

    isContextMenuOpen.value = false;
  }

  const isModalOpen = ref(false);
  const newCategoryTitle = ref<string>(props.category.title);
  const newCategoryIcon = ref<string>(props.category.icon);
  const updateCategory = () => { /* @TODO: Force none empty strings */
    props.category.title = newCategoryTitle.value;
    props.category.icon = newCategoryIcon.value;
    isModalOpen.value = false;
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

    &.draggable {
      cursor: grab;
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