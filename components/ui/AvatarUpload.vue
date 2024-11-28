<template>
  <div class="ui-avatar-upload">
    <UContainer class="ui-avatar-preview">
      <img :src="avatarPreview" alt="Preview" v-if="avatarPreview" />
      <p v-else>Preview</p>
    </UContainer>
    <input name="avatar" type="file" @change="onFileChange" accept="image/*" />
  </div>
</template>

<script lang="ts" setup>
  const emit = defineEmits(['change']);
  const avatar = defineModel<File>('value');
  const avatarPreview = defineModel<string>('preview');

  const onFileChange = (event: any) => {
    const file = event.target.files[0];
    avatar.value = file;
    if (!file) return false;
    if (!file.type.match('image.*')) return false;

    const reader = new FileReader();
    reader.onload = (event) => {
      avatarPreview.value = event.target?.result as string;
    }

    reader.readAsDataURL(file);
    emit('change');
  }
</script>

<style lang="scss">
  .modal-body .ui-avatar-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(16, 18, 20);
    border: 1px solid rgb(68, 68, 68);
    border-bottom: none;
    border-radius: 0.5rem;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    padding: 1rem;
    width: 100%;
    height: 12rem;

    img {
      border-radius: 50%;
      height: 10rem;
      width: 10rem;
    }
  }

  .modal-body .ui-avatar-upload {
    input {
      width: 100%;
      border-radius: 0.5rem;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }
</style>