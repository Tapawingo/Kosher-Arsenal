<template>
  <div class="arsenal">
    <nav class="categories" aria-label="categories">
      <ArsenalCategoriesCategory v-for="category in loadout.categories" :category="category" />
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
    <nav class="categories" aria-label="sub-categories">
    </nav>
  </div>
</template>

<script lang="ts" setup>
  import type { ArsenalLoadout } from '~/classes/ArsenalLoadout';

  /* Instead of having separate pages for editing and viewing they will be combined */
  const route = useRoute();
  const id = route.params.id;

  const loadout = useState<ArsenalLoadout>('loadout');
  await callOnce(async () => {
    loadout.value = await $fetch(`/api/fetchLoadout/${ id }`)
  })

  console.log(loadout.value);
</script>

<style lang="scss">
  @use "~/assets/styles/loadout.scss";
</style>