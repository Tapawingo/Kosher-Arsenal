<template>
  <div class="list-item" :class="selectedClass" @click="toggleItem()" ref="ItemRoot">
    <div class="title">
      <div class="preview">
        <img v-if="item.preview.path" :src="item.preview.path" alt="Preview" />
      </div>

      <!-- <div v-if="arsenalStore.isBuylistMode()" class="checkbox" @click.stop="isChecked = !isChecked; onbuylistSubmit()">
        <input type="checkbox" :checked="isChecked"/>
        <span class="checkbox-checkmark"></span>
      </div> -->

      <span>{{ item.title }}</span>

      <!-- <div class="buylist-content" v-if="arsenalStore.isBuylistMode()">
        <UTooltip class="tooltip buylist-store" text="Go to Store" :popper="{ placement: 'bottom' }" :ui="classOverride" v-if="buylistItem.store">
          <Icon name="material-symbols:storefront" @click.stop="openStore" />
        </UTooltip>
        <UTooltip class="tooltip buylist-price" text="Price" :popper="{ placement: 'bottom' }" :ui="classOverride" v-if="buylistItem.price.price > 0">
          {{ buylistItem.price.price.toFixed(2) }} {{ currencies.find(currency => currency.code === buylistItem.price.currency)?.symbol }}
        </UTooltip>
      </div> -->

    </div>
    <div class="body" @click.stop>{{ item.description }}</div>
  </div>
</template>

<script lang="ts" setup>
  import { type ArsenalItemJson } from '~/classes/ArsenalItem';
  import { storeToRefs } from 'pinia'
  
  const emit = defineEmits(['onSelectToggle']);
  const props = withDefaults(defineProps<{item: ArsenalItemJson, isSub?: boolean}>(), {
    isSub: false
  });

  const arsenalStore = useArsenalStore();
  const { selectedItem, selectedSubItem } = storeToRefs(arsenalStore)
  
  /* Item select state */
  const itemState = ref(false);
  const selectedClass = reactive({
    selected: itemState
  })

  watch(props.isSub ? selectedSubItem : selectedItem, () => {
    if (!props.isSub && selectedItem.value != props.item) {
      itemState.value = false;
      arsenalStore.setSelectedSubCategory(null);
    } else if (props.isSub && selectedSubItem.value != props.item) {
      itemState.value = false;
    }
  })

  const toggleItem = () => {
    itemState.value = !itemState.value;
    emit('onSelectToggle', itemState.value);

    if (props.isSub) {
      arsenalStore.setSelectedSubItem(itemState.value ? props.item : null);
    } else {
      arsenalStore.setSelectedItem(itemState.value ? props.item : null);
    }
  }
</script>

<style>

</style>