<template>
  <LoadingScreen />
  
  <Modal />

  <!-- <Contextmenu /> -->

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
  import Modal from '@/components/editor/modal/modalBackground.vue'
  import Contextmenu from '@/components/editor/contextMenu/menu.vue'
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
      Modal,
      Contextmenu
    },
    async mounted () {
      const { updateLoadingScreen, initArsenal, showLoadingScreen, addModal } = useArsenalStore(pinia);

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

      /* Create example modal */
      const exampleItem1 = loadout.getCategories()[0].getItems()[0];
      addModal({
        title: `Edit: ${exampleItem1.getTitle()}`,
        items: [
          { type: 'text', title: 'Title' },
          { type: 'textbox', title: 'Description' },
          { type: 'image-preview', title: 'Image Preview', default: exampleItem1.getPreview() },
          { type: 'category-preview', title: 'Sub-Categories', default: exampleItem1.getCategories() },
          { type: 'buttonrow', default: [{ style: 'danger', text: 'close' }, { style: 'success', text: 'save' }] }
        ]
      });

      const exampleItem2 = loadout.getCategories()[0].getItems()[1];
      addModal({
        title: `Edit: ${exampleItem2.getTitle()}`,
        items: [
          { type: 'text', title: 'Title' },
          { type: 'textbox', title: 'Description' },
          { type: 'image-preview', title: 'Image Preview', default: exampleItem2.getPreview() },
          { type: 'category-preview', title: 'Sub-Categories', default: exampleItem2.getCategories() },
          { type: 'buttonrow', default: [{ style: 'danger', text: 'close' }, { style: 'success', text: 'save' }] }
        ]
      });
    }
  }
</script>