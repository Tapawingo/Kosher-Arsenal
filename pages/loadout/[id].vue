<template>
  <div v-if="!isPhone" class="arsenal">
    <div v-if="arsenalStore.arsenalState == ArsenalStates.loading" class="arsenal-loading">
      <Icon name="i-heroicons:arrow-path-20-solid" />
      <div>Loading</div>
    </div>

    <div class="background"></div>

    <ArsenalPreview />

    <UiConfirmationBox />

    <ArsenalModalHelp v-model:is-open="helpIsOpen" />

    <div class="categories">
      <div>
        <VueDraggable v-model="arsenalStore.loadout.categories" :disabled="!ctrl" :sort=true :swap-threshold="0.5">
          <ArsenalCategoriesCategory v-for="category in arsenalStore.loadout.categories" :category="category" :key="category.position"/>
        </VueDraggable>
      </div>
      <ArsenalCategoriesAddCategory v-if="arsenalStore.mode == arsenalModes.edit" />
    </div>

    <div class="category-panel">
      <div v-if="arsenalStore.selectedCategory" class="panel">
        <div class="title">{{ arsenalStore.selectedCategory.title }}</div>
        <div>
          <VueDraggable v-if="arsenalStore.selectedCategory" v-model="arsenalStore.selectedCategory.items" :disabled="!ctrl" :sort=true :swap-threshold="0.5">
            <ArsenalPanelItem v-for="item in arsenalStore.selectedCategory.items" :item="item" :key="item.position"/>
          </VueDraggable>
        </div>
        <ArsenalPanelAddItem v-if="arsenalStore.selectedCategory && arsenalStore.mode == arsenalModes.edit" />
      </div>
    </div>

    <div class="center-panel">
      <div class="center-options">

        <NuxtLink to="/">
          <Icon name="material-symbols:arrow-back-2" mode="css"/><span>Return</span>
        </NuxtLink>

        <USelectMenu class="arsenal-select" :options="arsenalModeSelect" v-model="selectedArsenalMode" :ui="{option: { active: 'active' }}">
          <template #option="{ option: mode }">
            <Icon :name="mode.icon" mode="css" size="15"/>
            <span >{{ mode.label }}</span>
          </template>

          <template #label>
            <Icon :name="selectedArsenalMode.icon" class="leading"/>
            <span >{{ selectedArsenalMode.label }}</span>
          </template>
        </USelectMenu>

        <div class="arsenal-button" @click="helpIsOpen = true">
          <Icon name="material-symbols:help-outline" mode="css"/>
          Help
        </div>

      </div>
      <ArsenalInfo />
    </div>

    <div class="category-panel">
      <div v-if="arsenalStore.selectedSubCategory" class="panel">
        <div class="title">{{ arsenalStore.selectedSubCategory.title }}</div>
        <div>
          <VueDraggable v-if="arsenalStore.selectedSubCategory" v-model="arsenalStore.selectedSubCategory.items" :disabled="!ctrl" :sort=true :swap-threshold="0.5">
            <ArsenalPanelItem v-for="item in arsenalStore.selectedSubCategory.items" :item="item" :key="item.position" is-sub/>
          </VueDraggable>
        </div>
        <ArsenalPanelAddItem v-if="arsenalStore.selectedSubCategory && arsenalStore.mode == arsenalModes.edit" is-sub/>
      </div>
    </div>

    <div class="categories">
      <div>
        <VueDraggable v-if="arsenalStore.selectedItem" v-model="arsenalStore.selectedItem.categories" :disabled="!ctrl" :sort=true :swap-threshold="0.5">
          <ArsenalCategoriesCategory v-for="category in arsenalStore.selectedItem.categories" :category="category" :key="category.position" is-sub />
        </VueDraggable>
      </div>
      <ArsenalCategoriesAddCategory v-if="arsenalStore.selectedItem && arsenalStore.mode == arsenalModes.edit" is-sub/>
    </div>
  </div>
  
  <div v-if="isPhone">
    Kosher Arsenal currently does not support mobile devices.
  </div>
</template>

