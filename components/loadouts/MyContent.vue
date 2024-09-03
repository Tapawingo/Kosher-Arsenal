<template>
  <loadoutsModalNewLoadout v-model:isOpen="isNewLoadoutOpen" />
  <!-- <LoadoutsLoadoutDetails /> -->

  <div v-if="user">
    <div class="section">
  
      <h1>My loadouts</h1>
      <div class="body reversed">
        <div class="loadout" v-for="loadout in myLoadouts">
          <div class="preview">
            <img :src="loadout.preview.path" alt="Preview" />
          </div>
          <div class="meta">
            <div class="tags">
              <div v-for="tag in loadout.tags">{{ tag.label }}</div>
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
  
        <div class="loadout-new" @click="isNewLoadoutOpen = true">
          <span class="plus-icon">+</span>
          <span>NEW</span>
          <span>LOADOUT</span>
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
  const isNewLoadoutOpen = ref(false);
  const selectedLoadout = ref();
  
  const { data, error } = await useFetch(`/api/loadout/loadouts/${ user.value?.id }`);

  if (error.value) {
    toast.add({ title: "Error", description: error.value.message, color: "red" });
  } else {
    myLoadouts.value = data.value!;
  };

  const viewLoadout = async (loadoutId: string) => {
    const arsenalStore = useArsenalStore();
    arsenalStore.setMode(ArsenalMode.view);

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
          const arsenalStore = useArsenalStore();
          arsenalStore.setMode(ArsenalMode.edit);

          await navigateTo(`/loadout/${ selectedLoadout.value.id }`);
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
            console.log(error.value)
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