<template>
  <div class="section">

    <h1>My loadouts</h1>
    <div class="body">
      <div class="loadout-new">
        <span class="plus-icon">+</span>
        <span>NEW</span>
        <span>LOADOUT</span>
      </div>

      <div class="loadout" v-for="loadout in myLoadouts">
        <div class="preview">
          <NuxtImg :src="loadout.preview.path" />
        </div>
        <div class="meta">
          <div class="tags">
            <div v-for="tag in loadout.tags">{{ tag.label }}</div>
          </div>
          <h1> {{ loadout.title }} </h1>
          <p>{{ loadout.description }}</p>
          <NuxtLink :to="`loadout/${ loadout.id }`" noPrefetch>View</NuxtLink>
        </div>
      </div>
    </div>
  </div>

  <div class="section discover">
    <h2>My collections</h2>
    <div class="body">
      <div class="tag" v-for="collection in myCollections">
        <h2>{{ collection.title }}</h2>
        <span>{{ collection.loadouts.length }} Loadouts</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { LoadoutCollectionJson } from '~/classes/LoadoutCollection';

  const toast = useToast();
  const user = useUser();

  const myCollections = ref<Array<LoadoutCollectionJson>>([]);
  const { data: myLoadouts, error } = await useFetch(`/api/loadout/loadouts/${ user.value?.id }`);

  if (error.value) {
    toast.add({ title: "Error", description: error.value.message, color: "red" });
  };
</script>