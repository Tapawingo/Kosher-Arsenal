<template>
  <div class="mb-[5.55px] bg-[#55555599] border-solid border-[1px] border-black w-full aspect-square">
    <img :src="'src/assets/img/editor/icon_'+icon+'.png'"/>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'icon',
    props: {
      icon: {
        type: String,
        required: false,
        default: "unknown"
      }
    },
    components: {
      
    },
  }
</script>