<template>
  <div class="modal-group">
    <label>{{ data.title ? data.title : '-missing title-' }}</label>
    <div class="categories">
      <img v-for="category in data.default" :src="'src' + category.getIcon()" :alt="(category.getTitle() as string)" @contextmenu="contextmenu($event, category)">
    </div>
    <button>Add Category</button>
  </div>
</template>

<script lang="ts">
  import type { arsenal } from '@/modules/arsenal';
  import pinia from "@/store";
  import { storeToRefs } from 'pinia'
  import { useArsenalStore } from '@/stores/arsenal';
  
  // @TODO Create a component to add, remove and edit categories

  export default {
    name: 'categoryPreview',

    props: {
      data: {
        type: Object,
        required: true
      }
    },

    methods: {
      contextmenu(evt: Event, category: arsenal.Category) {
        console.log(category);
        evt.preventDefault;
      }
    }
  }
</script>