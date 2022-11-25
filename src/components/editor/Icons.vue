<template>
  <nav class="w-[12%] flex p-[5px] flex-col overflow-y-scroll-nobar">
    <Icon 
      v-for="icon in icons"
      :icon="icon.img"
    ></Icon>
  </nav>

</template>

<script lang="ts">
  import Icon from './icon.vue'

  export default {
    name: 'icons',
    props: {
      icons: {
        type: Object,
        required: false,
        default: "[]"
      }
    },
    components: {
      Icon
    },
  }
</script>