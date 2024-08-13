<template>
  <div class="info" :class="selectedClass" @click="toggleInfo()">
    <div class="info-title">Example Loadout</div>
    <div class="info-content">Example description for example loadout</div>
  </div>
</template>

<script lang="ts" setup>
  const infoSelected = ref(false);
  const selectedClass = reactive({
    selected: infoSelected
  })

  const toggleInfo = () => {
    infoSelected.value = !infoSelected.value;
  }
</script>