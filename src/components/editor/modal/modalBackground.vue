<template>
  <div v-if="modals.length > 0" class="modal-bg absolute w-screen h-screen flex justify-center items-center overflow-hidden">
    <modal v-for="modal in modals" :modalData="modal" />
  </div>

</template>

<script lang="ts">
  import modal from './modal.vue'
  import pinia from "@/store";
  import { storeToRefs } from 'pinia'
  import { useArsenalStore } from '@/stores/arsenal';

  export default {
    name: 'modalBackground',

    components: {
      modal
    },

    watch: {
      modals(newModals: any) {
        this.$data.modals = newModals;
      }
    },

    data () {
      const store = useArsenalStore(pinia);
      const { modals } = storeToRefs(store);

      return {
        modals
      }
    }
  }
</script>