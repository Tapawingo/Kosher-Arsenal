<template>
  <div class="page-profile">
    <header>
      <img :src="user_meta?.avatar" alt="Avatar">
      <div class="meta">
        <div class="name">
          <div class="username">
            <h1>{{ user_meta?.display_name }}</h1>
            <sub>@{{ user_meta?.username }}</sub>
          </div>
          <button>Edit profile</button>
        </div>
        <div class="statistics">
          <div>? contributions</div>
          <div>? followers</div>
          <div>? following</div>
          <div>? Credebility</div>
        </div>
        <div class="description">
          my description
        </div>
      </div>
    </header>
    <section class="content">
      
    </section>
  </div>
</template>

<script lang="ts" setup>
  const route = useRoute();
  const userId = route.params.id;

  const { data: user_meta } = await useFetch(`/api/user/${ userId }`);

  definePageMeta({
    layout: 'sitenav'
  });
</script>