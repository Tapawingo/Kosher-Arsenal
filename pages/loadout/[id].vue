<template>
  <div v-if="!isPhone" class="arsenal">
    <ArsenalPreview />

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

        <div>
          <Icon :name="arsenalStore.mode == 0 ? 'material-symbols:edit' : 'material-symbols:visibility-rounded'" mode="css" size="15"/>
          <span>{{ arsenalStore.mode == 0 ? 'Edit' : 'Preview' }}</span>
        </div>

        <div><Icon name="material-symbols:help-outline" mode="css"/>Help</div>

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
  
  const { ctrl } = useMagicKeys(); /* @TODO: Add explenation for moving by holding ctrl */
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

  .notification [role=status] {
    background-color: rgba(85, 85, 85, 0.6);
    border: 1px solid rgb(0, 0, 0);
    border-radius: 2px;
    --tw-ring-opacity: 0;

    * {
      --tw-ring-opacity: 0;
    }

    div.flex {
      padding: 0.2rem 0.3rem;
    }

    div.absolute.bottom-0 {
      background-color: transparent;
    }
    
    p, span {
      color: white;
    }
  }

  .center-options {
    text-transform: capitalize;
    text-align: center;
    font-size: 1rem;
    cursor: pointer;
    margin: 5px auto 5px auto;
    width: 75%;
    display: flex;
    justify-content: center;
    gap: 0.5rem;

    div, a {
      background-color: rgba(85, 85, 85, 0.6);
      border: 1px solid rgb(0, 0, 0);
      padding: 0.1rem;
      user-select: none;
      width: 50%;

      display: flex;
      justify-content: center;
      align-items: center;
      gap: 5px;

      &:hover:not(.disabled) {
        background-color: rgba(255, 255, 255, 0.25);
      }
      
      &.disabled {
        color: rgb(174, 174, 174);
        cursor: auto;
      }
    }
  }
</style>