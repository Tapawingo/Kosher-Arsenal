<template>
  <div class="modal-buttonRow">
    <button v-for="button in data.default" :class="(button as any).style">{{ (button as any).text }}</button>
  </div>
</template>

<script lang="ts">

  export default {
    name: 'buttonRow',

    props: {
      data: {
        type: Object,
        required: true
      }
    },
  }
</script>