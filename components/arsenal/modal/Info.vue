<template>
  <UModal class="arsenal-modal" v-model="isOpen">
    <UForm :state="state" :schema="schema" class="arsenal-modal-body" @submit.prevent="onSubmit">
      <UFormGroup label="Title" required name="title">
        <UInput v-model="state.title" name="title" />
      </UFormGroup>

      <UFormGroup label="Description" required name="description">
        <UTextarea autoresize v-model="state.description" name="description" />
      </UFormGroup>

      <UFormGroup label="Tags" name="tags">
        <TagInput v-model:tags="state.tags"/>
      </UFormGroup>

      <UFormGroup label="Upload Image" name="preview">
        <div class="preview-upload">
          <input name="preview" type="file" @change="onFileChange" accept="image/*" />
          <UContainer class="preview-upload-preview">
            <img :src="previewUrl" alt="Preview" v-if="previewUrl" />
            <p v-else>Preview</p>
          </UContainer>
        </div>
      </UFormGroup>

      <div class="button-group">
        <UButton label="Cancel" color="red" @click="isOpen = false"/>
        <UButton type="submit" :class="{ loading: isSaving }">Save<div class="loader"></div></UButton>
      </div>
    </UForm>
  </UModal>
</template>

<script lang="ts" setup>
  import { array, mixed, object, ObjectSchema, string, type InferType } from 'yup';
  import type { LoadoutTagJson } from '~/classes/LoadoutTag';

  const arsenalStore = useArsenalStore();
  const emit = defineEmits(['submit']);

  const schema = object({
    title: string().min(2, 'Too short').max(255, 'Exceeds character limit').required('Required'),
    description: string().min(2, 'Too short').max(1024, 'Exceeds character limit').required('Required'),
    tags: array().required(),
    preview: mixed<File>().test('fileSize', 'The file cannot exceed 8MB.', (file: File | undefined) => {
      if (!file) return true;
      return file.size <= 8_000_000;
    }).test('fileType', 'The file must be an image', (file: File | undefined) => {
      if (!file) return true;
      return file.type.includes('image/');
    })
  });

  const isOpen = defineModel<boolean>('isOpen', { default: false });

  type Schema = InferType<typeof schema>
  const state = defineModel<Schema>('formData', { required: true, default: {
    title: '',
    description: '',
    tags: [],
    preview: undefined
  }});
  const previewUrl = ref(arsenalStore.loadout.preview.path);

  /* Update preview once loadout is fetched */
  arsenalStore.on('onLoadoutFetched', () => {
    previewUrl.value = arsenalStore.loadout.preview.path;
  });

  const onFileChange = (event: any) => {
    state.value.preview = event.target.files[0];
    if (!state.value.preview) return false;
    if (!state.value.preview.type.match('image.*')) return false;

    const reader = new FileReader();
    reader.onload = (event) => {
      previewUrl.value = event.target?.result as string;
    }

    reader.readAsDataURL(state.value.preview);
  }

  const isSaving = defineModel<boolean>('isSaving', { default: false });
  const onSubmit = async () => {
    if (isSaving.value) return;
    
    isSaving.value = true;
    emit('submit');
  }
</script>

<style lang="scss">
  .preview-upload {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .preview-upload-preview {
    border: 1px dashed rgb(0, 0, 0);
    background-color: rgb(168, 162, 158);
    background-size: 40px 40px;
    background-image: radial-gradient(circle, #1c1917 1px, rgba(0, 0, 0, 0) 1px);
    border-radius: 5px;
    width: 100%;
    max-height: 25rem;
    aspect-ratio: 1 / 1;
    display: flex;
    justify-content: center;
    align-items: center;

    p {
      color: rgb(0, 0, 0);
    }

    img {
      max-height: 90%;
      max-width: 90%;
    }
  }
</style>