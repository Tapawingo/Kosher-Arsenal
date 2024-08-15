<template>
  <div class="item" :class="selectedClass" @click="toggleItem()" @contextmenu.prevent="onContextMenu" ref="ItemRoot">
    <div class="item-title">
      <div v-if="arsenalStore.mode == ArsenalMode.buylist" class="item-checkbox" @click.stop>
        <input type="checkbox"/>
        <span class="item-checkbox-checkmark"></span>
      </div>
      <div>{{ item.title }}</div>
    </div>
    <div v-if="item.preview.path" class="item-preview">
      <NuxtImg :src="item.preview.path" />
    </div>
    <div class="item-content" @click.stop>{{ item.description }}</div>
  </div>

  <UContextMenu v-model="isContextMenuOpen" :virtual-element="virtualElement" :ui="{ background: '', ring: '', shadow: '', rounded: '' }">
    <div class="context-menu">
      <div @click="isModalOpen = true">Edit</div>
      <div @click="deleteItem">Delete</div>
    </div>
  </UContextMenu>

  <UModal v-model="isModalOpen" :ui="{ overlay: { background: 'bg-stone-600/75' }, background: '', ring: '' }">
    <div class="modal">
      <UFormGroup label="Item Title" required>
        <UInput v-model="newItemTitle" />
      </UFormGroup>

      <UFormGroup label="Description" required>
        <UTextarea autoresize v-model="newItemDescription" />
      </UFormGroup>

      <UFormGroup label="Image">
        <div class="item-preview-upload">
        <input type="file" @change="onFileChange" @input="handleFileInput" accept="image/*">
        <UContainer class="item-preview-upload-preview">
          <div class="panel">
            <div class="item faded">
              <div class="item-title">
                <div>Example Item 1</div>
              </div>
            </div>
            <div class="item">
              <div class="item-title">
                <div>{{ newItemTitle }}</div>
              </div>
              <div v-if="newItemPreviewPath" class="fake-item-preview">
                <NuxtImg :src="newItemPreviewPath" />
              </div>
            </div>
            <div class="item faded">
              <div class="item-title">
                <div>Example Item 2</div>
              </div>
            </div>
          </div>
        </UContainer>
      </div>
      </UFormGroup>

      <div class="button-group">
        <UButton label="Cancel" color="red" @click="isModalOpen = false"/>
        <UButton label="Add" @click="updateItem" />
      </div>
    </div>
  </UModal>
</template>

<script lang="ts" setup>
  const { handleFileInput, files } = useFileStorage()
  import { useMouse, useWindowScroll, useMouseInElement } from '@vueuse/core'
  import { type ArsenalItemJson } from '~/classes/ArsenalItem';
  import { storeToRefs } from 'pinia'
  import { ArsenalMode } from '~/stores/arsenal';

  /* @TODO: https://ui.nuxt.com/components/select-menu#creatable */
  /* @TODO: Quantity selection as item type */
  /* @TODO: Buylist Store link (icon on right) */
  /* @TODO: Buylist Price (right of store link) */
  
  const props = withDefaults(defineProps<{item: ArsenalItemJson, isSub?: boolean}>(), {
    isSub: false
  });

  const arsenalStore = useArsenalStore();
  const { selectedItem, selectedSubItem } = storeToRefs(arsenalStore)

  const itemState = ref(false);
  const isModalOpen = ref(false);
  const itemChecked = ref(false);
  const newItemTitle = ref(props.item.title);
  const newItemDescription = ref(props.item.description);
  const newItemPreviewPath = ref(props.item.preview.path);
  const ItemRoot = ref<HTMLDivElement | null>(null);
  const selectedClass = reactive({
    selected: itemState,
    "sub-item": props.isSub
  })

  const toast = useToast()

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
    if (arsenalStore.mode != ArsenalMode.edit) return;

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

  const deleteItem = () => {
    /* @TODO: prompt for verification */

    /* Close panel */
    if (selectedItem.value == props.item) {
      selectedItem.value = null;
    };

    let state = false;
    if (!props.isSub) {
      state = arsenalStore.removeItem(props.item.id);
    } else {
      state = arsenalStore.removeSubItem(props.item.id);
    }
    
    if (state) {
      toast.add({ title: `Deleted item: "${ props.item.title }"` });
    } else {
      toast.add({ title: `Failed to delete item: "${ props.item.title }"` });
    }

    isContextMenuOpen.value = false;
  }

  const onFileChange = (event: any) => {
    console.log('file change')
    const file = event.target.files[0]
    console.log(file)
    if (!file) return false;
    if (!file.type.match('image.*')) return false;

    const reader = new FileReader()
    reader.onload = (event) => {
      newItemPreviewPath.value = event.target?.result as string
    }

    reader.readAsDataURL(file)
  }

  const updateItem = async () => {
    let previewImage = ``;
    if (files.value.length > 0) {
      let filename = await $fetch('/api/uploadPreview', {
          method: 'POST',
          body: {
              files: files.value
          }
      })
      previewImage = `previews/${ filename }`;
    }

    props.item.title = newItemTitle.value;
    props.item.description = newItemDescription.value;
    props.item.preview = new ArsenalPreviewImage({ path: `previews/${ previewImage }` }).toJSON();

    isModalOpen.value = false;
  };
</script>

<style lang="scss">
  .item {
    background-color: rgba(85, 85, 85, 0.6);
    margin-bottom: 1px;
    cursor: pointer;
    user-select: none;
    position: relative;
    overflow: visible;
    
    .item-title {
      text-overflow: ellipsis;
      padding: 1.25rem 0.5rem 1.25rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      height: 4rem;
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

    .item-preview {
      position: absolute;
      top: 0;
      background-color: rgba(79, 79, 79, 0.6);
      border: 1px solid black;
      border-radius: 0px 3px 3px 0px;
      border-left: none;
      transition-property: width, height, opacity;
      transition-duration: 0.25s;
      transition-timing-function: linear;
      opacity: 0;
      height: 4rem;
      width: 4rem;
      left: 100%;

      img {
        object-fit: contain;
        transition-property: height;
        transition-duration: 0.25s;
        transition-timing-function: linear;
        height: 4rem;
        width: 10rem;
      }
    }
      
    &.sub-item .item-preview {
      border-right: none;
      border-left: 1px solid black;
      border-radius: 3px 0px 0px 3px;
      left: auto;
      right: 100%;
    }

    &:hover .item-preview {
      opacity: 1;
    }

    &.selected .item-preview {
      width: 10rem;
      height: 10rem;
      opacity: 1;

      img {
        height: 10rem;
        width: 10rem;
      }
    }

    &.selected .item-title {
      background-color: rgba(255, 255, 255, 0.25);
    }

    &.selected .item-content {
      padding: 0.5rem;
      height: 6rem;
    }
  }

  .item-checkbox {
    position: relative;
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    user-select: none;

    input[type=checkbox] {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    input[type=checkbox]:checked ~ .item-checkbox-checkmark {
      background-color: #2196F3;
    }

    input[type=checkbox]:checked ~ .item-checkbox-checkmark:after {
      display: block;
    }

    .item-checkbox-checkmark {
      position: absolute;
      top: 0;
      left: 0;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 3px;
      border: 1px solid black;
      background-color: transparent;

      &:hover {
        background-color: rgba(255, 255, 255, 0.25);
      }

      &:after {
        content: "";
        position: absolute;
        display: none;

        left: 9px;
        top: 5px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
      }
    }
  }
  
</style>