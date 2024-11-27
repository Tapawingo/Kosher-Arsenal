<template>
  <div class="email-modal" v-if="isOpen">
    <UForm ref="formEl" :state="state" :schema="schema" class="modal-body" @submit="onSubmit">
      <h1>Please add your email address</h1>
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" name="email" />
      </UFormGroup>
      <div class="button-group">
        <UButton type="submit">Save</UButton>
      </div>
    </UForm>
  </div>
</template>

<script lang="ts" setup>
  import loadoutTemplates from '@/content/loadoutTemplates.json';
  import { object, string, type InferType } from 'yup';
  import type { FormSubmitEvent } from '#ui/types'

  const toast = useToast();
  const isOpen = ref(true);

  const schema = object({
    email: string().min(2).max(255).email('Invalid email')
  });

  type Schema = InferType<typeof schema>
  
  const formEl = ref();
  const state = reactive({
    email: undefined
  });

  const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    formEl.value.clear();

    const result = await useFetch("/api/user/addMail", {
      method: "POST",
      body: JSON.stringify(event)
    });

    if (result.error.value) {
      formEl.value.setErrors(result.error.value.data?.message);
      return toast.add({ title: 'Error', description: result.error.value.data?.message, color: "red" });
    } else {
      isOpen.value = false;
    }
  }
</script>

<style>
  .email-modal {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.487);
    display: flex;
    align-items: center;
    justify-content: center;

    & > form {
      width: 30%;
    }
  }
</style>