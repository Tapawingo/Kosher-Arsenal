<template>
	<section class="app-password-reset">
    <h1>New Password</h1>

    <UForm ref="formEl" :schema="schema" :state="state" @submit="onSubmit">
      <UFormGroup label="password" name="password">
        <UInput type="password" v-model="state.password" />
      </UFormGroup>

      <UButton type="submit">Submit</UButton>
    </UForm>
  </section>
</template>

<script lang="ts" setup>
  import { object, string } from 'yup';

  const schema = object({
    password: string()
    .min(8, "Must be at least 8 characters")
    .max(50, "Must not be longer than 50 characters")
    .required('Required')
  });
  
  const formEl = ref();
  const state = reactive({
    password: undefined
  });

  const route = useRoute();
  const apiRoute = `/api/auth/password-reset/${ route.params.token }`;

  const onSubmit = async (e: Event) => {
    await $fetch(apiRoute, {
      method: "POST",
      body: {
        password: state.password
      },
      redirect: "manual"
    });
    await navigateTo("/");
  };
</script>

<style lang="scss">
  section.app-password-reset {
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

    form p {
      margin-top: 5px;
      font-size: small;
      text-align: center
    }
  }

  section.app-password-reset > form {
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
</style>