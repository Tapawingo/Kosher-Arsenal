<template>
  <nav ref="iconBar" class="w-[12%] flex p-[5px] flex-col overflow-y-scroll-nobar">
    
  </nav>

</template>

<script lang="ts">
  import type { arsenal } from '@/modules/arsenal';
  import Icon from './icon.vue'
  import { createApp, h } from "vue"

  export default {
    name: 'icons',
    mounted: function() {

      window.addEventListener('KA-loadout-loaded', (event: CustomEventInit) => {
        const iconBar: any = this.$refs.iconBar;

        switch (this.$props.context) {
          case 'main':
            var categories: Array<arsenal.Category> = globalThis.loadout.getCategories();
            break;

          case 'item':
            var categories: Array<arsenal.Category> = [];
            break;
        
          default:
            var categories: Array<arsenal.Category> = [];
            break;
        }

        for (let i = 0; i < categories.length; i++) {

          var ComponentApp = createApp({
            setup () {
              return () => h(Icon, {iconObject: categories[i]})
            }
          });

          const wrapper = document.createElement('div');
          ComponentApp.mount(wrapper);
          iconBar.appendChild(wrapper);

          categories[i].setElement(wrapper);
        }

        switch (this.$props.context) {
          case 'main':
            globalThis.loadout.setCategories(categories);
            break;

          case 'item':
            /* globalThis.loadout.setSubCategories(categories); */
            break;
        }
      });

    },
    props: {
      context: {
        type: String,
        required: true,
        default: 'main'
      }
    },
    components: {
      Icon
    },
  }
</script>