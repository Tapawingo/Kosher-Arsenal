<template>
  <div ref="itemRoot" class="font-mono item">
    <div class="text-base text-white pt-5 pb-5 pl-2 hover:bg-[#00000035] cursor-pointer title" @click="select">
      <div v-if="editorMode === 1" class="w-[1.4rem] mr-px inline-block align-middle cursor-grab" @mousedown="mouseDown">
        <MenuIcon />
      </div> 
      <span class="align-middle font-bold">
        {{ item.getTitle() }}
      </span>
    </div>
    <div class="flex flex-col text-xs text-zinc-200 mb-[1px] overflow-hidden description overflow-ellipsis">
      <span class="align-top font-bold pt-2 pb-0 block min-h-[4rem] overflow-hidden overflow-ellipsis"> 
        {{ item.getDescription() }} 
      </span>
      <div class="text-xs underline w-full text-center cursor-pointer more">{{editorMode === 1 ? 'Edit' : 'Show more'}}</div>
    </div>
  </div>
</template>

<script lang="ts">
  import type { arsenal } from '@/modules/arsenal';
  import { MenuIcon } from '@heroicons/vue/solid';
  import { useArsenalStore } from '@/stores/arsenal';
  import pinia from "@/store";
  import { storeToRefs } from 'pinia'

  export default {
    name: 'editor',

    components: {
      MenuIcon
    },

    props: {
      itemObject: {
        type: Object,
        required: true,
      },
      context: {
        type: String,
        required: true
      }
    },

    watch: {
      itemObject(newItem: arsenal.Item) {
        (this.$refs.itemRoot as HTMLDivElement).classList.remove('selected');
        this.$data.item = newItem;
      }
    },

    methods: {
      select() {
        const store = useArsenalStore(pinia);
        const { setSelectedItem, setSelectedCategory } = store;
        const { selectedMainItem, selectedItemItem } = storeToRefs(store);
        const context = this.$props.context;
        const item: arsenal.Item = this.$props.itemObject as arsenal.Item;
        const itemRoot: HTMLDivElement = this.$refs.itemRoot as HTMLDivElement;
        const selectedItem = (context === 'main') ? selectedMainItem : selectedItemItem;

        /* Toggle current icon */
        if (item != selectedItem.value) {
          setSelectedItem(context, item);
          itemRoot.classList.add('selected');
        } else {
          setSelectedItem(context, null);
          itemRoot.classList.remove('selected');
        };

        /* Null itemItem and itemCategory when new item is selected */
        if (context === 'main') {
          setSelectedItem('item', null);
          setSelectedCategory('item', null);
        }

        this.$emit('item-select', itemRoot);
      },

      mouseDown (evt: MouseEvent) {
        this.$data.dragging = true;
      },

      mouseUp (evt: MouseEvent) {
        const itemRoot: HTMLDivElement = this.$refs.itemRoot as HTMLDivElement;

        if (this.$data.dragging) {
          this.$data.dragging = false;
          this.$emit('item-stopDrag', evt, itemRoot);
        }
      },

      mouseMove (evt: MouseEvent) {
        const itemRoot: HTMLDivElement = this.$refs.itemRoot as HTMLDivElement;
        
        if (this.$data.dragging) {
          this.$emit('item-drag', evt, itemRoot);
        }

      }
    },

    created () {
      window.addEventListener('mouseup', this.mouseUp);
      window.addEventListener('mousemove', this.mouseMove);
    },

    data () {
      const store = useArsenalStore(pinia);
      const { mode } = storeToRefs(store);

      return {
        editorMode: mode,
        item: this.$props.itemObject,
        dragging: false
      }
    }
  }
</script>