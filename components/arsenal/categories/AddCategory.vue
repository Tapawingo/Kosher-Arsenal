<template>
  <UTooltip :text="isSub ? 'Add Subcategory' : 'Add Category'" :popper="{ placement: 'right' }" :ui="classOverride">
    <div class="category" @click="isModalOpen = true">
      <NuxtImg :src="icon" fit="cover" placeholder/>
    </div>
  </UTooltip>

  <ArsenalModalCategory
    v-model:isOpen="isModalOpen"
    v-model:is-saving="isModalSaving"
    v-model:form-data="ModalData"
    :is-sub="props.isSub"
    @submit="addCategory"
  />
</template>

<script lang="ts" setup>
  import { ArsenalCategory } from '~/classes/ArsenalCategory'

  const props = withDefaults(defineProps<{
    isSub?: boolean
  }>(), {
    isSub: false
  });

  const arsenalStore = useArsenalStore();
  const toast = useToast()
  const icon = 'arsenal/icons/icon_plus.svg';

  const isModalOpen = ref<boolean>(false);
  const isModalSaving = ref<boolean>(false);
  const ModalData = ref({
    title: '',
    icon: ''
  })

  const addCategory = () => {
    const newCategory = new ArsenalCategory({
      title: ModalData.value.title,
      icon: ModalData.value.icon
    });

    let state = false;
    if (props.isSub) {
      state = arsenalStore.addSubCategory(newCategory);
    } else {
      state = arsenalStore.addCategory(newCategory);
    }

    toast.add({ title: `${ state ? 'Added' : 'Failed to add' } ${ props.isSub ? 'subcategory' : 'category' }: "${ ModalData.value.title }"` });
    arsenalStore.saveLoadout();

    isModalOpen.value = false;
    isModalSaving.value = false;
  }

  const classOverride = {
    background: '',
    base: "arsenal-tooltip",
    ring: '',
    color: "white"
  };
</script>

<style lang="scss">
  .arsenal-modal-body {
    img.leading {
      background-color: rgba(85, 85, 85, 0.6);
      border: 1px solid rgb(0, 0, 0);
      width: 1.5rem;
    }
  }
</style>