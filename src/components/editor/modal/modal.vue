<template>
  <div ref="modal" class="modal absolute font-mono">
      <div class="header" @mousedown="mouseDown">
        <span>{{ modalData.title }}</span>
        <XIcon @click="close"/>
      </div>
      <div class="content">
        <form>
          <component v-for="item in modalData.items" :is="getType(item.type)" :data="item" />
        </form>
      </div>
    </div>
</template>

<script lang="ts">
  import TextInputGroup from './textInput.vue'
  import TextGroup from './text.vue'
  import TextBoxGroup from './textBox.vue'
  import CategoryPreview from './categoryPreview.vue'
  import ImagePreview from './imagePreview.vue'
  import ImageUpload from './imageUpload.vue'
  import ButtonRow from './buttonRow.vue'
  import { XIcon } from '@heroicons/vue/solid'
  import pinia from "@/store";
  import { useArsenalStore } from '@/stores/arsenal';

  // @TODO Read from an array of objects to construct the modal
  // @TODO Create a priority prop
  // @TODO Create an image upload component

  export default {
    name: 'modal',

    props: {
      modalData: {
        type: Object,
        required: true
      }
    },

    components: {
      XIcon
    },

    methods: {
      getType (type: string) {
        switch (type) {
          case 'textinput':
            return TextInputGroup;

          case 'text':
            return TextGroup;

          case 'textbox':
            return TextBoxGroup;
          
          case 'image-preview':
            return ImagePreview;

          case 'image-upload':
            return ImageUpload;
          
          case 'category-preview':
            return CategoryPreview;

          case 'buttonrow':
            return ButtonRow;
        }
      },

      close () {
        const store = useArsenalStore(pinia);
        const { removeModal } = store;
        const modal = this.$props.modalData as any;

        removeModal(modal);
      },

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

      const buttons = [{ text: 'close', style: 'failed' }, { text: 'save', style: 'success' }];

      return {
        dragging: false,
        previousPos: { 
          x: 0,
          y: 0
        },
        buttons
      }
    }
  }
</script>