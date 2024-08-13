<template>
  <div class="info" :class="selectedClass" @click="toggleInfo()">
    <div class="info-title">{{ loadout.title }}</div>
    <div class="info-content">{{ loadout.description }}</div>
  </div>
</template>

<script lang="ts" setup>
import type { ArsenalLoadout } from '~/classes/ArsenalLoadout';

  const loadout = useState<ArsenalLoadout>('loadout');
  const infoSelected = ref(false);
  const selectedClass = reactive({
    selected: infoSelected
  })

  const toggleInfo = () => {
    infoSelected.value = !infoSelected.value;
  }
</script>