<template>
  <div class="ui-select">
    <button ref="buttonEl" class="ui-select-button" @click="isListOpen = !isListOpen" type="button">
      <span class="ui-select-value">
        {{ optionLabel(options[model]) }}
      </span>
      <Icon name="material-symbols:keyboard-arrow-down" />
    </button>

    <div ref="listEl" class="ui-select-list" v-if="isListOpen">
      <input ref="searchInputEl" type="text" v-if="props.searchable" placeholder="Search..." v-model="searchModel">
      <div v-for="(option, index) in searchList" @click="onClick(option)" :class="{ active: index === activeListEl }">
        {{ optionLabel(option) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onKeyStroke } from '@vueuse/core'

  const emit = defineEmits(['change']);
  const model = defineModel<number>({ default: -1 });
  const props = withDefaults(defineProps<{
    name?: string,
    options: any[],
    optionAttribute?: string,
    searchable?: boolean,
    searchAttributes?: string[]
  }>(), {
    name: '',
    searchable: false
  });

  const buttonEl = ref<HTMLButtonElement>();
  const searchInputEl = ref<HTMLInputElement>();
  const listEl = ref<HTMLDivElement>();
  const isListOpen = ref(false);
  const searchModel = ref('');
  const activeListEl = ref(-1);

  /* Get option label */
  const optionLabel = (option: any): string => {
    const label = props.optionAttribute ? option[props.optionAttribute] : option;

    return label;
  }

  /* Create list with search results */
  const searchList = computed(() => {
    const filteredList: any[] = [];

    props.options.forEach((option) => {
      const label = optionLabel(option).toLowerCase();

      if (props.searchAttributes) {
        for (const searchAttribute of props.searchAttributes) {
          const attributeValue = option[searchAttribute].toLowerCase();
          if (attributeValue.includes(searchModel.value.toLowerCase())) {
            filteredList.push(option);
            break;
          }
        }
      } else if (label.includes(searchModel.value.toLowerCase())) {
        filteredList.push(option);
      }
    });

    return filteredList;
  });

  /* Arrow down */
  onKeyStroke('ArrowDown', (event: KeyboardEvent) => {
    if (!isListOpen.value) return;
    event.preventDefault();
    if (activeListEl.value === searchList.value.length - 1) return;

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
      const option = searchList.value[activeListEl.value];
      model.value = activeListEl.value;
      model.value = option;
    };

    isListOpen.value = false;
    emit('change');
  });

  /* Handle manual clicking */
  const onClick = (option: Object) => {
    model.value = props.options.findIndex(storedOption => storedOption === option);
    isListOpen.value = false;
    emit('change');
  }
</script>

<style lang="scss">
  .ui-select > button {
    width: 100%;
    padding: 0.375rem 0.625rem;
    border: solid 1px black;
    background-color: rgb(23, 23, 23);
    border-radius: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
      background-color: rgb(128, 128, 128);
    }
  }

  .ui-select-list {
    position: absolute;
    border: solid 1px black;
    border-radius: 0.5rem;
    z-index: 99;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 0.5rem;
    overflow: hidden;
    max-height: 15rem;
    overflow-y: scroll;

    & > input[type=text] {
      width: 100%;
      padding: 10px;
      outline: none;
      border: none;
      border-bottom: 1px solid black;
    }
    
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