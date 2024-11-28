<template>
  <loadoutsModalNewLoadout v-model:isOpen="isNewLoadoutOpen" />

  <div v-if="user">
    <div class="section">
  
      <h1>My loadouts</h1>
      <div class="body">
        <div class="loadout loadout-new" @click="isNewLoadoutOpen = true">
          <span class="plus-icon">+</span>
          <span>NEW</span>
          <span>LOADOUT</span>
        </div>

        <LoadoutsLoadout 
          v-if="myLoadouts" 
          v-for="loadout in myLoadouts.slice().reverse()" 
          :loadout="loadout" 
          showOptions
          @onDelete="onLoadoutDelete"
        />

        <div class="load-message" v-if="!myLoadouts">Loading Loadouts...</div>
      </div>
    </div>
  
    <div class="section discover">
      <h2>My buylists</h2>
      <div class="body">
        <LoadoutsLoadout 
          v-if="myLoadouts" 
          v-for="buylist in myBuylists" 
          :loadout="buylist" 
          isBuylist
          @onDelete="onLoadoutDelete"
        />

        <div class="load-message" v-if="!myBuylists">Loading Buylists...</div>
      </div>
    </div>
  
    <div class="section discover">
      <h2>My collections</h2>
      <div class="body">
        <span style="width: 100%; text-align: center;">WIP</span>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="section">
      <h1>Login to see your content</h1>
      <NuxtLink to="/signin">Login</NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { ArsenalLoadoutJson } from '~/classes/ArsenalLoadout';
  import type { LoadoutCollectionJson } from '~/classes/LoadoutCollection';

  const toast = useToast();
  const user = useUser();

  const myCollections = ref<Array<LoadoutCollectionJson>>([]);
  const myLoadouts = ref<ArsenalLoadoutJson[] | undefined>();
  const myBuylists = ref<ArsenalLoadoutJson[] | undefined>();
  const isNewLoadoutOpen = ref(false);
    
  onMounted(async () => {
    if (user.value) {
      /* Get loadouts */
      try {
        const loadouts = await $fetch(`/api/loadout/loadouts/${ user.value?.id }`);
        if (loadouts) {
          myLoadouts.value = loadouts;
        };
      } catch (e: any) {
        toast.add({ title: "Error", description: e.message, color: "red" });
      }
      
      /* Get buylists */
      try {
        const buylists = await $fetch('/api/buylist/buylists');
        if (buylists) {
          myBuylists.value = buylists;
        };
      } catch(e: any) {
        toast.add({ title: "Error", description: e.message, color: "red" });
      };
    }
  });

  /* Open buylist */
  const viewBuylist = async (loadoutId: string) => {
    await navigateTo(`/loadout/${ loadoutId }?mode=1`);
  };

  /* Remove deleted loadout from list */
  const onLoadoutDelete = (loadout: ArsenalLoadoutJson) => {
    const index = myLoadouts.value!.findIndex((storedLoadout: ArsenalLoadoutJson) => storedLoadout.id === loadout.id);
    myLoadouts.value!.splice(index, 1);
  }
</script>