<template>
  <div ref="containerEl" class="ui-input-autocomplete">
    <input 
      ref="inputEl" 
      type="text" 
      v-model="inputModel"
      :name="props.name" 
      :placeholder="$props.placeholder"
      @input="onInput"
      @focusout="onFocusOut"
    />

    <div ref="listEl" class="ui-input-autocomplete-list" v-if="isListOpen">
      <div v-for="(option, index) in searchList" @click="onClick(option)" :class="{ active: index === activeListEl }">
        {{ optionLabel(option) }}
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
  import { onKeyStroke, useMouseInElement } from '@vueuse/core'

  const emit = defineEmits(['change']);
  const model = defineModel<Object>({ default: {} });
  const props = withDefaults(defineProps<{
    name?: string,
    placeholder?: string,
    options: any[],
    searchAttributes?: string[],
    optionAttribute?: string,
    createable?: boolean
  }>(), {
    name: '',
    placeholder: '',
    createable: false
  });
  
  const inputEl = ref<HTMLInputElement>();
  const listEl = ref<HTMLDivElement>();
  const inputModel = ref('');
  const isListOpen = ref(false);
  const activeListEl = ref(-1);

  /* Create list with search results */
  const searchList = computed(() => {
    const filteredList: any[] = [];

    props.options.forEach((option) => {
      const label = optionLabel(option).toLowerCase();

      if (props.searchAttributes) {
        for (const searchAttribute of props.searchAttributes) {
          const attributeValue = option[searchAttribute].toLowerCase();
          if (attributeValue.includes(inputModel.value.toLowerCase())) {
            filteredList.push(option);
            break;
          }
        }
      } else if (label.includes(inputModel.value.toLowerCase())) {
        filteredList.push(option);
      }
    });

    return filteredList;
  });

  /* Get option label */
  const optionLabel = (option: any): string => {
    const label = props.optionAttribute ? option[props.optionAttribute] : option;

    return label;
  }

  /* Show suggestions */
  const onInput = (event: any) => {
    isListOpen.value = inputModel.value.length > 0 && searchList.value.length > 0;
    activeListEl.value = -1;
    model.value = { title: inputModel.value };
    emit('change');
  }

  /* Arrow down */
  onKeyStroke('ArrowDown', (event: KeyboardEvent) => {
    if (!isListOpen.value) return;
    event.preventDefault();
    if (activeListEl.value === props.options.length - 1) return;

    activeListEl.value++;
  });

  /* Arrow up */
  onKeyStroke('ArrowUp', (event: KeyboardEvent) => {
    if (!isListOpen.value) return;
    event.preventDefault();
    if (activeListEl.value === -1) return;

    activeListEl.value--;
  });

  /* Enter */
  onKeyStroke('Enter', (event: KeyboardEvent) => {
    if (!isListOpen.value) return;
    event.preventDefault();

    if (activeListEl.value > -1) {
      const option = props.options[activeListEl.value];
      inputModel.value = optionLabel(option);
      model.value = option;
    } else {
      model.value = { title: inputModel.value };
    }

    isListOpen.value = false;
    emit('change');
  });

  /* Handle manual clicking */
  const onClick = (option: Object) => {
    inputModel.value = optionLabel(option);
    isListOpen.value = false;
    model.value = option;
    emit('change');
  }

  /* Close if click outside */
  const { isOutside } = useMouseInElement(listEl);
  const onFocusOut = () => {
    if (isOutside.value) {
      isListOpen.value = false;
    };
  }
  
</script>

<style lang="scss">
  .ui-input-autocomplete > input {
    width: 100%;
    padding: 0.375rem 0.625rem;
    border: solid 1px black !important;
    border-radius: 0.5rem;
    outline: none;
  }

  .ui-input-autocomplete-list {
    position: absolute;
    border: solid 1px black;
    border-radius: 0.5rem;
    z-index: 99;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 0.5rem;
    overflow: hidden;
    
    & > div {
      padding: 10px;
      cursor: pointer;
      background-color: rgb(23, 23, 23);

      &:hover {
        background-color: rgb(128, 128, 128);
      }

      &.active {
        background-color: rgb(128, 128, 128);
      }
    }
  }
</style>