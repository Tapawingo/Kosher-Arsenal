<template>
  <div ref="iconRoot" v-on:click="selectCategory()" class="mb-[5.55px] bg-[#55555599] border-solid border-[1px] border-black w-full aspect-square hover:bg-[#FFFFFF35] cursor-pointer" arsenal-selected="false">
    <img ref="iconImg" src="src/assets/img/editor/icon_unknown.png"/>
  </div>
</template>

<script lang="ts">
  import type { arsenal } from '@/modules/arsenal';

  export default {
    name: 'icon',
    props: {
      iconObject: {
        type: Object,
        required: false,
        default: {}
      }
    },
    mounted: function() {
      const iconRoot: HTMLDivElement = this.$refs.iconRoot as HTMLDivElement;
      const iconImg: HTMLImageElement = this.$refs.iconImg as HTMLImageElement;
      const category: arsenal.Category = this.$props.iconObject as arsenal.Category;

      iconImg.src = 'src' + category.getIcon();
    },
    methods: {
      selectCategory() {
        const category: arsenal.Category = this.$props.iconObject as arsenal.Category;
        const iconRoot: HTMLDivElement = this.$refs.iconRoot as HTMLDivElement;
        const iconsRoot: HTMLElement | null = (iconRoot.parentElement as HTMLElement).parentElement;

        if (iconRoot.getAttribute('arsenal-selected') != undefined) {
          const iconSelected: Boolean = iconRoot.getAttribute('arsenal-selected') === 'false';

          console.log(globalThis.loadout.toJSON())

          /* unselect all icons */
          if (iconsRoot != undefined) {
            const iconsArray: Array<any> = Array.from(iconsRoot.children);
            iconsArray.forEach((iconContainer: HTMLDivElement) => {
              const icon: HTMLDivElement = iconContainer.children[0] as HTMLDivElement;
              icon.setAttribute('arsenal-selected', 'false');
              icon.style.backgroundColor = '';
            });
          }

          /* Toggle current icon */
          if (iconSelected) {
            iconRoot.setAttribute('arsenal-selected', 'true');
            iconRoot.style.backgroundColor = '#FFFFFF35';
            globalThis.mainCategory = category; //@TODO Check if main or item category

          } else {
            globalThis.mainCategory = null;
          }
          
          /* Dispatch event */
          let event = new CustomEvent('KA-arsenal-category-select', { detail: {context: 'main' as String, category: globalThis.mainCategory as arsenal.Category} })
          window.dispatchEvent(event);
        } else {
          iconRoot.setAttribute('arsenal-selected', 'false');
        }
      },
    },
    components: {
      
    },
  }
</script>