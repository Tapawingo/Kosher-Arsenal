<template>
  <div class="page-tag">
    <header class="header">
      <h1> 
        {{ tag?.prettyLabel.substring(1) }} 
        <span v-if="tag && tag?.type !== LoadoutTagType.text">
          ({{ tag?.prettyType }})
        </span>
      </h1>
      <button>Follow</button>
    </header>
    <section class="loadouts">
      <div class="loadout" v-for="loadout in loadouts">
        <div class="preview">
          <img :src="loadout.preview.path" />
        </div>
        <div class="meta">
          <div class="tags">
            <div v-for="tag in loadout.tags">
              #{{ tag.label.replace('y:', '').replace('d:', '') }}
            </div>
          </div>
          <h1> {{ loadout.title }} </h1>
          <p>{{ loadout.description }}</p>
          <div class="actions">
            <button @click="viewLoadout(loadout.id)">View</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
  import { LoadoutTag, LoadoutTagType } from '@/classes/LoadoutTag';
  import { type ArsenalLoadoutJson } from '~/classes/ArsenalLoadout';

  const route = useRoute();
  const toast = useToast();

  const label = route.params.label as string;
  const tag = ref<LoadoutTag>();
  const loadouts = ref<ArsenalLoadoutJson[]>()

  const { data, error } = await useFetch(`/api/tag/label/${ decodeURI(label) }`);
  if (data.value) {
    tag.value = new LoadoutTag(data.value.label, data.value.type);
    loadouts.value = data.value.loadouts;
  } else if (error.value) {
    toast.add({ title: "Error", description: error.value.message, color: "red" });
  }

  const viewLoadout = async (loadoutId: string) => {
    const arsenalStore = useArsenalStore();
    arsenalStore.setMode(ArsenalMode.view);

    await navigateTo(`/loadout/${ loadoutId }`);
  };

  definePageMeta({
    layout: 'sitenav'
  });
</script>

<style>

</style>