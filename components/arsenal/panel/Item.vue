<template>
  <div class="item" :class="selectedClass" @click="toggleItem()" @contextmenu.stop.prevent="onContextMenu" ref="ItemRoot">
    <div class="title">

      <div v-if="arsenalStore.isBuylistMode()" class="checkbox" @click.stop="isChecked = !isChecked; onbuylistSubmit()">
        <input type="checkbox" :checked="isChecked"/>
        <span class="checkbox-checkmark"></span>
      </div>

      <span>{{ item.title }}</span>

      <div class="buylist-content" v-if="arsenalStore.isBuylistMode()">
        <UTooltip class="tooltip buylist-store" text="Go to Store" :popper="{ placement: 'bottom' }" :ui="classOverride" v-if="buylistItem.store">
          <Icon name="material-symbols:storefront" @click.stop="openStore" />
        </UTooltip>
        <UTooltip class="tooltip buylist-price" text="Price" :popper="{ placement: 'bottom' }" :ui="classOverride" v-if="buylistItem.price.price > 0">
          {{ buylistItem.price.price.toFixed(2) }} {{ currencies.find(currency => currency.code === buylistItem.price.currency)?.symbol }}
        </UTooltip>
      </div>

    </div>
    <div v-if="item.preview.path" class="preview">
      <img :src="item.preview.path" alt="Preview" />
    </div>
    <div class="body" @click.stop>{{ item.description }}</div>
  </div>

  <UContextMenu v-model="isContextMenuOpen" :virtual-element="virtualElement" :ui="{ background: '', ring: '', shadow: '', rounded: '' }">
    <div class="context-menu" v-if="arsenalStore.isEditMode()">
      <div @click="isEditOpen = true">Edit</div>
      <div @click="onCopy">Copy</div>
      <div @click="deleteItem">Delete</div>
    </div>
    <div class="context-menu" v-if="arsenalStore.isBuylistMode()">
      <div @click="onOpenModal('store'); isContextMenuOpen = false">Edit Store</div>
      <div @click="onOpenModal('price'); isContextMenuOpen = false">Edit Price</div>
    </div>
  </UContextMenu>

  <ArsenalModalItem
    submit-label="Update"
    v-model:is-open="isEditOpen"
    v-model:is-saving="isEditSaving"
    v-model:form-data="itemModalData"
    v-model:item="props.item"
    @submit="onEditSubmit"
  />

  <UModal class="arsenal-modal" v-model="isBuylistModalOpen" :ui="{ overlay: { background: 'bg-stone-600/75' }, background: '', ring: '' }">
    <form class="arsenal-modal-body" @submit.prevent="onbuylistSubmit">
      <UFormGroup label="Store Link" v-if="buylistEditMode == 'store'">
        <UInput type="url" v-model="newItemStore" />
      </UFormGroup>

      <UFormGroup class="price" label="Price" required v-if="buylistEditMode == 'price'">
        <UInput type="number" v-model="newItemPrice" />
        <UiSelectMenu
          :options="currencies" 
          v-model="newItemCurrency" 
          option-attribute="code"
          searchable
          :search-attributes="['code']"
        />
      </UFormGroup>

      <div class="button-group">
        <UButton label="Cancel" color="red" @click="onClose"/>
        <UButton label="Save" type="submit" />
      </div>
    </form>
  </UModal>
</template>

<script lang="ts" setup>
  import { useMouse, useWindowScroll, useMouseInElement, useMagicKeys } from '@vueuse/core'
  import { type ArsenalItemJson } from '~/classes/ArsenalItem';
  import { storeToRefs } from 'pinia'
  import currencies from '@/content/currencies.json';

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
  const itemModalData = ref({
    title: '',
    description: '',
    preview: new ArsenalPreviewImage().toJSON(),
    previewFile: undefined
  });
  
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
  const buylistItem = ref(arsenalStore.getBuylistItem(props.item.id));
  const buylistEditMode = ref<'store' | 'price'>('store');
  const newItemStore = ref<string>('');
  const newItemPrice = ref<number>(0);
  const newItemCurrency = ref<any>();

  /* Buylist logic */
  const isChecked = ref(false);

  const fetchBuylist = () => {
    if (buylistItem) {
      newItemStore.value = buylistItem.value.store;
      newItemPrice.value = buylistItem.value.price.price;
      isChecked.value = buylistItem.value.owned;
    }
  }

  const onOpenModal = (mode: "store" | "price") => {
    buylistEditMode.value = mode;
    isBuylistModalOpen.value = true;

    newItemStore.value = buylistItem.value.store;
    newItemPrice.value = buylistItem.value.price.price;

    const currencyIndex = currencies.findIndex(currency => currency.code === buylistItem.value.price.currency);
    newItemCurrency.value = currencyIndex === -1 ? 2 : currencyIndex;
  }

  const onbuylistSubmit = () => {
    buylistItem.value.owned = isChecked.value;
    
    if (buylistEditMode.value === 'price') {
      const currency = currencies[newItemCurrency.value]?.code;
      buylistItem.value.price.price = newItemPrice.value ? newItemPrice.value : 0;
      buylistItem.value.price.currency = currency ? currency : '';
    } else if (buylistEditMode.value === 'store') {
      buylistItem.value.store = newItemStore.value ? newItemStore.value : '';
    }

    arsenalStore.setBuylistItem(buylistItem.value);
    isBuylistModalOpen.value = false;
  }

  const openStore = () => {
    let url = !buylistItem.value.store!.includes('http') ? `http://${ buylistItem.value.store }` : buylistItem.value.store;
    navigateTo(url, {
      external: true,
      open: {
        target: '_blank'
      }
    });
  }

  /* Handle modal closing */
  const onClose = async () => {
    isBuylistModalOpen.value = false;
  };

  /* Override Context Menu */
  const ItemRoot = ref<HTMLDivElement | null>(null);
  const isContextMenuOpen = ref(false);
  const { x, y } = useMouse();
  const { y: windowY } = useWindowScroll();
  const virtualElement = ref({ getBoundingClientRect: () => ({}) });

  const { isOutside } = useMouseInElement(ItemRoot);

  onMounted(async () => {
    document.addEventListener('contextmenu', () => {
      if (isOutside.value) { 
        isContextMenuOpen.value = false 
      }; 
    });

    /* Fetch buylist status */
    fetchBuylist();
  });

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
        arsenalStore.saveLoadout();
        isContextMenuOpen.value = false;
      }
    })
  }

  /* Edit Item */
  const isEditSaving = ref(false);
  const onEditSubmit = async () => {
    props.item.title = itemModalData.value.title;
    props.item.description = itemModalData.value.description;
    props.item.preview = itemModalData.value.preview;
    arsenalStore.saveLoadout();

    isEditOpen.value = false;
  };

  /* Copy Item */
  const onCopy = () => {
    arsenalStore.clipboard = props.item;
    isContextMenuOpen.value = false;
    toast.add({ title: `Copied Item` });
  }
</script>

<style lang="scss">
  .arsenal-modal-body .price .relative {
    width: 100%;
    display: flex;

    & > input[type=number] {
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
      border-right: none;
    }

    & > .ui-select {
      width: 20%;
      min-width: 4.5rem;
      
      & > .ui-select-button {
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
      }
    }
  }
</style>