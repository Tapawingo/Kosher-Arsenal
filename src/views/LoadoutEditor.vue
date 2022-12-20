<template>
  <main class="bg-stone-400 bg-grid-pattern-light dark:bg-stone-900 dark:bg-grid-pattern-dark bg-grid-40 h-screen w-screen flex overflow-hidden">
    <div class="basis-1/3 flex">
      <Icons context="main" />
      <Panel context="main" />
    </div>

    <div class="basis-3/4 flex">

    </div>

    <div class="basis-1/3 flex">
      <Panel context="item" />
      <Icons context="item" />
    </div>
  </main>
</template>

<script lang="ts">
  import { arsenal } from '../modules/arsenal'
  import Icons from '../components/editor/Icons.vue'
  import Panel from '../components/editor/panel.vue'
  import loadoutFile from '../assets/example_loadout.json'

  export default {
    name: 'editor',
    components: {
      Icons,
      Panel
    },
    mounted() {
      /* Setup */
      globalThis.mode = 1; // Set to view mode
      var loadout = new arsenal.Loadout() // Load example loadout
      loadout.fromJSON(JSON.stringify(loadoutFile));

      // Set example loadout as current loadout
      globalThis.loadout = loadout;

      /* trigger loadout-loaded event to let every component know we are ready*/
      let event = new CustomEvent('KA-loadout-loaded', { detail: {} });
      window.dispatchEvent(event);
    },
    data () {
      return {}
    }
  }
</script>