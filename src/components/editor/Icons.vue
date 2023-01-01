<template>
  <nav ref="iconsContainer" class="w-[12%] flex p-[5px] flex-col overflow-y-scroll-nobar">
    <Icon v-if="context == 'main'" v-for="category in loadout.getCategories()" :iconObject="category" :context="context" @category-selected="selectCategory" />
    <Icon v-if="context == 'item'" v-for="category in selectedMainItem.getCategories()" :iconObject="category" :context="context" @category-selected="selectCategory" />
  </nav>

</template>

<script lang="ts">
  import Icon from './icon.vue'
  import pinia from "@/store";
  import { storeToRefs } from 'pinia'
  import { useArsenalStore } from '@/stores/arsenal';

  export default {
    name: 'icons',

    props: {
      context: {
        type: String,
        required: true
      }
    },

    components: {
      Icon
    },

    setup(props) {
      const store = useArsenalStore(pinia);
      const { loadout, selectedMainItem } = storeToRefs(store);
      const context = props.context;

      return { loadout, selectedMainItem, context };
    },

    methods: {
      selectCategory(selectedCategoryElement: HTMLDivElement) {
        const itemsContainer: HTMLDivElement = this.$refs.iconsContainer as HTMLDivElement;

        Array.from(itemsContainer.children).forEach(categoryElement => {
          if (categoryElement != selectedCategoryElement) {
            categoryElement.classList.remove('selected');
          }
        });
      }
    }
  }
</script>