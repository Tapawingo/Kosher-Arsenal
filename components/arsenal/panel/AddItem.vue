<template>
  <UTooltip class="item-tooltip" text="Add Item" :popper="{ placement: 'bottom' }" :ui="classOverride">
    <div class="item add-item" @click="isOpen = true">
      <div class="item-title">
        <NuxtImg src="arsenal/icons/icon_plus.svg"/>
      </div>
    </div>
  </UTooltip>

  <UModal v-model="isOpen" :ui="{ overlay: { background: 'bg-stone-600/75' }, background: '', ring: '' }">
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
        <UButton label="Cancel" color="red" @click="isOpen = false"/>
        <UButton label="Add" @click="addItem" />
      </div>
    </div>
  </UModal>
</template>

<script lang="ts" setup>
  const props = withDefaults(defineProps<{isSub?: boolean}>(), {
    isSub: false
  });
  
  const { handleFileInput, files } = useFileStorage()
  const arsenalStore = useArsenalStore();
  const toast = useToast()

  const isOpen = ref(false);
  const newItemTitle = ref('');
  const newItemDescription = ref('');
  const newItemPreviewPath = ref('');

  const onFileChange = (event: any) => {
    const file = event.target.files[0]
    if (!file) return false;
    if (!file.type.match('image.*')) return false;

    const reader = new FileReader()
    reader.onload = (event) => {
      newItemPreviewPath.value = event.target?.result as string
    }

    reader.readAsDataURL(file)
  }
  
  const classOverride = {
    background: '',
    base: "arsenal-tooltip",
    ring: '',
    color: "white"
  };

  const addItem = async () => {
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

    const newItem = new ArsenalItem({
      title: newItemTitle.value,
      description: newItemDescription.value,
      preview: new ArsenalPreviewImage({ path: previewImage })
    });
    
    if (props.isSub) {
      let state = arsenalStore.addSubItem(newItem);
      toast.add({ title: `${ state ? 'Added' : 'Failed to add' } subitem: "${ newItemTitle.value }"` });
    } else {
      let state = arsenalStore.addItem(newItem);
      toast.add({ title: `${ state ? 'Added' : 'Failed to add' } item: "${ newItemTitle.value }"` });
    }

    newItemTitle.value = '';
    newItemDescription.value = '';
    newItemPreviewPath.value = '';
    isOpen.value = false;
  }
</script>

<style lang="scss">
  .item-tooltip {
    width: 100%;
    display: block;
  }

  .add-item {
    padding: 0rem;
    background-color: transparent;
    background-image: linear-gradient(rgba(85, 85, 85, 0.6) 25%, transparent);
    
    .item-title {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0rem;

      img {
        height: 4rem;
      }
    }
  }

  .item-preview-upload {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .item-preview-upload-preview {
    border: 1px dashed rgb(130, 130, 130);
    background-color: rgb(168, 162, 158);
    background-size: 40px 40px;
    background-image: radial-gradient(circle, #1c1917 1px, rgba(0, 0, 0, 0) 1px);
    border-radius: 5px;
    width: 100%;
    height: 18rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1px;

    p {
      color: rgb(174, 174, 174);
    }

    .panel {
        background-color: rgba(85, 85, 85, 0.6);
        border: 1px solid rgb(0, 0, 0);
        height: 80%;
    }

    .item {
      width: 20rem;
      height: 4rem;

      &.faded {
        opacity: 0.25;
      }
    }
  }

  .fake-item-preview {
    position: absolute;
      top: 0;
      background-color: rgba(79, 79, 79, 0.6);
      border: 1px solid black;
      border-radius: 0px 3px 3px 0px;
      border-left: none;
      width: 4rem;
      height: 4rem;
      left: 100%;

    img {
      object-fit: contain;
      transition-property: height;
      transition-duration: 0.25s;
      transition-timing-function: linear;
      height: 4rem;
      width: 4rem;
    }
  }
</style>