<template>
  <div class="info" :class="selectedClass" @click="toggleInfo()">
    <div class="info-title">{{ loadout.title }}</div>
    <div class="info-content">
      <div class="info-description">{{ loadout.description }}</div>
      <div class="info-tags">
        <span>Tags:</span>
        <div v-for="tag in loadout.tags">{{ tag.label }}</div>
      </div>
    </div>
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

<style lang=scss>
  .info {
    text-align: center;
    font-size: 1rem;
    cursor: pointer;
    background-color: rgba(85, 85, 85, 0.6);
    border: 1px solid rgb(0, 0, 0);
    margin: 5px auto 5px auto;
    width: 75%;

    .info-title {
      padding: 0.1rem;
      padding-bottom: 0;
    }
    
    .info-content {
      text-align: left;
      transition: 0.25s linear max-height;
      padding: 0rem;
      font-size: 0.75rem;
      overflow: hidden;
      max-height: 0px;

      .info-description {
        padding: 0.3rem 0.2rem;
      }

      .info-tags {
        border-top: 1px solid rgba(0, 0, 0, 1);
        padding: 0.4rem 0.2rem;

        div {
          display: inline-block;
          background-color: rgb(190, 32, 32);
          border-radius: 4px;
          padding: 2px;
          margin-left: 5px;
        }
      }
    }

    &.selected .info-title {
        padding: 0.3rem;
        background-color: rgba(255, 255, 255, 0.25);

        &:hover {
            background-color: rgba(255, 255, 255, 0.25);
        }
    }

    &.selected .info-content {
        padding: 0.2rem;
        max-height: 5rem;
    }

    &:hover:not(.selected) {
        background-color: rgba(255, 255, 255, 0.25);
    }
  }
</style>