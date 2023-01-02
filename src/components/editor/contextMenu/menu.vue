<template>
  <div class="context-menu">
    <div class="header">Header</div>
    <div :class="item.type" v-for="item in contextMenu.items" @click="item.action">{{ item.title }}</div>
    <div class="item">Example item 2</div>
    <hr />
    <div class="item">Example item 2</div>
  </div>
</template>

<script lang="ts">
  import type { arsenal } from '@/modules/arsenal';
  import pinia from "@/store";
  import { storeToRefs } from 'pinia'
  import { useArsenalStore } from '@/stores/arsenal';

  export default {
    name: 'contextmenu',

    setup () {
      const store = useArsenalStore(pinia);
      const { contextMenu } = storeToRefs(store);

      return { contextMenu }
    }
  }
</script>