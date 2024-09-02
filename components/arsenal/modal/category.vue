<template>
  <UModal v-model="isOpen" class="arsenal-modal">
    <div class="arsenal-modal-body">
      <UFormGroup label="Template" v-if="props.showTemplates">
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
        <ArsenalModalIconSelect :icons="icons" v-model="categoryIcon"/>
      </UFormGroup>

      <div class="button-group">
        <UButton label="Cancel" color="red" @click="isOpen = false"/>
        <UButton :label="props.submitLabel" @click="onSubmit()" />
      </div>
    </div>
  </UModal>
</template>

<script lang="ts" setup>
  import templatesJson from '~/content/categoryTemplates.json'
  import ArsenalCategoryIcon from "@/content/categoryIcons.json";

  const props = withDefaults(defineProps<{ 
    isSub?: boolean, 
    submitLabel?: string,
    showTemplates?: boolean
  }>(), { 
    isSub: false, 
    submitLabel: 'Add',
    showTemplates: true
  });

  const emit = defineEmits(['submit']);
  const isOpen = defineModel('isOpen', { type: Boolean, default: false });
  const categoryTitle = defineModel('title', { type: String, default: '' });
  const categoryIcon = defineModel('icon', { type: String, default: '' });

  const templates = props.isSub ? templatesJson.subCategories : templatesJson.mainCategories;

  const selected = ref<{ title: string, icon: string }>({ title: categoryTitle.value, icon: categoryIcon.value }); /* @TODO: Handle templates the same way as item presets */
  const icons = ref<Array<string>>(Object.values(ArsenalCategoryIcon));

  watch(selected, () => {
    categoryTitle.value = selected.value.title
    categoryIcon.value = selected.value.icon
  });

  const onSubmit = async () => {
    isOpen.value = false;
    emit('submit');

    const arsenalStore = useArsenalStore();
    await $fetch(`/api/loadout/${ arsenalStore.loadout.id }`, {
      method: "POST",
      body: { data: arsenalStore.loadout }
    });
  }

</script>