<template>
    <UModal class="arsenal-modal" v-model="isOpen">
    <UForm :state="state" :schema="schema" class="arsenal-modal-body" @submit.prevent="onSubmit">
      <UFormGroup label="Item Title" required name="title">
        <UiInputAuto
          v-model="itemPreset"
          name="title"
          placeholder="Title..."
          :options="itemPresets ? itemPresets : []"
          :search-attributes="['title', 'alias']"
          option-attribute="title"
          @change="onTitleChange"
          creatable
        />
      </UFormGroup>

      <UFormGroup label="Description" required name="description">
        <UTextarea autoresize v-model="state.description" name="description" />
      </UFormGroup>

      <UFormGroup label="Image" name="preview">
        <div class="preview-upload">
          <input type="file" @change="onFileChange" accept="image/*" name="preview">
          <UContainer class="preview-container">
            <div class="panel">
              <div class="item faded">
                <div class="title">
                  <div>Example Item 1</div>
                </div>
              </div>
              <div class="item">
                <div class="title">
                  <div>{{ state.title }}</div>
                </div>
                <div v-if="previewUrl" class="fake-item-preview">
                  <NuxtImg :src="previewUrl" />
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
        <UButton label="Cancel" color="red" @click="onClose"/>
        <UButton :label="props.submitLabel" type="submit" />
      </div>
    </UForm>
  </UModal>
</template>

<script lang="ts" setup>
  import { createId } from '@paralleldrive/cuid2';
  import { ArsenalPreviewImage } from '@/classes/ArsenalPreviewImage';
  import type { ArsenalItemJson } from '~/classes/ArsenalItem';
  import { object, string, mixed, type InferType, number } from 'yup';

  const { data: itemPresets } = useFetch<Array<Object>>('/api/getItemPresets', {
    lazy: true
  });

  const schema = object({
    title: string().min(2, 'Too short').max(255, 'Exceeds character limit').required('Required'),
    description: string().min(2, 'Too short').max(1024, 'Exceeds character limit').required('Required'),
    previewFile: mixed<File>().test('fileSize', 'The file cannot exceed 8MB.', (file: File | undefined) => {
      if (!file) return true;
      return file.size <= 8_000_000;
    }).test('fileType', 'The file must be an image', (file: File | undefined) => {
      if (!file) return true;
      return file.type.includes('image/');
    }),
    preview: object({
      type: number(),
      path: string()
    })
  });

  const props = withDefaults(defineProps<{ submitLabel?: string }>(), { submitLabel: 'Add' });
  const emit = defineEmits(['submit']);

  const isOpen = defineModel('isOpen', { required: true, default: false });
  const item = defineModel<ArsenalItemJson>('item', { required: false, default: {
    title: undefined,
    description: undefined,
    preview: new ArsenalPreviewImage().toJSON()
  }});
  
  type Schema = InferType<typeof schema>
  const state = defineModel<Schema>('formData', { required: true });

  onMounted(() => {
    resetForm();
  });

  watch(isOpen, () => {
    if (!isOpen.value) {
      resetForm();
    }
  });

  const files = ref<File | undefined>();
  const itemPreset = ref({ title: '', description: '', preview: { type: 0, path: '' } })
  const previewUrl = ref<string>('');

  /* Load preset if selected */
  const onTitleChange = () => {
    if (itemPreset.value.title) state.value.title = itemPreset.value.title;
    if (itemPreset.value.description) state.value.description = itemPreset.value.description;
    if (itemPreset.value.preview) {
      state.value.preview = itemPreset.value.preview;
      previewUrl.value = itemPreset.value.preview.path;
    };
  }

  /* Change the preview image with the newly uploaded image */
  const onFileChange = (event: any) => {
    files.value = event.target.files[0]
    if (!files.value) return false;
    if (!files.value.type.match('image.*')) return false;

    const reader = new FileReader()
    reader.onload = (event) => {
      previewUrl.value = event.target?.result as string
    }

    reader.readAsDataURL(files.value)
  }

  /* Handle modal closing */
  const onClose = () => {
    isOpen.value = false;
    resetForm();
  };

  /* Clear form on close */
  const resetForm = () => {
    state.value.title = item.value.title ?? '';
    state.value.description = item.value.description ?? '';
    state.value.preview = item.value.preview;
    previewUrl.value = item.value.preview.path;
    itemPreset.value = { 
      title: item.value.title ?? '',
      description: item.value.description ?? '',
      preview: item.value.preview
    };
  };

  /* Upload image and emit submit event */
  const onSubmit = async (event: any) => {
    if (files.value) {
      const file = new File(
        [files.value], 
        `item-${ createId() }`, 
        { type: files.value.type }
      );
      const upload = useUpload('/api/loadout/preview', { method: 'PUT' });
      const blob = await upload(file);

      state.value.preview = new ArsenalPreviewImage({ path: `/images/${ blob.pathname }` });
    }
    
    emit('submit');
    isOpen.value = false;
  };
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