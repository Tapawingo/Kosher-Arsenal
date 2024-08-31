<template>
  <section class="app-signup">
    <h1>Sign In</h1>

    <UForm ref="formEl" :schema="schema" :state="state" @submit="onSubmit">
      <UFormGroup label="username" name="username">
        <UInput v-model="state.username" />
      </UFormGroup>
      <UFormGroup label="password" name="password">
        <UInput type="password" v-model="state.password" />
      </UFormGroup>

      <UButton type="submit">Submit</UButton>
    </UForm>

    <p>
      Don't have an account?
      <NuxtLink to="/signup">Sign up</NuxtLink>
    </p>
  </section>
</template>

<script lang="ts" setup>
  import { object, string, type InferType } from 'yup';
  import type { FormSubmitEvent } from '#ui/types'

  const toast = useToast();

  const schema = object({
    username: string()
    .min(3, "Must be at least 3 Characters")
    .max(30, "Must not be longer than 30 characters")
    .required('Required'),
    password: string()
    .min(8, "Must be at least 8 characters")
    .max(50, "Must not be longer than 50 characters")
    .required('Required')
  });
  
  type Schema = InferType<typeof schema>
  
  const formEl = ref();
  const state = reactive({
    username: undefined,
    password: undefined
  });

  const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    formEl.value.clear()
    const result = await useFetch("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify(event)
    });

    if (result.error.value) {
      formEl.value.setErrors(result.error.value.data?.message);

      return toast.add({ 
        title: "Error", 
        description: result.error.value.data?.message,
        color: "red"
      });
    }

    await navigateTo('/');
  }
</script>

<style lang="scss">
  /* @TODO: Add to style files */
  section.app-signup {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
      margin-bottom: 10px;
      font-size: 3rem;
      font-weight: 600;
    }
  }

  section.app-signup > form {
    width: 100%;
    max-width: 400px;

    & > * + * {
      margin-top: 1.5rem;
    }

    button {
      width: 100%;
      justify-content: center;
    }
  }

  section.app-signup > p {
    margin-top: 10px;
    font-size: small;
  }
</style>