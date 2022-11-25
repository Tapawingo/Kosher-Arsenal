<template>
  <div class="bg-[#00000055] text-white mb-[1px] pt-5 pb-5 pl-2 hover:bg-[#00000035]">
    {{title}}
  </div>
</template>

<script lang="ts">

  export default {
    name: 'editor',
    props: {
      title: {
        type: String,
        required: false,
        default: ""
      },
      description: {
        type: String,
        required: false,
        default: ""
      }
    },
    components: {
    }
  }
</script>