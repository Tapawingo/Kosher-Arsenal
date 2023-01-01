<template>
  <div ref="loadingScreen" class="h-full w-full bg-stone-400 bg-grid-pattern-light absolute flex flex-col justify-end">
    <div ref="titleCardContainer" class="self-start w-full flex justify-end">
      <img src="../assets/long-logo.svg" alt="kosher arsenal logo" class="w-1/3">
    </div>
    <div ref="loadingBarContainer">
      <span ref="loadingTextContainer" class="" >Loading...</span>
      <div ref="loadingBar" class="w-full bg-stone-500 rounded-sm">
        <div ref="loadingProgress" class="h-3 w-[1%] bg-rose-500 transition-[width 0.5s]" ></div>
      </div>
    </div>
  </div>

  <main class="bg-stone-400 bg-grid-pattern-light dark:bg-stone-900 dark:bg-grid-pattern-dark bg-grid-40 h-screen w-screen flex overflow-hidden">
    <div class="basis-1/3 flex">
      <Icons context="main" />
      <Panel context="main" />
    </div>

    <div class="basis-3/4 flex flex-col items-center justify-between h-full">
      <BackButton />
      <Preview />
      <LoadoutMeta />
    </div>

    <div class="basis-1/3 flex justify-end">
      <Panel context="item" />
      <Icons context="item" />
    </div>
  </main>
</template>

<script lang="ts">
  import { arsenal } from '@/modules/arsenal'
  import Icons from '@/components/editor/icons.vue'
  import Panel from '@/components/editor/panel.vue'
  import Preview from '@/components/editor/preview.vue'
  import BackButton from '@/components/editor/backButton.vue'
  import LoadoutMeta from '@/components/editor/loadoutMeta.vue'
  import pinia from "@/store";
  import { useArsenalStore } from '@/stores/arsenal';
  import loadoutFile from '@/assets/example_loadout.json'

  export default {
    name: 'editor',
    components: {
      Icons,
      Panel,
      Preview,
      BackButton,
      LoadoutMeta
    },
    async mounted () {
      const loadingScreen: HTMLDivElement = this.$refs.loadingScreen as HTMLDivElement;
      const loadingTextContainer: HTMLSpanElement = this.$refs.loadingTextContainer as HTMLSpanElement;
      const loadingProgress: HTMLDivElement = this.$refs.loadingProgress as HTMLDivElement;
      const { initLoadingScreen, updateLoadingScreen, updateLoadingScreenText, initArsenal, showLoadingScreen } = useArsenalStore(pinia);

      /* Start loading screen */
      initLoadingScreen(loadingScreen, loadingTextContainer, loadingProgress);

      /* Get loadout */
      updateLoadingScreenText('Loading Loadout Data');
      updateLoadingScreen(33);
      var loadout = new arsenal.Loadout() // Load example loadout
      loadout.fromJSON(JSON.stringify(loadoutFile));
      initArsenal(loadout, 1);

      /* wait until arsenal components are mounted */
      updateLoadingScreenText('Attaching arsenal components');
      updateLoadingScreen(50);

      /* Finish loading arsenal */
      updateLoadingScreen(100);
      showLoadingScreen(false);
    }
  }
</script>