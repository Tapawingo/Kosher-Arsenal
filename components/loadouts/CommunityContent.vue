<template>
  <div class="section explore">
    <h1>Explore collections</h1>
    <div class="body">
      <div 
        class="collection" 
        v-for="collection in recCollections" 
        :style="{ backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url(${ collection.preview })` }"
      >
        <h2>{{ collection.title }}</h2>
        <span>{{ collection.loadouts.length }} Loadouts</span>
        <button>View Collection</button>
      </div>
    </div>
  </div>
  <div class="section discover">
    <h2>Discover popular tags</h2>
    <div class="body">
      <div class="tag" v-for="tag in recTags">
        <h2>{{ tag.label }}</h2>
        <span>{{ tag.loadouts.length }} Loadouts</span>
      </div>
    </div>
  </div>
  <div class="section popular">
    <h3>Popular loadouts</h3>
    <div class="body">
      <div class="loadout" v-for="loadout in popLoadouts">
        <div class="preview">
          <NuxtImg :src="loadout.preview.path" />
        </div>
        <div class="meta">
          <div class="tags">
            <div v-for="tag in loadout.tags">{{ tag.label }}</div>
          </div>
          <h1> {{ loadout.title }} </h1>
          <p>{{ loadout.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { ArsenalLoadoutJson } from '~/classes/ArsenalLoadout';
  import { LoadoutTagType, type LoadoutTagJson } from '~/classes/LoadoutTag';
  import type { LoadoutCollectionJson } from '~/classes/LoadoutCollection';

  /* temporary fake data */
  const recCollections = ref<Array<LoadoutCollectionJson>>([
    { id: 'id#example1', title: 'Example Collection 1', preview: 'fillers/collection.png', loadouts: [] },
    { id: 'id#example2', title: 'Example Collection 2', preview: 'fillers/collection.png', loadouts: [] },
    { id: 'id#example3', title: 'Example Collection 3', preview: 'fillers/collection.png', loadouts: [] }
  ]);

  const recTags = ref<Array<LoadoutTagJson>>([
    { type: LoadoutTagType.text, label: 'Example Tag 1', loadouts: [] },
    { type: LoadoutTagType.text, label: 'Example Tag 2', loadouts: [] },
    { type: LoadoutTagType.text, label: 'Example Tag 3', loadouts: [] },
    { type: LoadoutTagType.text, label: 'Example Tag 4', loadouts: [] },
    { type: LoadoutTagType.text, label: 'Example Tag 5', loadouts: [] },
    { type: LoadoutTagType.text, label: 'Example Tag 6', loadouts: [] },
    { type: LoadoutTagType.text, label: 'Example Tag 7', loadouts: [] },
    { type: LoadoutTagType.text, label: 'Example Tag 8', loadouts: [] },
    { type: LoadoutTagType.text, label: 'Example Tag 9', loadouts: [] },
    { type: LoadoutTagType.text, label: 'Example Tag 10', loadouts: [] },
  ]);

  const popLoadouts = ref<Array<ArsenalLoadoutJson>>([]);

  await callOnce(async () => {
    popLoadouts.value = await $fetch(`/api/fetchLoadouts`);
  })
</script>

<style>

</style>