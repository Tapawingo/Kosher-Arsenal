<template>
  <UModal v-model="isOpen" class="arsenal-modal">
    <UForm :state="state" :schema="schema" class="arsenal-modal-body" @submit.prevent="onSubmit">
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

      <UFormGroup label="Category Title" required name="title">
        <UInput v-model="state.title" name="title" />
      </UFormGroup>

      <UFormGroup label="Category Icon" required name="icon">
        <ArsenalModalIconSelect :icons="icons" v-model="state.icon" name="icon"/>
      </UFormGroup>

      <div class="button-group">
        <UButton label="Cancel" color="red" @click="onClose"/>
        <UButton :label="props.submitLabel" type="submit" />
      </div>
    </UForm>
  </UModal>
</template>

<script lang="ts" setup>
  import templatesJson from "@/content/categoryTemplates.json";
  import ArsenalCategoryIcon from "@/content/categoryIcons.json";
  import { object, string, type InferType } from "yup";

  const props = withDefaults(defineProps<{ 
    isSub?: boolean, 
    submitLabel?: string,
    showTemplates?: boolean
  }>(), { 
    isSub: false, 
    submitLabel: 'Add',
    showTemplates: true
  });

  const schema = object({
    title: string().min(2, 'Too short').max(255, 'Exceeds character limit').required('Required'),
    icon: string().required('Required')
  });

  const emit = defineEmits(['submit']);
  const isOpen = defineModel('isOpen', { type: Boolean, default: false });

  const category = defineModel<Schema>('category', { required: false, default: {
    title: '',
    icon: ''
  }});
  type Schema = InferType<typeof schema>
  const state = defineModel<Schema>('formData', { required: true });
  const icons = ref<Array<string>>(Object.values(ArsenalCategoryIcon));

  const templates = props.isSub ? templatesJson.subCategories : templatesJson.mainCategories;
  const selected = ref<{ title: string, icon: string }>({ title: state.value.title, icon: state.value.icon }); /* @TODO: Handle templates the same way as item presets */
  
  onMounted(() => {
    resetForm();
  });

  watch(isOpen, () => {
    if (!isOpen.value) {
      resetForm();
    }
  });
  
  /* On template selected */
  watch(selected, () => {
    state.value.title = selected.value.title
    state.value.icon = selected.value.icon
  });

  /* Handle modal closing */
  const onClose = () => {
    isOpen.value = false;
    resetForm();
  };

  /* Clear form on close */
  const resetForm = () => {
    state.value.title = category.value.title ?? '';
    state.value.icon = category.value.icon ?? '';
  };

  /* Submit Data */
  const onSubmit = async () => {
    isOpen.value = false;
    emit('submit');
  }
</script>