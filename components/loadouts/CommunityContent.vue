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
      <div class="load-message" v-if="recCollections.length === 0">Could not find any collections. Try again later.</div>
    </div>
  </div>
  <div class="section discover">
    <h2>Discover popular tags</h2>
    <div class="body">
      <div class="tag" v-if="recTags" v-for="tag in recTags" @click="viewTag(tag.label)">
        <h2>{{ tag.prettyLabel.replace('#', '') }}</h2>
        <span>{{ tag.loadouts.length }} Loadouts</span>
      </div>
      <div class="load-message" v-if="!recTags"><div class="loader"></div></div>
      <div class="load-message" v-if="recTags && recTags.length === 0">Could not find any tags. Try again later.</div>
    </div>
  </div>
  <div class="section popular">
    <h3>Popular loadouts (temporarily all public loadouts)</h3>
    <div class="body">
      <LoadoutsLoadout 
        v-if="popLoadouts" 
        v-for="loadout in popLoadouts.slice().reverse()" 
        :loadout="loadout"
      />

      <div class="load-message" v-if="!popLoadouts"><div class="loader"></div></div>
      <div class="load-message" v-if="popLoadouts && popLoadouts.length === 0">Could not find any loadouts. Try again later.</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { ArsenalLoadoutJson } from '~/classes/ArsenalLoadout';
  import { LoadoutTag, LoadoutTagType, type LoadoutTagJson } from '~/classes/LoadoutTag';
  import type { LoadoutCollectionJson } from '~/classes/LoadoutCollection';

  const toast = useToast();

  const viewLoadout = async (loadoutId: string) => {
    const arsenalStore = useArsenalStore();
    arsenalStore.setMode(ArsenalMode.view);

    await navigateTo(`/loadout/${ loadoutId }`);
  };

  const viewTag = async (tagLabel: string) => {
    await navigateTo(`/tag/${ tagLabel }`);
  }

  const recCollections = ref<Array<LoadoutCollectionJson>>([]);
  const recTags = ref<LoadoutTag[]>();
  const popLoadouts = ref<ArsenalLoadoutJson[]>();
  
  onMounted(() => {
    $fetch(`/api/tag/topTags`).then((res) => {
      if (res) {
        recTags.value = res.map(data => new LoadoutTag().fromJSON(JSON.stringify(data)));
      }
    }).catch((e: any) => {
      toast.add({ title: "Error", description: e.message, color: "red" });
      popLoadouts.value = [];
    });

    $fetch(`/api/loadout/loadouts`).then((res) => {
      if (res) {
        popLoadouts.value = res!;
      };
    }).catch((e: any) => {
      toast.add({ title: "Error", description: e.message, color: "red" });
      popLoadouts.value = [];
    });
  });
</script>

<style>

</style>