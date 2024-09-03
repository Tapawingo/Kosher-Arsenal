<template>
  <UModal class="arsenal-modal" v-model="isPreviewModalOpen" :ui="{ overlay: { background: 'bg-stone-600/75' }, background: '', ring: '' }">
    <form class="arsenal-modal-body" @submit.prevent="onSubmit">
      <UFormGroup label="Upload Image" required>
        <div class="preview-upload">
        <input name="files" type="file" @change="onFileChange" accept="image/*">
        <UContainer class="preview-upload-preview">
          <NuxtImg :src="previewUrl" alt="Preview" v-if="previewUrl" />
          <p v-else>Preview</p>
        </UContainer>
      </div>
      </UFormGroup>
      <div class="button-group">
        <UButton label="Cancel" color="red" @click="isPreviewModalOpen = false"/>
        <UButton label="Upload" type="submit"/>
      </div>
    </form>
  </UModal>
</template>

<script lang="ts" setup>
  const toast = useToast();
  const isPreviewModalOpen = defineModel<boolean>();
  const types = ref(['Figure', 'Background'])
  const arsenalStore = useArsenalStore();

  const files = ref<File | undefined>();
  const type = ref<string>('Figure');
  isPreviewModalOpen.value = false;

  const previewUrl = ref('');

  const onFileChange = (event: any) => {
    files.value = event.target.files[0];
    if (!files.value) return false;
    if (!files.value.type.match('image.*')) return false;

    const reader = new FileReader();
    reader.onload = (event) => {
      previewUrl.value = event.target?.result as string;
    }

    reader.readAsDataURL(files.value);
  }

  const onSubmit = async () => {
    if (!files.value) return;

    const upload = useUpload('/api/loadout/preview', { method: 'PUT' });
    const blob = await upload(files.value);

    arsenalStore.loadout.preview.path = `/images/${ blob.pathname }`;
    isPreviewModalOpen.value = false;
    arsenalStore.saveLoadout();
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
    max-height: 30rem;
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