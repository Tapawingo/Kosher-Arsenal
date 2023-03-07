<template>
  <div class="modal-group">
    <label>{{ data.title ? data.title : '-missing title-' }}</label>
    <input ref="input" type="text" />
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
    },

    mounted () {
      if (this.$props.data.focus) {
        this.$nextTick(() => (this.$refs.input as HTMLInputElement).focus());
      }
    }
  }
</script>