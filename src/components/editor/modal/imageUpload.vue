<template>
  <div class="modal-group">
    <label>{{ data.title ? data.title : '-missing title-' }}</label>
    <div class="uploadbox">
      <UploadIcon />
    </div>
  </div>
</template>

<script lang="ts">
  import { UploadIcon } from "@heroicons/vue/solid"
  import pinia from "@/store";
  import { storeToRefs } from 'pinia'
  import { useArsenalStore } from '@/stores/arsenal';
  
  // @TODO Create a component to add, remove and edit categories

  export default {
    name: 'uploadImage',

    props: {
      data: {
        type: Object,
        required: true
      }
    },

    components: {
      UploadIcon
    },

    setup(props) {
      const store = useArsenalStore(pinia);
      const { loadout } = storeToRefs(store);

      return { loadout };
    }
  }
</script>