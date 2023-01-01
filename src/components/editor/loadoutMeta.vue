<template>
  <div class="w-3/4 pb-[5px]">
    <div ref="infoRoot" class="font-mono infoPanel">
    <div class="border-solid border-[1px] border-black text-base text-white text-center pl-2 hover:bg-[#00000035] cursor-pointer title" @click="select">
      <span class="align-middle font-bold">
        {{ loadout.getTitle() }}
      </span>
    </div>
    <div class="flex flex-col text-xs text-zinc-200 mb-[1px] overflow-hidden description overflow-ellipsis">
      <span class="align-top font-bold pt-2 pb-0 block min-h-[4rem] overflow-hidden overflow-ellipsis"> 
        {{ loadout.getDescription() }} 
      </span>
      <div class="text-xs underline w-full text-center cursor-pointer">Show more</div>
    </div>
  </div>
  </div>
</template>

<script lang="ts">
  import pinia from "@/store";
  import { storeToRefs } from 'pinia'
  import { useArsenalStore } from '@/stores/arsenal';

  export default {
    name: 'loadoutMeta',

    setup(props) {
      const store = useArsenalStore(pinia);
      const { loadout } = storeToRefs(store);

      return { loadout };
    },

    methods: {
      select() {
        const infoRoot: HTMLDivElement = this.$refs.infoRoot as HTMLDivElement;
        if (!infoRoot.classList.contains('selected')) {
          infoRoot.classList.add('selected');
        } else {
          infoRoot.classList.remove('selected');
        }
      }
    }
  }
</script>