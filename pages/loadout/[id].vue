<template>
  <head>
    
  </head>
  <div v-if="!isPhone && arsenalStore.viewMode !== ArsenalViewMode.list" class="arsenal">
    <div v-if="arsenalStore.arsenalState == ArsenalStates.loading" class="arsenal-loading">
      <Icon name="i-heroicons:arrow-path-20-solid" />
      <div>Loading</div>
    </div>

    <div v-else-if="arsenalStore.arsenalState == ArsenalStates.error" class="arsenal-error">
      <Icon name="material-symbols:error-circle-rounded-outline-sharp" />
      <div>Error</div>
      <div>{{ arsenalStore.stateMessage }}</div>
    </div>

    <div class="background"></div>

    <ArsenalPreview />

    <UiConfirmationBox />

    <ArsenalModalHelp v-model:is-open="helpIsOpen" />

    <div class="categories">
      <div>
        <VueDraggable v-model="arsenalStore.loadout.categories" @end="onDrop" :disabled="!ctrl" :sort=true :swap-threshold="0.5">
          <ArsenalCategoriesCategory v-for="category in arsenalStore.loadout.categories" :category="category" :key="category.position"/>
        </VueDraggable>
      </div>
      <ArsenalCategoriesAddCategory v-if="arsenalStore.isEditMode()" />
    </div>

    <ArsenalPanel />

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

    <ArsenalPanel is-sub />

    <div class="categories">
      <div>
        <VueDraggable v-if="arsenalStore.selectedItem" @end="onDrop" v-model="arsenalStore.selectedItem.categories" :disabled="!ctrl" :sort=true :swap-threshold="0.5">
          <ArsenalCategoriesCategory v-for="category in arsenalStore.selectedItem.categories" :category="category" :key="category.position" is-sub />
        </VueDraggable>
      </div>
      <ArsenalCategoriesAddCategory v-if="arsenalStore.selectedItem && arsenalStore.isEditMode()" is-sub/>
    </div>
  </div>

  <!-- List Mode -->
  <div v-if="arsenalStore.viewMode === ArsenalViewMode.list" class="arsenal-list-view">
    <ArsenalListMode />
  </div>
  
  <div v-if="isPhone">
    Kosher Arsenal currently does not support mobile devices.
  </div>
</template>

<script lang="ts" setup>
  import { useMediaQuery, useMagicKeys } from '@vueuse/core'
  import { VueDraggable } from 'vue-draggable-plus';
import type { ArsenalLoadoutJson } from '~/classes/ArsenalLoadout';
  import { ArsenalMode, ArsenalStates, ArsenalViewMode } from '~/stores/arsenal';
  
  const { ctrl } = useMagicKeys();
  const isPhone: Ref<boolean> = useMediaQuery('(max-width: 768px)');
  const arsenalStore = useArsenalStore();
  const user = useUser();

  /* Make sure state is reset */
  arsenalStore.resetState();

  /* Attempt to load a loadout */
  const route = useRoute();
  const id = route.params.id;

  /* Fetch loadout */
  // await arsenalStore.fetchLoadout(id as string);
  const { data: loadoutData } = await useFetch<ArsenalLoadoutJson>(`/api/loadout/${ id as string }`); // Inefficient bandaid for bug with useSEOMeta composable);
  arsenalStore.loadLoadout(loadoutData.value);

    /* Set SEO Site Meta */
  useHead({
    title: loadoutData.value?.title,
    meta: [
      { name: 'description', content: loadoutData.value?.description },
      { property: 'og:title', content: loadoutData.value?.title },
      { property: 'og:description', content: loadoutData.value?.description },
      { property: 'og:image', content: loadoutData.value?.preview?.path },
      { property: 'og:image:alt', content: 'Kosher Arsenal' },
      { property: 'og:url', content: 'https://kosher-arsenal.com' },
      { name: 'twitter:card', content: 'app' },
      { name: 'twitter:title', content: loadoutData.value?.title },
      { name: 'twitter:description', content: loadoutData.value?.description },
      { name: 'twitter:image', content: loadoutData.value?.preview?.path },
    ]
  });

  /* Get user's buylist */
  arsenalStore.fetchBuylist();

  /* Set mode and view mode */
  let viewMode = parseInt(route.query.viewMode as string);
  let mode = parseInt(route.query.mode as string);
  arsenalStore.setViewMode(!isNaN(viewMode) ? viewMode : ArsenalViewMode.normal);

  if (mode === ArsenalMode.edit && user.value?.id === arsenalStore.loadout.owner) {
    arsenalStore.setMode(!isNaN(mode) ? mode : ArsenalMode.view);
  }

  /* Help button */
  const helpIsOpen = ref(false);
  
  /* State management for Kosher Arsenal */
  const arsenalModeSelect = ref([
    {
      label: 'Preview', 
      icon: 'material-symbols:visibility-rounded', 
      mode: ArsenalMode.view 
    },
    {
      label: 'Buylist', 
      icon: 'material-symbols:check-box', 
      mode: ArsenalMode.buylist
    },
    {
      label: 'Edit', 
      icon: 'material-symbols:edit',
      mode: ArsenalMode.edit, 
      disabled: arsenalStore.loadout.owner !== user.value?.id
    }
  ]);

  arsenalStore.on('onLoadoutFetched', () => {
    arsenalModeSelect.value[2].disabled = arsenalStore.loadout.owner !== user.value?.id;
  });

  const selectedArsenalMode = ref(arsenalModeSelect.value[arsenalStore.mode]);

  watch(selectedArsenalMode, () => {
    arsenalStore.setMode(selectedArsenalMode.value.mode)
  })

  /* Save loadout on drag finish */
  const onDrop = () => {
    arsenalStore.saveLoadout();
  };
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
    
    p, span, div {
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

  .arsenal-loading, .arsenal-error {
    position: absolute;
    z-index: 100;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(48, 48, 48, 0.75);
  }

  .arsenal-loading span.iconify {
    animation: spin 1s linear infinite;
    scale: 1;
  }

  .arsenal-error span.iconify {
    scale: 1.2;
  }
</style>