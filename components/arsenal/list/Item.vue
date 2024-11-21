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
    <div ref="itemBodyEl" class="body" @click.stop>
      <span>{{ item.description }}</span>
      <ArsenalListCategory v-for="category in item.categories" :category="category" />
    </div>
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
  
  /* Item select state */
  const itemState = ref(false);
  const itemBodyEl = ref();
  const selectedClass = reactive({
    selected: itemState
  })

  const toggleItem = () => {
    itemState.value = !itemState.value;
    emit('onSelectToggle', itemState.value);

    setHeight();
  }

  const setHeight = () => {
    if (!itemBodyEl.value) return;
    itemBodyEl.value.style.height = `${ calculateHeight() }px`;
    itemBodyEl.value.style.minHeight = `${ calculateHeight() }px`;

    if (!itemState.value) return;
    setTimeout(() => {
      if (!itemBodyEl.value) return;
      itemBodyEl.value.style.height = `auto`;
    }, 300);
  }

  const calculateHeight = () => {
    if (!itemBodyEl.value || !itemState.value) return 0;
    
    let height = 0;
    Array.from(itemBodyEl.value.children).forEach((child) => {
      const styles = window.getComputedStyle(child as HTMLElement);
      const margin = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);
  
      height += Math.ceil((child as HTMLElement).offsetHeight + margin);
    });

    return Math.max(height + 5, 96);
  }
</script>

<style>

</style>