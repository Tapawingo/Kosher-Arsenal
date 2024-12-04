<template>
  <div class="loadout" @click.stop="viewDetails(props.loadout)">

    <div class="card-title">
      <div class="avatar">
        <img :src="props.loadout.owner?.avatar" alt="Avatar">
      </div>
      <NuxtLink class="identity" :to="`/profile/${ props.loadout.owner?.username }`">
        <span class="displayname">{{ props.loadout.owner?.display_name }}</span>
      </NuxtLink>
    </div>

    <div class="card-body" @click="isDetailOpen = true">
      <div class="preview">
        <img :src="loadout.preview.path" alt="Preview" />
      </div>
      <div class="meta">
        <div class="tags">
          <div v-for="tag in loadout.tags">#{{ tag.label.replace('y:', '').replace('d:', '') }}</div>
        </div>
        <h1> {{ loadout.title }} </h1>
        <p>{{ loadout.description }}</p>
      </div>
    </div>
    <div class="actions">
      <button v-if="!props.isBuylist" @click="viewLoadout(loadout.id)">View</button>
      <button v-if="props.isBuylist" @click="viewBuylist(loadout.id)">View Buylist</button>
      <UDropdown :popper="{ placement: 'bottom-start' }" :items="loadoutActions" v-if="showOptions">
        <UButton class="dropdown" label="Options" trailing-icon="i-heroicons-chevron-down-20-solid"/>
      </UDropdown>
    </div>
  </div>

  <LoadoutsLoadoutDetails 
    v-model:isOpen="isDetailOpen" 
    :loadout="props.loadout"
    :owner="props.loadout.owner"
  />
</template>

<script lang="ts" setup>
  import type { ArsenalLoadoutJson, UserMetaJson } from '~/classes/ArsenalLoadout';

  const emit = defineEmits(['onDelete']);
  const props = withDefaults(
    defineProps<{ loadout: ArsenalLoadoutJson, showOptions?: boolean, isBuylist?: boolean }>(),
    {
      showOptions: false,
      isBuylist: false
    }
  );

  const toast = useToast();
  const isDetailOpen = ref(false);

  /* if (typeof props.loadout.owner === 'string') {
    console.log(typeof props.loadout.owner);
    const { data: owner } = await useFetch<UserMetaJson>(`/api/user/id/${ props.loadout.owner }`, { server: true });
    if (owner.value) {
      props.loadout.owner = owner.value;
    } else {
      toast.add({ title: "Error", description: 'Failed to fetch user data.', color: "red" });
    }
  } */

  const viewDetails = (loadout: ArsenalLoadoutJson) => {
    /* Open detail panel */
  }

  /* Open Preview */
  const viewLoadout = async (loadoutId: string) => {
    await navigateTo(`/loadout/${ loadoutId }`);
  };

  /* Open buylist */
  const viewBuylist = async (loadoutId: string) => {
    await navigateTo(`/loadout/${ loadoutId }?mode=1`);
  };

  /* Open edit */
  const editLoadout = async (loadoutId: string) => {
    await navigateTo(`/loadout/${ loadoutId }?mode=2`);
  };

  const loadoutActions = [
    [
      { label: 'Share', icon: 'material-symbols:link-rounded', disabled: true },
      { label: 'Change visibility', icon: 'material-symbols:visibility-rounded', disabled: true }
    ],
    [
      { 
        label: 'Buylist', icon: 'material-symbols:check-box', click: async () => {
          viewBuylist(props.loadout.id);
        }
      },
      {
        label: 'Edit', icon: 'material-symbols:edit-square-outline', /* shortcuts: ['E'], */ click: async () => {
          editLoadout(props.loadout.id);
        }
      }, 
      { label: 'Duplicate', icon: 'material-symbols:content-copy-rounded', /* shortcuts: ['D'], */ disabled: true }
    ],
    [
      {
        label: 'Delete', icon: 'material-symbols:delete-rounded', /* shortcuts: ['X'], */ click: async () => {
          const { error } = await useFetch(`/api/loadout/delete/${ props.loadout.id }`);

          if (error.value) {
            toast.add({ title: 'Error', description: error.value?.message, color: 'red' });
          } else {
            toast.add({ description: 'Deleted loadout', color: 'green' });

            emit('onDelete', props.loadout);
          }
        }
      }
    ]
  ];
</script>