<template>
  <div v-if="loadingScreen.shown" class="h-full w-full bg-stone-400 bg-grid-pattern-light absolute flex flex-col justify-end">
    <div class="self-start w-full flex justify-end">
      <img src="../../assets/long-logo.svg" alt="kosher arsenal logo" class="w-1/3">
    </div>
    <div>
      <span>{{ loadingScreen.text }}</span>
      <div class="w-full bg-stone-500 rounded-sm">
        <div class="h-3 w-[1%] bg-rose-500 transition-[width 0.5s]" :style="{width: loadingScreen.loaded + '%'}"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import pinia from "@/store";
  import { storeToRefs } from 'pinia'
  import { useArsenalStore } from '@/stores/arsenal';

  export default {
    name: 'loadingScreen',

    setup () {
      const store = useArsenalStore(pinia);
      const { loadingScreen } = storeToRefs(store);

      return { loadingScreen };
    }
  }
</script>