<template>
  <UModal v-model="isOpen" class="modal">
    <UForm ref="formEl" :state="state" :schema="schema" class="modal-body" @submit="onSubmit">
      <UFormGroup label="Displayname" name="displayname">
        <UInput v-model="state.display_name" name="displayname" />
      </UFormGroup>
      <UFormGroup label="Biography" name="biography">
        <UTextarea v-model="state.biography" name="biography" />
      </UFormGroup>
      <UFormGroup label="Avatar" name="avatar">
        <UiAvatarUpload v-model:value="state.avatar" v-model:preview="user_meta.avatar" />
      </UFormGroup>
      <div class="button-group">
        <UButton color="red" @click="isOpen = false">Cancel</UButton>
        <UButton type="submit" :class="{ loading: isSaving }">Save<div class="loader"></div></UButton>
      </div>
    </UForm>
  </UModal>
</template>

<script lang="ts" setup>
  import loadoutTemplates from '@/content/loadoutTemplates.json';
  import { mixed, object, string, type InferType } from 'yup';
  import type { FormSubmitEvent } from '#ui/types'

  const user = useUser();
  const toast = useToast();

  const isOpen = defineModel('isOpen', { default: true });
  const isSaving = defineModel<boolean>('isSaving', { default: false });
  const user_meta = defineModel<any>('userMeta', { required: true });
  
  const templates = ref(loadoutTemplates);

  const schema = object({
    display_name: string().min(2).max(255).required('Required'),
    biography: string().min(2).max(1024).required('Required'),
    avatar: mixed<File>().test('fileSize', 'The file cannot exceed 8MB.', (file: File | undefined) => {
      if (!file) return true;
      return file.size <= 8_000_000;
    }).test('fileType', 'The file must be an image', (file: File | undefined) => {
      if (!file) return true;
      return file.type.includes('image/');
    })
  });

  type Schema = InferType<typeof schema>
  
  const formEl = ref();
  const state = reactive({
    display_name: user_meta.value.display_name,
    biography: user_meta.value.biography,
    avatar: undefined
  });
  const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    if (isSaving.value) return;
    isSaving.value = true;

    formEl.value.clear();

    if (event.data.avatar) {
      const file = new File(
        [event.data.avatar], 
        `profile-${ user.value!.id }`, 
        { type: event.data.avatar.type }
      );
      const upload = useUpload('/api/user/uploadAvatar', { method: 'PUT' });
      const blob = await upload(file);

      event.data.avatar = `/images/${ blob.pathname }` as any; // any to suppress error
    } else {
      event.data.avatar = user_meta.value.avatar;
    }

    $fetch('/api/user/set', {
      method: 'POST',
      body: JSON.stringify(event)
    }).then(() => {
      user_meta.value.display_name = event.data.display_name;
      user_meta.value.biography = event.data.biography;
      user_meta.value.avatar = event.data.avatar;
      isSaving.value = false;
      isOpen.value = false;
      
    }).catch((e: any) => {
      return toast.add({ title: 'Error', description: e.message, color: "red" });
    });
  }
</script>