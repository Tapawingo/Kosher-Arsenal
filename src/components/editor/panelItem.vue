<template>
  <div ref="itemRoot" arsenal-selected="false" class="font-mono">
    <div ref="itemTitleContainer" class="bg-[#00000055] text-base text-white pt-5 pb-5 pl-2 hover:bg-[#00000035] cursor-pointer" @click="selectItem">
      <div ref="dragIcon" v-if="editorMode === 1" draggable="true" class="w-[1.4rem] mr-px inline-block align-middle cursor-grab"><MenuIcon /></div> 
      <span ref="itemTitle" class="align-middle font-bold"></span>
    </div>
    <div ref="itemDescriptionContainer" class="bg-[#00000055] text-xs text-zinc-200 mb-[1px] overflow-hidden contract-description overflow-ellipsis">
      <span ref="itemDescription" class="align-top font-bold pt-2 pb-5 block min-h-[4rem] overflow-ellipsis"></span>
    </div>
  </div>
</template>

<script lang="ts">
  import type { arsenal } from '@/modules/arsenal';
  import { MenuIcon } from '@heroicons/vue/solid';

  export default {
    name: 'editor',

    components: {
      MenuIcon
    },

    props: {
      itemObject: {
        type: Object,
        required: false,
        default: {}
      },
      itemContainer: {
        type: HTMLDivElement,
        required: true,
        default: {}
      }
    },

    mounted() {
      const item: arsenal.Item = this.$props.itemObject as arsenal.Item;
      const itemRoot: HTMLDivElement = this.$refs.itemRoot as HTMLDivElement;
      const dragIcon: HTMLSpanElement = this.$refs.dragIcon as HTMLDivElement;
      const itemTitle: HTMLDivElement = this.$refs.itemTitle as HTMLDivElement;
      const itemDescription: HTMLDivElement = this.$refs.itemDescription as HTMLDivElement;

      itemTitle.innerHTML = item.title as string;
      itemDescription.innerHTML = item.description as string;
    },

    methods: {
      selectItem() {
        const item: arsenal.Item = this.$props.itemObject as arsenal.Item;
        const itemRoot: HTMLDivElement = this.$refs.itemRoot as HTMLDivElement;
        const itemsRoot: HTMLDivElement = (itemRoot.parentNode as HTMLDivElement).parentNode as HTMLDivElement;
        const itemTitleContainer: HTMLDivElement = this.$refs.itemTitleContainer as HTMLDivElement;
        const itemDescriptionContainer: HTMLDivElement = this.$refs.itemDescriptionContainer as HTMLDivElement;

        if (itemRoot.getAttribute('arsenal-selected') != undefined) {
          const itemSelected: Boolean = itemRoot.getAttribute('arsenal-selected') === 'false';

          /* unselect all icons */
          if (itemsRoot != undefined) {
            const itemsArray: Array<any> = Array.from(itemsRoot.children);
              itemsArray.forEach((itemContainer: HTMLDivElement) => {
              const itemEl: HTMLDivElement = itemContainer.children[0] as HTMLDivElement;
              itemEl.setAttribute('arsenal-selected', 'false');
              (itemEl.children[0] as HTMLDivElement).style.backgroundColor = '';
              (itemEl.children[1] as HTMLDivElement).classList.remove('expand-description');
            });
          }

          /* Toggle current icon */
          if (itemSelected) {
            itemRoot.setAttribute('arsenal-selected', 'true');
            itemTitleContainer.style.backgroundColor = '#00000035';
            itemDescriptionContainer.classList.add('expand-description');

            /* If the text overflows show a "show more option" */
            if (itemDescriptionContainer.offsetHeight < itemDescriptionContainer.scrollHeight) {
              console.log('text too long')
            }

            globalThis.selectedItem = item;
            //console.log(itemDescriptionContainer);

          } else {
            globalThis.selectedItem = null;
            itemDescriptionContainer.classList.remove('expand-description');
          }
          
          /* Dispatch event */
          let event = new CustomEvent('onCategorySelect', { detail: {context: 'main' as String, category: globalThis.mainCategory as arsenal.Category} })
          window.dispatchEvent(event);
        } else {
          itemRoot.setAttribute('arsenal-selected', 'false');
        }

      },
    },
    data () {

      return {
        editorMode: globalThis.mode,
        draggedItem: new EventTarget
      }
    }
  }
</script>