<template>
  <section class="app-password-reset">
    <h1>Reset password</h1>

    <UForm ref="formEl" :schema="schema" :state="state" @submit="onSubmit">
      <UFormGroup label="email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>
      <p v-if="statusMessage">{{ statusMessage }}</p>

      <UButton type="submit">Submit</UButton>
    </UForm>
  </section>
</template>

<script lang="ts" setup>
import { object, string } from 'yup';

const schema = object({
    email: string()
    .email('Invalid Email')
    .required('Required')
  });
  
  const formEl = ref();
  const state = reactive({
    email: undefined
  });


  const statusMessage = ref('');
  const onSubmit = async (e: Event) => {
    $fetch("/api/auth/password-reset", {
      method: "POST",
      body: {
        email: state.email
      },
      redirect: "manual"
    }).then(() => {
      statusMessage.value = `Email with instructions sent to ${ state.email }!`;
    }).catch((e: any) => {
      statusMessage.value = e;
    });
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