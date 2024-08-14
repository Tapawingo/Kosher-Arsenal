<template>
  <UTooltip text="Add Category" :popper="{ placement: 'right' }" :ui="classOverride">
    <div class="category" @click="isOpen = true">
      <NuxtImg :src="icon" fit="cover" placeholder/>
    </div>
  </UTooltip>

  <UModal v-model="isOpen" :ui="{ overlay: { background: 'bg-stone-600/75' }, background: '', ring: '' }">
    <div class="modal">
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

  const arsenalStore = useArsenalStore();
  const toast = useToast()

  const icons = Object.values(ArsenalCategoryIcon);
  const icon = 'arsenal/icons/icon_plus.svg';

  const isOpen = ref(false);
  const templates = templatesJson.categories;

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
    arsenalStore.addCategory(newCategory);
    isOpen.value = false;
    toast.add({ title: `Added category: "${ categoryTitle.value }"` });
  }

  const classOverride = {
    background: '',
    base: "arsenal-tooltip",
    ring: '',
    color: "white"
  };
</script>

<style lang="scss">
  .modal {
    background-color: rgb(9, 9, 9);
    color: white;
    border: 1px solid rgb(0, 0, 0);
    border-radius: 5px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    label {
      color: white;
    }
    
    input, select {
      background-color: rgb(24, 24, 24);
      color: white;
      border: 1px solid rgb(0, 0, 0);
      --tw-ring-inset: none;

      &:focus {
        border: none;
      }
    }

    img.leading {
      background-color: rgba(85, 85, 85, 0.6);
      border: 1px solid rgb(0, 0, 0);
      width: 1.5rem;
    }

    ul[role=listbox] {
      background-color: rgb(24, 24, 24);
      border: 1px solid rgb(0, 0, 0);
      --tw-ring-inset: none;
      
      li {
        color: white;

        img {
          background-color: rgba(85, 85, 85, 0.6);
          border: 1px solid rgb(0, 0, 0);
          width: 1.5rem;
        }

        &:hover {
          background-color: rgb(43, 43, 43);
        }
      }
    }

    .button-group {
      display: flex;
      justify-content: space-between;
    }
  }
</style>