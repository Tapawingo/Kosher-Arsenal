<template>
  <div class="modal-bg absolute w-screen h-screen flex justify-center items-center overflow-hidden">
    <div ref="modal" class="modal absolute font-mono">
      <div class="header" @mousedown="mouseDown">
        <XIcon />
      </div>
      <div class="content">
        <form>
          <TextInput headerText="Item Title" :focus="true" />
          <TextBlockGroup headerText="Item Description" :focus="true" />

          <hr />
        </form>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
  import { XIcon } from '@heroicons/vue/solid'
  import TextInput from './text.vue'
  import TextBlockGroup from './textBlock.vue'

  // @TODO Instead of this make the modal seperate from th background so i can have multiple modals at the same time

  export default {
    name: 'modal',

    components: {
      XIcon,
      TextInput,
      TextBlockGroup
    },

    methods: {
      mouseDown (evt: MouseEvent) {
        this.$data.dragging = true;

        this.$data.previousPos = { x: evt.clientX, y: evt.clientY };
      },

      mouseUp (evt: MouseEvent) {
        if (this.$data.dragging) {
          this.$data.dragging = false;
        }
      },

      mouseMove (evt: MouseEvent) {
        const modal: HTMLDivElement = this.$refs.modal as HTMLDivElement;
        const previousPos = this.$data.previousPos;
        
        if (this.$data.dragging) {

          /* Get new position */
          const currentPosX = previousPos.x - evt.clientX;
          const currentPosY = previousPos.y - evt.clientY;
          this.$data.previousPos = { x: evt.clientX, y: evt.clientY };

          /* Set element's position to new position */
          modal.style.left = modal.offsetLeft - currentPosX + 'px';
          modal.style.top = modal.offsetTop - currentPosY + 'px';
        }

      }
    },

    created () {
      window.addEventListener('mouseup', this.mouseUp);
      window.addEventListener('mousemove', this.mouseMove);
    },

    data () {
      return {
        dragging: false,
        previousPos: { 
          x: 0,
          y: 0
        }
      }
    }
  }
</script>