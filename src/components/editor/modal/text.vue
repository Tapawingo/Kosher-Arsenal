<template>
  <div class="modal-group">
    <span>{{ data.default }}</span>
  </div>
</template>

<script lang="ts">

  export default {
    name: 'textInput',

    props: {
      data: {
        type: Object,
        required: true
      }
    }
  }
</script>