<script lang="ts" setup>
  import { useMediaQuery, useMagicKeys } from '@vueuse/core'
  import { VueDraggable } from 'vue-draggable-plus';
  import { ArsenalMode, ArsenalStates } from '~/stores/arsenal';
  
  const { ctrl } = useMagicKeys();
  const isPhone: Ref<boolean> = useMediaQuery('(max-width: 768px)');
  const arsenalStore = useArsenalStore();

  /* Help button */
  const helpIsOpen = ref(false);
  
  /* State management for Kosher Arsenal */
  const arsenalModes = ref(ArsenalMode);
  const arsenalModeSelect = ref([
    { label: 'Preview', icon: 'material-symbols:visibility-rounded', mode: ArsenalMode.view },
    { label: 'Buylist (WIP)', icon: 'material-symbols:check-box', mode: ArsenalMode.buylist },
    { label: 'Edit', icon: 'material-symbols:edit', mode: ArsenalMode.edit }
  ])
  const selectedArsenalMode = ref(arsenalModeSelect.value[arsenalStore.mode]);

  watch(selectedArsenalMode, () => {
    arsenalStore.setMode(selectedArsenalMode.value.mode)
  })

  /* Attempt to load a loadout */
  const route = useRoute();
  const id = route.params.id;

  onMounted(async () => {
    arsenalStore.fetchLoadout(id as string);
  })

  /* SEO Site Meta */
  const getSEOTitle = () => { 
    if (arsenalStore.arsenalState == ArsenalStates.ready) {
      return arsenalStore.loadout.title
    }

    return 'Kosher Arsenal'
  };

  const getSEODescription = () => {
    if (arsenalStore.arsenalState == ArsenalStates.ready) {
      return arsenalStore.loadout.description
    }

    return 'Kosher Arsenal is a tool to visualize and/or organize loadouts, firearms or any other category users see fit.'
  };

  const getSEOImage = () => {
    if (arsenalStore.arsenalState == ArsenalStates.ready) {
      return arsenalStore.loadout.preview.path
    }

    return '@/public/logo-alternate-long.svg'
  };

  useSeoMeta({
    title: getSEOTitle,
    description: getSEODescription,
    applicationName: 'Kosher Arsenal',
    author: 'JSOK',
    
    ogTitle: getSEOTitle,
    ogDescription: getSEODescription,
    ogImage: getSEOImage,
    ogImageAlt: 'Kosher Arsenal',
    ogUrl: '',

    twitterCard: 'app',
    twitterTitle: getSEOTitle,
    twitterDescription: getSEODescription,
    twitterImage: getSEOImage,
  })
</script>

<style lang="scss">
  @use "@/assets/styles/arsenal/main";

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

    .arsenal-button, .arsenal-select, a {
      background-color: rgba(85, 85, 85, 0.6);
      border: 1px solid rgb(0, 0, 0);
      padding: 0rem;
      user-select: none;
      width: 50%;

      display: flex;
      justify-content: center;
      align-items: center;
      gap: 5px;

      &:hover:not(.disabled):not(.arsenal-select) {
        background-color: rgba(255, 255, 255, 0.25);
      }
      
      &.disabled {
        color: rgb(174, 174, 174);
        cursor: auto;
      }

    }
  }

  .arsenal-select {
    div[role=button] {
      width: 100%;
      height: 100%;
      background-color: transparent;
      --tw-ring-inset: none;

      &:hover {
          background-color: rgba(255, 255, 255, 0.25);
        }

      button {
        background-color: transparent;
        --tw-ring-inset: none;
        justify-content: center;
        cursor: pointer;

        span {
          color: white;
        }
      }
    }

    ul[role=listbox] {
      --tw-ring-inset: none;
      background-color: rgba(85, 85, 85, 0.6);
      border: 1px solid rgb(0, 0, 0);
      border-radius: 2px;

      li {
        border-radius: 2px;
        cursor: pointer;

        span {
          color: white;
        }

        &:hover {
          background-color: rgba(255, 255, 255, 0.25);
        }

        &.bg-gray-100 {
          background-color: rgba(255, 255, 255, 0.25);
        }
      }
    }
  }

  .arsenal-loading {
    position: absolute;
    z-index: 100;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background-color: rgba(48, 48, 48, 0.75);

    span.iconify {
      animation: spin 1s linear infinite;
      scale: 1;
    }
  }
</style>