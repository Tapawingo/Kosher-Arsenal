<template>
  <loadoutsModalNewLoadout v-model:isOpen="isNewLoadoutOpen" />
  <!-- <LoadoutsLoadoutDetails :loadout="myLoadouts[0]" /> -->

  <div v-if="user">
    <div class="section">
  
      <h1>My loadouts</h1>
      <div class="body">
        <div class="loadout-new" @click="isNewLoadoutOpen = true">
          <span class="plus-icon">+</span>
          <span>NEW</span>
          <span>LOADOUT</span>
        </div>

        <div class="loadout" v-for="loadout in myLoadouts.slice().reverse()">
          <div class="preview">
            <img :src="loadout.preview.path" alt="Preview" />
          </div>
          <div class="meta">
            <div class="tags">
              <div v-for="tag in loadout.tags">#{{ tag.label.replace('y:', '').replace('d:', '') }}</div>
            </div>
            <h1> {{ loadout.title }} </h1>
            <p>{{ loadout.description }}</p>
            <div class="actions">
              <button @click="viewLoadout(loadout.id)">View</button>
              <UDropdown :popper="{ placement: 'bottom-start' }" :items="loadoutActions">
                <UButton class="dropdown" label="Options" trailing-icon="i-heroicons-chevron-down-20-solid" @click="selectedLoadout = loadout"/>
              </UDropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <div class="section discover">
      <h2>My buylists</h2>
      <div class="body">
        <div class="loadout" v-for="buylist in myBuylists">
          <div class="preview">
            <img :src="buylist.preview.path" alt="Preview" />
          </div>
          <div class="meta">
            <div class="tags">
              <div v-for="tag in buylist.tags">#{{ tag.label.replace('y:', '').replace('d:', '') }}</div>
            </div>
            <h1> {{ buylist.title }} </h1>
            <p>{{ buylist.description }}</p>
            <div class="actions">
              <button @click="viewBuylist(buylist.id)">View Buylist</button>
            </div>
          </div>
        </div>
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
  const myLoadouts = ref<Array<ArsenalLoadoutJson>>([]);
  const myBuylists = ref<Array<ArsenalLoadoutJson>>([]);
  const isNewLoadoutOpen = ref(false);
  const selectedLoadout = ref();
    
  if (user) {
    /* Get loadouts */
    useFetch(`/api/loadout/loadouts/${ user.value?.id }`).then((res) => {    
      if (res.error.value) {
        toast.add({ title: "Error", description: res.error.value.message, color: "red" });
      } else {
        myLoadouts.value = res.data.value!;
      };
    });
    
    /* Get buylists */
    useFetch('/api/buylist/buylists').then((res) => {
      if (res.error.value) {
        toast.add({ title: "Error", description: res.error.value.message, color: "red" });
      } else {
        myBuylists.value = res.data.value!;
      };
    });
  }

  /* Open Preview */
  const viewLoadout = async (loadoutId: string) => {
    const arsenalStore = useArsenalStore();
    arsenalStore.setMode(ArsenalMode.view);

    await navigateTo(`/loadout/${ loadoutId }`);
  };

  /* Open buylist */
  const viewBuylist = async (loadoutId: string) => {
    const arsenalStore = useArsenalStore();
    arsenalStore.setMode(ArsenalMode.buylist);

    await navigateTo(`/loadout/${ loadoutId }`);
  };

  /* Open edit */
  const editLoadout = async (loadoutId: string) => {
    const arsenalStore = useArsenalStore();
    arsenalStore.setMode(ArsenalMode.edit);

    await navigateTo(`/loadout/${ loadoutId }`);
  };

  const loadoutActions = [
    [
      {
        label: 'Share',
        icon: 'material-symbols:link-rounded',
        disabled: true
      },
      {
        label: 'Change visibility',
        icon: 'material-symbols:visibility-rounded',
        disabled: true
      }
    ],
    [
      {
        label: 'Buylist',
        icon: 'material-symbols:check-box',
        click: async () => {
          if (!selectedLoadout.value) return;
          const arsenalStore = useArsenalStore();
          arsenalStore.setMode(ArsenalMode.buylist);

          await navigateTo(`/loadout/${ selectedLoadout.value.id }`);
        }
      },
      {
        label: 'Edit',
        icon: 'material-symbols:edit-square-outline',
        /* shortcuts: ['E'], */
        click: async () => {
          if (!selectedLoadout.value) return;
          editLoadout(selectedLoadout.value.id);
        }
      }, {
        label: 'Duplicate',
        icon: 'material-symbols:content-copy-rounded',
        /* shortcuts: ['D'], */
        disabled: true
      }
    ],
    [
      {
        label: 'Delete',
        icon: 'material-symbols:delete-rounded',
        /* shortcuts: ['D'], */
        click: async () => {
          if (!selectedLoadout.value) return;
          const { error } = await useFetch(`/api/loadout/delete/${ selectedLoadout.value.id }`);

          if (error.value) {
            toast.add({ title: 'Error', description: error.value?.message, color: 'red' });
          } else {
            toast.add({ description: 'Deleted loadout', color: 'green' });

            /* Delete loadout from local array */
            const loadoutIndex = myLoadouts.value.findIndex((loadout: ArsenalLoadoutJson) => loadout.id === selectedLoadout.value.id);
            myLoadouts.value.splice(loadoutIndex, 1);
          }
        }
      }
    ]
  ];
</script>