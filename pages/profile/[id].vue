<template>
  <ModalProfile v-model:user-meta="user_meta" v-model:is-open="isEditModalOpen" />
  <div class="page-profile">
    <header>
      <img :src="user_meta?.avatar" alt="Avatar">
      <div class="meta">
        <div class="name">
          <div class="username">
            <h1>{{ user_meta?.display_name }}</h1>
            <sub>@{{ user_meta?.username }}</sub>
          </div>
          <button v-if="user?.id === user_meta?.user_id" @click="isEditModalOpen = true">Edit profile</button>
        </div>
        <div class="statistics">
          <div>0 contributions</div>
          <div>0 followers</div>
          <div>0 following</div>
          <div>0 credibility</div>
        </div>
        <div class="description">
          {{ user_meta?.biography }}
        </div>
      </div>
    </header>
    <section class="content">
      
    </section>
  </div>
</template>

<script lang="ts" setup>
  const user = useUser();
  const route = useRoute();
  const userId = route.params.id;

  const { data: user_meta } = await useFetch<any>(`/api/user/${ userId }`);

  const isEditModalOpen = ref(false);

  definePageMeta({
    layout: 'sitenav'
  });
</script>