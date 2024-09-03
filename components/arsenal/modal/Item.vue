<template>
    <UModal class="arsenal-modal" v-model="isOpen">
    <div class="arsenal-modal-body">
      <UFormGroup label="Item Title" required>
        <USelectMenu 
          v-model="itemPreset" 
          searchable
          creatable
          searchable-placeholder="Title..."
          :search-attributes="['title', 'alias']"
          :options="itemPresets ? itemPresets : []"
          option-attribute="title"
          @change="onTitleChange"
        />
      </UFormGroup>

      <UFormGroup label="Description" required>
        <UTextarea autoresize v-model="itemDescription" />
      </UFormGroup>

      <UFormGroup label="Image">
        <div class="preview-upload">
          <input type="file" @change="onFileChange" @input="handleFileInput" accept="image/*">
          <UContainer class="preview-container">
            <div class="panel">
              <div class="item faded">
                <div class="title">
                  <div>Example Item 1</div>
                </div>
              </div>
              <div class="item">
                <div class="title">
                  <div>{{ itemTitle }}</div>
                </div>
                <div v-if="itemPreviewView" class="fake-item-preview">
                  <NuxtImg :src="itemPreviewView" />
                </div>
              </div>
              <div class="item faded">
                <div class="title">
                  <div>Example Item 2</div>
                </div>
              </div>
            </div>
          </UContainer>
        </div>
      </UFormGroup>

      <div class="button-group">
        <UButton label="Cancel" color="red" @click="isOpen = false"/>
        <UButton :label="props.submitLabel" @click="onSubmit" />
      </div>
    </div>
  </UModal>
</template>

<script lang="ts" setup>
  import { type ArsenalPreviewImageJson } from '@/classes/ArsenalPreviewImage';

  const { handleFileInput, files } = useFileStorage();
  const { data: itemPresets } = useFetch<Array<Object>>('/api/getItemPresets', {
    lazy: true
  })

  const toast = useToast();

  const props = withDefaults(defineProps<{ submitLabel?: string }>(), { submitLabel: 'Add' });
  const emit = defineEmits(['submit']);
  const isOpen = defineModel('isOpen', { required: true, default: false });
  const itemTitle = defineModel('title', { required: false, default: '' });
  const itemDescription = defineModel('description', { required: false, default: '' });
  const itemPreview = defineModel<ArsenalPreviewImageJson>('preview', { required: false, default: { type: 0, path: '' } });
  const itemPreset = ref({ title: '', description: '', preview: { type: 0, path: '' } })
  const itemPreviewView = ref<string>('');

  /* Load preset if selected */
  const onTitleChange = () => {
    if (itemPreset.value.title) itemTitle.value = itemPreset.value.title;
    if (itemPreset.value.description) itemDescription.value = itemPreset.value.description;
    if (itemPreset.value.preview) {
      itemPreview.value = itemPreset.value.preview;
      itemPreviewView.value = itemPreset.value.preview.path;
    };
  }

  /* Change the preview image with the newly uploaded image */
  const onFileChange = (event: any) => {
    const file = event.target.files[0]
    if (!file) return false;
    if (!file.type.match('image.*')) return false;

    const reader = new FileReader()
    reader.onload = (event) => {
      itemPreviewView.value = event.target?.result as string
    }

    reader.readAsDataURL(file)
  }

  /* Upload image and emit submit event */
  const onSubmit = async (event: any) => {
    let previewImage: string = itemPreviewView.value;
    if (files.value.length > 0) {
      let filename = await $fetch('/api/uploadPreview', {
          method: 'POST',
          body: {
              files: files.value
          }
      })
      previewImage = `previews/${ filename }`;
    }
    
    itemPreview.value = new ArsenalPreviewImage({ path: previewImage });
    isOpen.value = false;

    emit('submit');
  };

  /* Update preview with the image path on modal open */
  watch(isOpen, () => {
    if (isOpen) {
      itemPreset.value.title = itemTitle.value;
      itemPreviewView.value = itemPreview.value.path;
    };
  })
</script>

<style lang="scss">
  .preview-upload {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .preview-container {
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

  .arsenal-modal-body .fake-item-preview {
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