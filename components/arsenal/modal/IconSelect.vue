<template>
  <div class="icon-selector" ref="containerEl">
    <div v-for="icon in icons" class="category" :data-icon="icon" @click="select(icon)">
      <NuxtImg :src="icon" fit="cover" placeholder loading="lazy"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const containerEl = ref<HTMLDivElement | null>(null)
  const props = defineProps<{ icons: Array<string> }>();
  const model = defineModel();

  const select = (icon: string) => {
    if (model.value == icon) {
      model.value = undefined
    } else {
      model.value = icon;
    }
  };

  select(model.value as string);

  watch(model, () => {
    if (!containerEl.value) return;

    for (let childEl of containerEl.value.children) {
      if (childEl.getAttribute('data-icon') == model.value) {
        childEl.classList.add('selected');  
      } else {
        childEl.classList.remove('selected');
      };
    };
  })
</script>

<style lang="scss">
  .icon-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    padding: 0.3rem;
    background-color: rgb(24, 24, 24);

    .category {
      background-color: rgba(85, 85, 85, 0.6);
      border: 1px solid rgb(0, 0, 0);
      cursor: pointer;
      width: 10%;
      aspect-ratio: 1 / 1;
      margin-bottom: 5.55px;
      user-select: none;

      &:hover {
          background-color: rgba(255, 255, 255, 0.25);
          transform: scale(1.1);
      }

      &.selected {
          background-color: rgba(255, 255, 255, 0.5);
          transform: scale(1.1);
      }
    }
  }
</style>