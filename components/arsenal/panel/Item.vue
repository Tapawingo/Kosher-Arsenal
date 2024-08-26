<template>
  <div class="item" :class="selectedClass" @click="toggleItem()" @contextmenu.prevent="onContextMenu" ref="ItemRoot">
    <div class="title">

      <div v-if="arsenalStore.mode == ArsenalMode.buylist" class="checkbox" @click.stop>
        <input type="checkbox"/>
        <span class="checkbox-checkmark"></span>
      </div>

      <span>{{ item.title }}</span>

      <div class="buylist-content" v-if="arsenalStore.mode == ArsenalMode.buylist">
        <UTooltip class="tooltip buylist-store" text="Go to Store" :popper="{ placement: 'bottom' }" :ui="classOverride" v-if="newItemStore">
          <Icon name="material-symbols:storefront" @click.stop />
        </UTooltip>
        <UTooltip class="tooltip buylist-price" text="Price" :popper="{ placement: 'bottom' }" :ui="classOverride" v-if="newItemPrice">
          {{ newItemPrice }}
        </UTooltip>
      </div>

    </div>
    <div v-if="item.preview.path" class="preview">
      <NuxtImg :src="item.preview.path" />
    </div>
    <div class="body" @click.stop>{{ item.description }}</div>
  </div>

  <UContextMenu v-model="isContextMenuOpen" :virtual-element="virtualElement" :ui="{ background: '', ring: '', shadow: '', rounded: '' }">
    <div class="context-menu" v-if="arsenalStore.mode == ArsenalMode.edit">
      <div @click="isEditOpen = true">Edit</div>
      <div @click="deleteItem">Delete</div>
    </div>
    <div class="context-menu" v-if="arsenalStore.mode == ArsenalMode.buylist">
      <div @click="buylistEditMode = 'store'; isBuylistModalOpen = true">Edit Store</div>
      <div @click="buylistEditMode = 'price'; isBuylistModalOpen = true">Edit Price</div>
    </div>
  </UContextMenu>

  <ArsenalModalItem
    submit-label="Update"
    v-model:is-open="isEditOpen" 
    v-model:title="newItemTitle" 
    v-model:description="newItemDescription" 
    v-model:preview="newItemPreview"
    @submit="onEditSubmit"
  />

  <UModal v-model="isBuylistModalOpen" :ui="{ overlay: { background: 'bg-stone-600/75' }, background: '', ring: '' }">
    <div class="modal">
      <UFormGroup label="Store Link" v-if="buylistEditMode == 'store'">
        <UInput type="url" v-model="newItemStore" />
      </UFormGroup>

      <UFormGroup label="Price" required v-if="buylistEditMode == 'price'">
        <UInput type="number" v-model="newItemPrice" />
      </UFormGroup>

      <div class="button-group" style="justify-content: flex-end">
        <UButton label="close" color="red" @click="isBuylistModalOpen = false"/>
      </div>
    </div>
  </UModal>
</template>

<script lang="ts" setup>
  import { useMouse, useWindowScroll, useMouseInElement, useMagicKeys } from '@vueuse/core'
  import { type ArsenalItemJson } from '~/classes/ArsenalItem';
  import { storeToRefs } from 'pinia'
  import { ArsenalMode } from '~/stores/arsenal';

  /* @TODO: https://ui.nuxt.com/components/select-menu#creatable */
  /* @TODO: Quantity selection as item type */
  
  const props = withDefaults(defineProps<{item: ArsenalItemJson, isSub?: boolean}>(), {
    isSub: false
  });

  const { ctrl } = useMagicKeys();
  const toast = useToast();
  const confirmationBox = useConfirmationBox();
  const arsenalStore = useArsenalStore();
  const { selectedItem, selectedSubItem } = storeToRefs(arsenalStore)

  /* Edit Modal Refs */
  const isEditOpen = ref(false);
  const newItemTitle = ref(props.item.title);
  const newItemDescription = ref(props.item.description);
  const newItemPreview = ref(props.item.preview);
  
  /* Item select state */
  const itemState = ref(false);
  const selectedClass = reactive({
    selected: itemState,
    "sub-item": props.isSub,
    draggable: ctrl
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

  /* Override tooltip styles */
  const classOverride = {
    background: '',
    base: "arsenal-tooltip",
    ring: '',
    color: "white"
  };

  /* Set buylist data */
  // API for currency conversion:
  // https://www.exchangerate-api.com/docs/free
  const isBuylistModalOpen = ref(false);
  const buylistEditMode = ref<'store' | 'price'>('store');
  const itemChecked = ref(false);
  const newItemStore = ref<string | undefined>();
  const newItemPrice = ref<number | undefined>();

  if (arsenalStore.mode == ArsenalMode.buylist) {
    const buylistItem = arsenalStore.getBuylistItem(props.item.id);

    if (buylistItem) {
      newItemStore.value = buylistItem.storeLink;
      newItemPrice.value = buylistItem.price.price;
      itemChecked.value = buylistItem.purchased;
    };
  }

  /* Override Context Menu */
  const ItemRoot = ref<HTMLDivElement | null>(null);
  const isContextMenuOpen = ref(false);
  const { x, y } = useMouse();
  const { y: windowY } = useWindowScroll();
  const virtualElement = ref({ getBoundingClientRect: () => ({}) });

  const { isOutside } = useMouseInElement(ItemRoot);

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

  /* Delete Item */
  const deleteItem = () => {
    
    confirmationBox.open({
      title: 'Delete Item',
      description: `Are you sure you want to delete "${ props.item.title }"?`,
      submitLabel: 'Yes',
      cancelLabel: 'No',
      submitCallback: () => {
        /* Close panel */
        if (selectedItem.value == props.item) {
          selectedItem.value = null;
        };
    
        /* Remove item from loadout */
        let state = false;
        if (!props.isSub) {
          state = arsenalStore.removeItem(props.item.id);
        } else {
          state = arsenalStore.removeSubItem(props.item.id);
        }
    
        toast.add({ title: `${ state ? 'Deleted' : 'Failed to delete' } ${ props.isSub ? 'subitem' : 'item' }: "${ props.item.title }"` });
        isContextMenuOpen.value = false;
      }
    })
  }

  /* Edit Item */
  const onEditSubmit = async () => {
    props.item.title = newItemTitle.value;
    props.item.description = newItemDescription.value;
    props.item.preview = newItemPreview.value;
  };
</script>

<style lang="scss">
  @import "@/assets/styles/item.scss";
</style>