<template>
  <div class="w-[88%] pt-[5px] pb-[5px] h-full">
    <div class="bg-[#55555599] border-solid border-[1px] border-black h-full w-full flex flex-col">
      <div class="bg-[#00000088] basis-[4%] text-[#DDDDDDFF] p-[5px] text-center font-mono text-[20px]">
        <!-- Category title -->
      </div>
      <div class="basis-[96%] flex flex-col overflow-y-scroll-nobar">
        <!-- Category Items -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import panelItem from './panelItem.vue'

  export default {
    name: 'editor',
    props: {
      context: {
        type: String,
        required: true
      }
    },
    components: {
      panelItem
    },
    mounted() {
      console.log(`the component is now mounted.`)
    },
    methods: {
      startDrag(evt: DragEvent, item: arsenal.Item) {
        if (evt.dataTransfer != undefined && evt.target != undefined) {
          evt.dataTransfer.dropEffect = 'move'
          evt.dataTransfer.effectAllowed = 'move'
          evt.dataTransfer.setDragImage(new Image(), 0, 0);
          this.draggedNode = evt.target;
          evt.dataTransfer.setData("itemID", item.id.toString());

          (evt.target as HTMLDivElement).style.backgroundColor = '#00000035';
        }
      },

      dragOver(evt: DragEvent) {
        if (evt.target != undefined && this.draggedNode != null && evt.dataTransfer != undefined) {
          const thisEl = evt.target as HTMLDivElement;
          const parentEl = thisEl.parentNode;
          const draggedEl = this.draggedNode as HTMLDivElement;
          const draggedElID = Number(evt.dataTransfer.getData("itemID"));
          const allItems = parentEl?.children;

          if (allItems != undefined && parentEl != undefined && thisEl.parentNode === draggedEl.parentNode) {
            const thisIndex = Array.from(allItems).indexOf(thisEl);
            const draggedIndex = Array.from(allItems).indexOf(draggedEl);

            if (draggedIndex < thisIndex) {
              var newIndex = parentEl.insertBefore(draggedEl, thisEl.nextSibling);
            } else {
              var newIndex = parentEl.insertBefore(draggedEl, thisEl);
            }

            //this.category.items.find((item: arsenal.Item) => item.id == draggedElID).pos = newIndex;
          }
        }
      },

      dragEnd(evt: DragEvent) {
        (evt.target as HTMLDivElement).style.backgroundColor = '';
      }

    },
    data () {

      return {
        draggedNode: new EventTarget
      }
    }
  }
</script>