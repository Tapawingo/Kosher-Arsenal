<template>
  <div ref="panelRoot" class="w-[88%] pt-[5px] pb-[5px] h-full">
    <div class="bg-[#55555599] border-solid border-[1px] border-black h-full w-full flex flex-col">
      <div ref="panelTitle" class="bg-[#00000088] basis-[4%] text-[#DDDDDDFF] p-[5px] text-center font-mono text-[20px] font-bold">
        <!-- Category title -->
      </div>
      <div ref="panelItems" class="basis-[96%] flex flex-col overflow-y-scroll-nobar">
        <!-- Category Items -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import type { arsenal } from '@/modules/arsenal';
  import panelItem from './panelItem.vue'
  import { createApp, h } from "vue"

  export default {
    name: 'editor',

    props: {
      context: {
        type: String,
        required: true
      }
    },

    components: {
      panelItem
    },

    mounted() {
      const panelRoot: HTMLDivElement = this.$refs.panelRoot as HTMLDivElement;
      const panelTitle: HTMLDivElement = this.$refs.panelTitle as HTMLDivElement;
      const panelItems: HTMLDivElement = this.$refs.panelItems as HTMLDivElement;
      const panelContext: String = this.$props.context;

      /* Triggered when category gets selected */
      window.addEventListener('KA-arsenal-category-select', (event: CustomEventInit) => {
        const context: String = event.detail.context; 
        const category: arsenal.Category = event.detail.category;

        if (context === panelContext) {
          if (category != null) {
            panelTitle.innerHTML = category.title as string;

            const items = category.items;

            panelItems.innerHTML = '';
            for (let i = 0; i < items.length; i++) {
              var ComponentApp = createApp({
                setup () {
                  return () => h(panelItem, {itemObject: items[i], itemContainer: panelItems})
                }
              });

              const wrapper = document.createElement('div');
              ComponentApp.mount(wrapper);
              panelItems.appendChild(wrapper);

              /* Add arsenal properties */
              wrapper.children[0].setAttribute('arsenal-item-id', items[i].id.toString());

              //categories[i].setElement(wrapper);
            }
          }
        }
      })
    },
  }
</script>