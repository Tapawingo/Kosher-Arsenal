<template>
  <LoadingScreen />
  
  <Modal />

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
  import LoadingScreen from '@/components/editor/loadingScreen.vue'
  import LoadoutMeta from '@/components/editor/loadoutMeta.vue'
  import BackButton from '@/components/editor/backButton.vue'
  import Preview from '@/components/editor/preview.vue'
  import Icons from '@/components/editor/icons.vue'
  import Panel from '@/components/editor/panel.vue'
  import Modal from '@/components/editor/modal/modal.vue'
  import { arsenal } from '@/modules/arsenal'
  import { useArsenalStore } from '@/stores/arsenal'
  import pinia from "@/store";
  
  import loadoutFile from '@/assets/example_loadout.json'
  
  export default {
    name: 'editor',
    components: {
      Icons,
      Panel,
      Preview,
      BackButton,
      LoadoutMeta,
      LoadingScreen,
      Modal
    },
    async mounted () {
      const loadingScreen: HTMLDivElement = this.$refs.loadingScreen as HTMLDivElement;
      const loadingTextContainer: HTMLSpanElement = this.$refs.loadingTextContainer as HTMLSpanElement;
      const loadingProgress: HTMLDivElement = this.$refs.loadingProgress as HTMLDivElement;
      const { updateLoadingScreen, initArsenal, showLoadingScreen } = useArsenalStore(pinia);

      /* Get loadout */
      showLoadingScreen(true);
      updateLoadingScreen(33, 'Loading Loadout Data...');
      var loadout = new arsenal.Loadout() // Load example loadout
      loadout.fromJSON(JSON.stringify(loadoutFile));
      initArsenal(loadout, 1);

      /* wait until arsenal components are mounted */
      updateLoadingScreen(50, 'Attaching arsenal components...');

      /* Finish loading arsenal */
      updateLoadingScreen(100, 'Finished loading loadout');
      showLoadingScreen(false);
    }
  }
</script>