<template>
  <div class="category-panel" @contextmenu.prevent="onContextMenu" ref="PanelRoot">
    <div v-if="category" class="panel">
      <div class="title">{{ category?.title }}</div>
      <div v-if="!refresh">
        <VueDraggable @end="onDrop" v-model="category.items" :disabled="!ctrl" :sort=true :swap-threshold="0.5">
          <ArsenalPanelItem v-for="item in category?.items" :item="item" :key="item.position" :is-sub="props.isSub"/>
        </VueDraggable>
      </div>
      <ArsenalPanelAddItem v-if="category && isEditMode" :is-sub="props.isSub" />
      <div class="total-price" v-if="arsenalStore.isBuylistMode()">
        <span>Total (WIP):</span>
        <span class=price>0.00 €</span>
      </div>
    </div>
  </div>

  <UContextMenu v-model="isContextMenuOpen" :virtual-element="virtualElement" :ui="{ background: '', ring: '', shadow: '', rounded: '' }">
    <div class="context-menu" v-if="isEditMode">
      <div v-if="arsenalStore.clipboard" @click="pasteItem">Paste</div>
    </div>
  </UContextMenu>
</template>

<script lang="ts" setup>
  import { createId } from '@paralleldrive/cuid2';
  import { VueDraggable } from 'vue-draggable-plus';
  import { useMagicKeys, useMouse, useMouseInElement, useWindowScroll } from '@vueuse/core';
  import type { ArsenalItemJson } from '~/classes/ArsenalItem';

  const props = withDefaults(defineProps<{ isSub?: boolean }>(), {
    isSub: false
  });

  const toast = useToast();
  const { ctrl } = useMagicKeys();
  const arsenalStore = useArsenalStore();

  /* select correct items */
  const category = computed(() => {
    return props.isSub ? arsenalStore.selectedSubCategory : arsenalStore.selectedCategory
  });

  /* Refresh panel items when category is changed (some weird nuxt bug) */
  const refresh = ref(false);
  watch(category, () => {
    refresh.value = true;
    setTimeout(() => {
      refresh.value = false;
    }),
    1
  });
  
  /* Check if we are in edit mode */
  const isEditMode = computed((): boolean => {
    return arsenalStore.mode == ArsenalMode.edit
  });

  /* Save loadout on drag finish */
  const onDrop = (): void => {
    arsenalStore.saveLoadout();
  };

  /* Paste Item */
  const pasteItem = () => {
    if (!arsenalStore.clipboard) return;

    /* Generate new item */
    const newItem: ArsenalItemJson = {
      id: createId(),
      position: -1,
      title: arsenalStore.clipboard.title,
      description: arsenalStore.clipboard.description,
      preview: arsenalStore.clipboard.preview,
      categories: arsenalStore.clipboard.categories
    }

    let state;
    if (props.isSub) {
      state = arsenalStore.addSubItem(newItem);
    } else {
      state = arsenalStore.addItem(newItem);
    }

    toast.add({ title: `${ state ? 'Pasted' : 'Failed to paste' } ${ props.isSub ? 'subitem' : 'item' }: "${ arsenalStore.clipboard.title }"` });
    arsenalStore.saveLoadout();

    isContextMenuOpen.value = false;
  };

  /* Override Context Menu */
  const PanelRoot = ref<HTMLDivElement | null>(null);
  const isContextMenuOpen = ref(false);
  const { x, y } = useMouse();
  const { y: windowY } = useWindowScroll();
  const virtualElement = ref({ getBoundingClientRect: () => ({}) });

  const { isOutside } = useMouseInElement(PanelRoot);

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
</script>