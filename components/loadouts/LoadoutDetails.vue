<template>
  <div class="loadout-details" :class="{ visible: isOpen, hidden: !isOpen }">
    <div class="body">
      <div class="owner-container">
        <div class="avatar">
          <img :src="props.loadout.owner.avatar" alt="Avatar">
        </div>
        <NuxtLink class="identity" :to="`/profile/${ props.loadout.owner.username }`">
          <span class="displayname">{{ props.loadout.owner.display_name }}</span>
          <span class="username">@{{ props.loadout.owner.username }}</span>
        </NuxtLink>
      </div>
      <h1>{{ loadout.title }}</h1>
      <div class="details">
        <header>
          <p>{{ loadout.description }}</p>
          <div class="tags">
            <div v-for="tag in loadout?.tags">#{{ tag.label }}</div>
          </div>
        </header>

        <div class="meta">
          <div class="preview">
            <img :src="loadout.preview.path" alt="">
          </div>
          <div class="statistics">
            <UTooltip text="Visibility" class="visibility">
              <Icon :name="visibility2Icon(loadout?.visibility)" />
              <span>{{ visibility2String(loadout?.visibility) }}</span>
            </UTooltip>

            <UTooltip text="Views" class="views">
              <Icon name="material-symbols:visibility-rounded" />
              <span>X</span>
            </UTooltip>

            <UTooltip text="likes" class="likes">
                <Icon name="material-symbols:thumb-up" />
                <span>X</span>
            </UTooltip>
          </div>
        </div>
      </div>

      <div class="comments-preview">
        <span class="empty">No comments yet.<br/>Click below to start a conversation.</span>
        <button @click="isCommentsOpen = !isCommentsOpen" disabled>Toggle Comments</button>
      </div>

      <div class="button-row">
        <button class="danger" @click="isOpen = false">Close</button>
        <UDropdown :popper="{ placement: 'bottom-start' }" :items="[]">
          <UButton class="dropdown" label="Options" trailing-icon="i-heroicons-chevron-down-20-solid" disabled/>
        </UDropdown>
        <button @click="viewLoadout(loadout.id)">View in Arsenal</button>
      </div>

      <!-- <div class="comments-side-panel" :class="{ visible: isCommentsOpen }">
        <div class="comments-header">
          <button @click="isCommentsOpen = false">Close Comments</button>
        </div>
        <div class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="author">{{ comment.author }}</div>
            <p class="content">{{ comment.content }}</p>
            <div class="timestamp">{{ comment.timestamp }}</div>
          </div>
        </div>
      </div> -->
      
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { visibility2String, visibility2Icon, type ArsenalLoadoutJson } from '@/classes/ArsenalLoadout';

  const isOpen = defineModel<boolean>('isOpen', { default: true });
  const props = defineProps<{ loadout: ArsenalLoadoutJson, owner: any }>();

  const comments = ref<any[]>([
    { id: 1, author: 'User1', content: 'Great loadout!', timestamp: '2024-11-28 12:00' },
    { id: 2, author: 'User2', content: 'I love the choices!', timestamp: '2024-11-28 12:30' },
  ]);

  const isCommentsOpen = ref(false);
  //const user_meta = ref<any>({ display_name: '', username: '', avatar: '' });
  //const { data } = await useFetch<any>(`/api/user/id/${ props.loadout.owner }`);
  //user_meta.value = data;

  const viewLoadout = async (loadoutId: string) => {
    await navigateTo(`/loadout/${ loadoutId }`);
  };

</script>