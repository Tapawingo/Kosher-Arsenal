<template>
  <UModal class="arsenal-modal" v-model="isPreviewModalOpen" :ui="{ overlay: { background: 'bg-stone-600/75' }, background: '', ring: '' }">
    <div class="arsenal-modal-body">
      <UFormGroup label="Upload Image" required>
        <div class="preview-upload">
        <input type="file" @change="onFileChange" @input="handleFileInput" accept="image/*">
        <UContainer class="preview-upload-preview">
          <NuxtImg :src="previewUrl" alt="Preview" v-if="previewUrl" />
          <p v-else>Preview</p>
        </UContainer>
      </div>
      </UFormGroup>
      <div class="button-group">
        <UButton label="Cancel" color="red" @click="isPreviewModalOpen = false"/>
        <UButton label="Upload" @click="onSubmit"/>
      </div>
    </div>
  </UModal>
</template>

<script lang="ts" setup>
  const { handleFileInput, files } = useFileStorage()
  const isPreviewModalOpen = defineModel<boolean>();
  const types = ref(['Figure', 'Background'])
  const arsenalStore = useArsenalStore();

  const type = ref<string>('Figure');
  isPreviewModalOpen.value = false;

  const previewUrl = ref('');

  const onFileChange = (event: any) => {
    console.log('file change')
    const file = event.target.files[0]
    console.log(file)
    if (!file) return false;
    if (!file.type.match('image.*')) return false;

    const reader = new FileReader()
    reader.onload = (event) => {
      previewUrl.value = event.target?.result as string
    }

    reader.readAsDataURL(file)
  }

  const onSubmit = async () => {
    /* @TODO: Show progress thingy */
    const filename = await $fetch('/api/uploadPreview', {
        method: 'POST',
        body: {
            files: files.value
        }
    })

    arsenalStore.loadout.preview.path = `previews/${ filename }`;
    isPreviewModalOpen.value = false;
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