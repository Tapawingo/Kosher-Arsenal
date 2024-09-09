<template>
  <UTooltip class="item-tooltip" text="Add Item" :popper="{ placement: 'bottom' }" :ui="classOverride">
    <div class="item add-item" @click="isOpen = true">
      <div class="item-title">
        <NuxtImg src="arsenal/icons/icon_plus.svg"/>
      </div>
    </div>
  </UTooltip>

  <ArsenalModalItem 
    v-model:is-open="isOpen" 
    v-model:form-data="itemModalData"
    @submit="onSubmit"
  />
</template>

<script lang="ts" setup>
  const props = withDefaults(defineProps<{isSub?: boolean}>(), {
    isSub: false
  });

  const arsenalStore = useArsenalStore();
  const toast = useToast()

  const isOpen = ref<boolean>(false);
  const itemModalData = ref({
    title: '',
    description: '',
    preview: new ArsenalPreviewImage().toJSON(),
    previewFile: undefined
  });
  
  const classOverride = {
    background: '',
    base: "arsenal-tooltip",
    ring: '',
    color: "white"
  };

  const onSubmit = async () => {
    const newItem = new ArsenalItem({
      title: itemModalData.value.title,
      description: itemModalData.value.description,
      preview: new ArsenalPreviewImage().fromJSON(JSON.stringify(itemModalData.value.preview))
    });
    
    let state = false;
    if (props.isSub) {
      state = arsenalStore.addSubItem(newItem);
    } else {
      state = arsenalStore.addItem(newItem);
    };

    toast.add({ title: `${ state ? 'Added' : 'Failed to add' } ${ props.isSub ? 'subitem' : 'item' }: "${ itemModalData.value.title }"` });

    itemModalData.value.title = '';
    itemModalData.value.description = '';
    itemModalData.value.preview = new ArsenalPreviewImage().toJSON();
    arsenalStore.saveLoadout();
  }
</script>

<style lang="scss">
  .item-tooltip {
    width: 100%;
    display: block;
  }

  .add-item {
    padding: 0rem;
    background-color: transparent;
    background-image: linear-gradient(rgba(85, 85, 85, 0.6) 25%, transparent);
    
    .item-title {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0rem;

      img {
        height: 4rem;
      }
    }
  }
</style>