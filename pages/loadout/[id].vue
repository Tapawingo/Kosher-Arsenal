<template>
  <div v-if="!isPhone" class="arsenal">
    <div class="preview">
      <NuxtImg :src="arsenalStore.loadout.preview.path" fit="cover" class="preview-image" placeholder />
    </div>

    <div class="categories">
      <div>
        <VueDraggable v-model="arsenalStore.loadout.categories" :disabled="!ctrl" :sort=true :swap-threshold="0.5">
          <ArsenalCategoriesCategory v-for="category in arsenalStore.loadout.categories" :category="category" :is-sub="false" :key="category.position"/>
        </VueDraggable>
      </div>
      <ArsenalCategoriesAddCategory v-if="arsenalStore.mode == ArsenalMode.edit" />
    </div>

    <div class="category-panel">
      <div v-if="arsenalStore.selectedCategory" class="panel">
        <div class="title">{{ arsenalStore.selectedCategory.title }}</div>
        <ArsenalPanelItem v-if="arsenalStore.selectedCategory" v-for="item in arsenalStore.selectedCategory.items" :item="item" :is-sub="false"/>
      </div>
    </div>

    <div class="center-panel">
      <div class="center-options">
        <NuxtLink to="/">
          <Icon name="material-symbols:arrow-back-2" mode="css"/><span>Return</span>
        </NuxtLink>
        <div class="edit">
          <Icon name="material-symbols:edit-square-outline" mode="css"/><span>Edit</span>
        </div>
      </div>
      <ArsenalInfo />
    </div>

    <div class="category-panel">
      <div v-if="arsenalStore.selectedSubCategory" class="panel">
        <div class="title">{{ arsenalStore.selectedSubCategory.title }}</div>
        <ArsenalPanelItem v-if="arsenalStore.selectedSubCategory" v-for="item in arsenalStore.selectedSubCategory.items" :item="item" :is-sub="true"/>
      </div>
    </div>

    <div class="categories">
      <ArsenalCategoriesCategory v-if="arsenalStore.selectedItem" v-for="category in arsenalStore.selectedItem.categories" :category="category" :is-sub="true"/>
    </div>
  </div>
  
  <div v-if="isPhone">
    Kosher Arsenal currently does not support mobile devices.
  </div>
</template>

<script lang="ts" setup>
  import { useMediaQuery, useMagicKeys } from '@vueuse/core'
  import { ArsenalMode } from '~/types/arsenal';
  import { VueDraggable } from 'vue-draggable-plus';
  
  const { ctrl } = useMagicKeys();
  const isPhone: Ref<boolean> = useMediaQuery('(max-width: 768px)');
  const arsenalStore = useArsenalStore();

  /* Temporary */
  arsenalStore.setMode(ArsenalMode.edit);

  const route = useRoute();
  const id = route.params.id;

  await callOnce(async () => {
    arsenalStore.fetchLoadout(id as string);
  })
</script>

<style lang="scss">
  @use "~/assets/styles/loadout.scss";
</style>