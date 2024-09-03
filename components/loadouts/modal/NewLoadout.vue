<template>
  <UModal v-model="isOpen" class="modal">
    <UForm ref="formEl" :state="state" :schema="schema" class="modal-body" @submit="onSubmit">
      <UFormGroup label="Title" name="title">
        <UInput v-model="state.title" name="title" />
      </UFormGroup>
      <UFormGroup label="Description" name="description">
        <UTextarea v-model="state.description" name="description" />
      </UFormGroup>
      <UFormGroup label="Tags" name="tags">
        WIP
      </UFormGroup>
      <UFormGroup label="Category Template" name="template">
        <USelectMenu v-model="state.template" :options="templates" optionAttribute="name" name="template" />
      </UFormGroup>
      <UFormGroup label="Visibility" name="visibility">
        <USelectMenu v-model="state.visibility" :options="visibilityOptions" optionAttribute="name" value-attribute="value" name="visibility" />
      </UFormGroup>
      <div class="button-group">
        <UButton color="red" @click="isOpen = false">Cancel</UButton>
        <UButton type="submit">Create</UButton>
      </div>
    </UForm>
  </UModal>
</template>

<script lang="ts" setup>
  import loadoutTemplates from '@/content/loadoutTemplates.json';
  import { number, object, string, type InferType } from 'yup';
  import type { FormSubmitEvent } from '#ui/types'

  const user = useUser();
  const toast = useToast();

  const isOpen = defineModel('isOpen', { default: false });
  
  const templates = ref(loadoutTemplates);
  const visibilityOptions = ref([
    { name: 'Public', value: LoadoutVisibility.public },
    { name: 'Unlisted', value: LoadoutVisibility.unlisted },
    { name: 'Private', value: LoadoutVisibility.private }
  ]);

  const schema = object({
    title: string().min(2).max(255),
    description: string().min(2).max(1024),
    owner: string(),
    template: object(),
    preview: object().shape({
      type: number(),
      path: string().default('/arsenal/preview/default.png')
    }),
    visibility: number().oneOf([0, 1, 2])
  });

  type Schema = InferType<typeof schema>
  
  const formEl = ref();
  const state = reactive({
    title: undefined,
    description: undefined,
    owner: user.value?.id,
    template: templates.value[0],
    preview: { type: 0, path: '/arsenal/preview/default.png' },
    visibility: 0
  });

  const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    formEl.value.clear();

    const result = await useFetch("/api/loadout/new", {
      method: "POST",
      body: JSON.stringify(event)
    });

    if (result.error.value) {
      formEl.value.setErrors(result.error.value.data?.message);
      return toast.add({ title: 'Error', description: result.error.value.data?.message, color: "red" });
    }

    const arsenalStore = useArsenalStore();
    arsenalStore.setMode(ArsenalMode.edit);
    await navigateTo(`/loadout/${ result.data.value }`);
  }
</script>