<template>
  <div class="modal-group">
    <label>{{ headerText ? headerText : '-missing title-' }}</label>
    <textarea ref="input" type="text"></textarea>
  </div>
</template>

<script lang="ts">

  export default {
    name: 'textBlockGroup',

    props: {
      headerText: {
        type: String,
        required: true
      },
      focus: {
        type: Boolean,
        required: false,
        default: false
      }
    },

    mounted () {
      console.log(this.$props.focus)
      if (this.$props.focus) {
        this.$nextTick(() => (this.$refs.input as HTMLInputElement).focus());
      }
    }
  }
</script>