<template>
  <div class="modal-group">
    <label>{{ data.title ? data.title : '-missing title-' }}</label>
    <div class="previewbox">
      <img v-if="data.default" :src="data.default" alt="">
      <PhotographIcon v-if="!data.default" />
      <span v-if="!data.default">No image</span>
    </div>
    <button>Upload Image</button>
  </div>
</template>

<script lang="ts">
  import { PhotographIcon } from "@heroicons/vue/solid"
  import pinia from "@/store";
  import { storeToRefs } from 'pinia'
  import { useArsenalStore } from '@/stores/arsenal';
  
  // @TODO Create a component to add, remove and edit categories

  export default {
    name: 'imagePreview',

    props: {
      data: {
        type: Object,
        required: true
      }
    },

    components: {
      PhotographIcon
    }
  }
</script>