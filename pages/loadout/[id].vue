<template>
  <div class="arsenal">
    <nav class="categories">
      <ArsenalCategoriesCategory />
      <ArsenalCategoriesCategory />
    </nav>
    <div class="category-panel">
      <div class="panel">
        <div class="title">Example Category</div>
        <ArsenalPanelItem />
        <ArsenalPanelItem />
      </div>
    </div>
    <div class="preview">
      <div class="info back">Return</div>
      <ArsenalInfo />
    </div>
    <div class="category-panel">
      <div class="panel">
        <div class="title">Example Category</div>
      </div>
    </div>
    <nav class="categories">
      <ArsenalCategoriesCategory />
    </nav>
  </div>
</template>

<script lang="ts" setup>
  /* Instead of having separate pages for editing and viewing they will be combined */
  const route = useRoute();
  const id = route.params.id;

  const { data } = await useFetch(`/api/fetchLoadout/${ id }`);

  useHead({
    title: data.title,
    meta: [
      { name: 'description', content: data.description }
    ]
  });

  useSeoMeta({
    title: data.title,
    description: data.description,
    ogTitle: data.title,
    ogDescription: data.description,
    ogImage: data.preview,
    twitterTitle: data.title,
    twitterDescription: data.description
  });

  console.log(data)
</script>

<style lang="scss">
  @use "~/assets/styles/loadout.scss";
</style>