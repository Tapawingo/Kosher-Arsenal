<template>
  <div ref="iconRoot" v-on:click="selectCategory()" class="mb-[5.55px] bg-[#55555599] border-solid border-[1px] border-black w-full aspect-square hover:bg-[#FFFFFF35] cursor-pointer icon" arsenal-selected="false">
    <img ref="iconImg" :src="'src/' + icon.getIcon()"/>
  </div>
</template>

<script lang="ts">
  import pinia from "@/store";
  import { storeToRefs } from "pinia";
  import type { arsenal } from '@/modules/arsenal';
  import { useArsenalStore } from '@/stores/arsenal';

  export default {
    name: 'icon',
    props: {
      iconObject: {
        type: Object,
        required: true
      },
      context: {
        type: String,
        required: true
      }
    },

    watch: {
      iconObject(newIcon: arsenal.Category) {
        (this.$refs.iconRoot as HTMLDivElement).classList.remove('selected');
        this.$data.icon = newIcon;
      }
    },

    methods: {
      selectCategory() {
        const store = useArsenalStore(pinia);
        const { setSelectedCategory, setSelectedItem } = store;
        const { selectedMainCategory, selectedItemCategory } = storeToRefs(store)
        const context = this.$props.context;
        const category: arsenal.Category = this.$props.iconObject as arsenal.Category;
        const iconRoot: HTMLDivElement = this.$refs.iconRoot as HTMLDivElement;
        const selectedCategory = (context === 'main') ? selectedMainCategory : selectedItemCategory;

        if (category != selectedCategory.value) {
          setSelectedCategory(context, category);
          iconRoot.classList.add('selected');
        } else {
          setSelectedCategory(context, null);
          iconRoot.classList.remove('selected');
        }

        /* Null itemItem, itemCategory and mainItem when new item is selected */
        if (context === 'main') {
          setSelectedItem('main', null);
          setSelectedItem('item', null);
          setSelectedCategory('item', null);
        }

        this.$emit('category-selected', iconRoot);
      },
    },
    
    data() {

      return {
        icon: this.$props.iconObject
      }
    },
  }
</script>