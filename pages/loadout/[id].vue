<template>
  <div v-if="!isPhone" class="arsenal">
    <div class="preview">
      <NuxtImg :src="loadout.preview.path" fit="cover" class="preview-image" placeholder />
    </div>

    <div class="categories">
      <ArsenalCategoriesCategory v-for="category in loadout.categories" :category="category" :is-sub="false"/>
      <ArsenalCategoriesAddCategory v-if="arsenalMode == ArsenalMode.edit" />
    </div>

    <div class="category-panel">
      <div v-if="category" class="panel">
        <div class="title">{{ category.title }}</div>
        <ArsenalPanelItem v-if="category" v-for="item in category.items" :item="item" :is-sub="false"/>
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
      <div v-if="subCategory" class="panel">
        <div class="title">{{ subCategory.title }}</div>
        <ArsenalPanelItem v-if="subCategory" v-for="item in subCategory.items" :item="item" :is-sub="true"/>
      </div>
    </div>

    <div class="categories">
      <ArsenalCategoriesCategory v-if="item" v-for="category in item.categories" :category="category" :is-sub="true"/>
    </div>
  </div>
  
  <div v-if="isPhone">
    Kosher Arsenal currently does not support mobile devices.
  </div>
</template>

<script lang="ts" setup>
  import { useMediaQuery } from '@vueuse/core'
  import type { ArsenalItem } from '~/classes/ArsenalItem';
  import type { ArsenalCategory } from '~/classes/ArsenalCategory';
  import { type ArsenalLoadoutJson } from '~/classes/ArsenalLoadout';
  import { ArsenalMode } from '~/types/arsenal';

  const isPhone: Ref<boolean> = useMediaQuery('(max-width: 768px)');
    
  const arsenalMode = useState<ArsenalMode>('arsenal-mode');
  const loadout = useState<ArsenalLoadoutJson>('loadout');
  const category = useState<ArsenalCategory>('category');
  const item = useState<ArsenalItem>('item');
  const subCategory = useState<ArsenalCategory>('sub-category');

  /* Temporary */
  arsenalMode.value = ArsenalMode.edit;

  const route = useRoute();
  const id = route.params.id;

  await callOnce(async () => {
    const loadoutJson: ArsenalLoadoutJson | undefined = await $fetch(`/api/fetchLoadout/${ id }`)

    if (loadoutJson) {
      loadout.value = loadoutJson;
    }
  })
</script>

<style lang="scss">
  @use "~/assets/styles/loadout.scss";
</style>