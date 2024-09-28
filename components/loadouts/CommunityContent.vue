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
      <div class="tag" v-if="recTags" v-for="tag in recTags">
        <h2>{{ tag.prettyLabel.replace('#', '') }}</h2>
        <span>{{ tag.loadouts.length }} Loadouts</span>
      </div>
      <div class="load-message" v-if="!recTags">Loading Tags...</div>
      <div class="load-message" v-if="recTags && recTags.length === 0">Could not find any tags. Try again later.</div>
    </div>
  </div>
  <div class="section popular">
    <h3>Popular loadouts (temporarily all public loadouts)</h3>
    <div class="body">
      <div class="loadout" v-for="loadout in popLoadouts">
        <div class="preview">
          <img :src="loadout.preview.path" />
        </div>
        <div class="meta">
          <div class="tags">
            <div v-for="tag in loadout.tags">{{ tag.label }}</div>
          </div>
          <h1> {{ loadout.title }} </h1>
          <p>{{ loadout.description }}</p>
          <div class="actions">
            <button @click="viewLoadout(loadout.id)">View</button>
          </div>
        </div>
      </div>
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

  const recCollections = ref<Array<LoadoutCollectionJson>>([]);
  const recTags = ref<LoadoutTag[] | undefined>();
  const popLoadouts = ref<ArsenalLoadoutJson[]>([]);
  
  onMounted(() => {
    useFetch(`/api/loadout/loadouts`).then((res) => {
      if (res.error.value) {
        toast.add({ title: "Error", description: res.error.value.message, color: "red" });
      } else {
        popLoadouts.value = res.data.value!;
      };
    });

    $fetch(`/api/tag/topTags`).then((res) => {
      if (res) {
        recTags.value = res.map(data => new LoadoutTag().fromJSON(JSON.stringify(data)));
      }
    }).catch((e: any) => {
      toast.add({ title: "Error", description: e.message, color: "red" });
    });

    $fetch(`/api/loadout/loadouts`).then((res) => {
      if (res) {
        popLoadouts.value = res!;
      };
    }).catch((e: any) => {
      toast.add({ title: "Error", description: e.message, color: "red" });
    });
  });
</script>

<style>

</style>