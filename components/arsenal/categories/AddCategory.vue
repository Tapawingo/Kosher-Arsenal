<template>
  <UTooltip :text="isSub ? 'Add Subcategory' : 'Add Category'" :popper="{ placement: 'right' }" :ui="classOverride">
    <div class="category" @click="isOpen = true">
      <NuxtImg :src="icon" fit="cover" placeholder/>
    </div>
  </UTooltip>

  <UModal v-model="isOpen" class="arsenal-modal">
    <div class="arsenal-modal-body">
      <UFormGroup label="Template">
        <UInputMenu v-model="selected" :options="templates" option-attribute="title">
          <template #option="{ option: template }">
            <NuxtImg v-if="template.icon" :src="template.icon" placeholder loading="lazy"/>
            <span style="height: 100%; vertical-align: middle;">{{ template.title }}</span>
          </template>
          
          <template #leading>
            <NuxtImg v-if="selected.icon" :src="selected.icon" class="leading"/>
          </template>
        </UInputMenu>
      </UFormGroup>

      <UFormGroup label="Category Title" required>
        <UInput v-model="categoryTitle" />
      </UFormGroup>

      <UFormGroup label="Category Icon" required>
        <ArsenalModalIconSelect :icons="icons" v-model="selectedIcon"/>
      </UFormGroup>

      <div class="button-group">
        <UButton label="Cancel" color="red" @click="isOpen = false"/>
        <UButton label="Add" @click="addCategory()" />
      </div>
    </div>
  </UModal>
</template>

<script lang="ts" setup>
  import templatesJson from '~/content/templates.json'
  import { ArsenalCategory, ArsenalCategoryIcon } from '~/classes/ArsenalCategory'

  const props = withDefaults(defineProps<{isSub?: boolean}>(), {
    isSub: false
  });

  const arsenalStore = useArsenalStore();
  const toast = useToast()

  const icons = Object.values(ArsenalCategoryIcon);
  const icon = 'arsenal/icons/icon_plus.svg';

  const isOpen = ref(false);
  const templates = props.isSub ? templatesJson.subCategories : templatesJson.mainCategories;

  const selected = ref(templates[0]);
  const categoryTitle = ref(selected.value.title);
  const selectedIcon = ref<undefined | string>(selected.value.icon);

  watch(selected, () => {
    categoryTitle.value = selected.value.title
    selectedIcon.value = selected.value.icon
  });

  const addCategory = () => { /* @TODO: Force none empty strings */
    const newCategory = new ArsenalCategory({
      title: categoryTitle.value,
      icon: selectedIcon.value
    });

    if (props.isSub) {
      let state = arsenalStore.addSubCategory(newCategory);
      toast.add({ title: `${ state ? 'Added' : 'Failed to add' } subcategory: "${ categoryTitle.value }"` });
    } else {
      let state = arsenalStore.addCategory(newCategory);
      toast.add({ title: `${ state ? 'Added' : 'Failed to add' } category: "${ categoryTitle.value }"` });
    }
    
    isOpen.value = false;
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