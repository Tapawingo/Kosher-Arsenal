<template>
  <div ref="panelRoot" class="w-[88%] pt-[5px] pb-[5px] h-full" v-if="(context === 'main' ? selectedMainCategory.getItems() : selectedItemCategory.getItems()).length != 0">
    <div class="bg-[#55555599] border-solid border-[1px] border-black h-full w-full flex flex-col">
      <div ref="panelTitle" class="bg-[#00000088] basis-[4%] text-[#DDDDDDFF] p-[5px] text-center font-mono text-[20px] font-bold">
        {{ context === 'main' ? selectedMainCategory.getTitle() : selectedItemCategory.getTitle() }}
      </div>
      <div ref="panelItems" class="basis-[96%] flex flex-col overflow-y-scroll-nobar">
        <panelItem v-if="context == 'main'" v-for="item in selectedMainCategory.getItems()" :context="context" :itemObject="item" @item-select="selectItem" @item-drag="dragItem" @item-stopDrag="stopDragItem"/>
        <panelItem v-if="context == 'item'" v-for="item in selectedItemCategory.getItems()" :context="context" :itemObject="item" @item-select="selectItem" @item-drag="dragItem" @item-stopDrag="stopDragItem"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import panelItem from './panelItem.vue'
  import pinia from "@/store";
  import { storeToRefs } from 'pinia'
  import { useArsenalStore } from '@/stores/arsenal';

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

    setup(props) {
      const store = useArsenalStore(pinia);
      const { selectedMainCategory, selectedItemCategory } = storeToRefs(store);
      const context = props.context;

      return { selectedMainCategory, selectedItemCategory, context };
    },

    methods: {
      selectItem(selectedItemElement: HTMLDivElement) {
        const itemsContainer: HTMLDivElement = this.$refs.panelItems as HTMLDivElement;

        Array.from(itemsContainer.children).forEach(itemElement => {
          if (itemElement != selectedItemElement) {
            itemElement.classList.remove('selected');
          }
        });
      },

      dragItem (evt: MouseEvent, itemElement: HTMLDivElement) {
        const parentContainer: HTMLDivElement = this.$refs.panelItems as HTMLDivElement;
        const itemsArray: Array<Element> = Array.from(parentContainer.children);
        const index: number = itemsArray.indexOf(itemElement);
        
        /* Calculate position of item */
        var itemPosition: number = parentContainer.getBoundingClientRect().top;
        for (let i = 0; i < index; i++) {
          const element = itemsArray[i];
          
          itemPosition += element.getBoundingClientRect().height;
        }

        /* Drag item */
        // @TODO Animate the movement, it looks very crude atm
        const itemHeight: number = itemElement.getBoundingClientRect().height;
        const mousePosition: number = itemPosition + (itemHeight / 2);
        itemElement.classList.add('dragging');
        itemElement.style.top = evt.clientY - mousePosition + 'px';

        /* Calculate new index */
        var newIndex = 0;
        var draggedPosition = itemElement.getBoundingClientRect().top;
        var elementPosition = parentContainer.getBoundingClientRect().top;
        while (draggedPosition >= elementPosition && index <= itemsArray.length - 1) {
          const element = itemsArray[newIndex];
          elementPosition += element.getBoundingClientRect().height;
          newIndex++;
        }

        if (newIndex === itemsArray.length - 1) {
          parentContainer.appendChild(itemElement);
        } else {
          var i = index > newIndex ? newIndex : newIndex + 1;
          parentContainer.insertBefore(itemElement, itemsArray[i]);
        }
      },

      stopDragItem (evt: MouseEvent, itemElement: HTMLDivElement) {
        itemElement.classList.remove('dragging');
      }
    }
  }
</script>