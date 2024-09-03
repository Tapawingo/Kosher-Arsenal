<template>
  <div class="info" :class="selectedClass" @click="toggleInfo()">
    <div class="info-title">

      <div>
        <UTooltip v-if="arsenalStore.mode == ArsenalMode.edit" text="Edit Loadout Info" :popper="{ placement: 'top' }" :ui="classOverride">
          <Icon name="material-symbols:edit" @click.stop="isInfoModalOpen = true"/>
        </UTooltip>
      </div>

      <div>{{ arsenalStore.loadout.title }}</div>
      
      <div>
        <UTooltip v-if="arsenalStore.mode == ArsenalMode.edit" text="Change Preview Image" :popper="{ placement: 'top' }" :ui="classOverride">
          <Icon name="material-symbols:add-photo-alternate" @click.stop="isPreviewModalOpen = true"/>
        </UTooltip>
      </div>

    </div>

    <div class="info-content">
      <div class="info-description">{{ arsenalStore.loadout.description }}</div>
      <div class="info-tags">
        <span>Tags:</span>
        <div v-for="tag in arsenalStore.loadout.tags">{{ tag.label }}</div>
      </div>
    </div>
  </div>

  <ArsenalModalPreviewUpload v-model="isPreviewModalOpen" />

  <UModal class="arsenal-modal" v-model="isInfoModalOpen">
    <div class="arsenal-modal-body">
      <UFormGroup label="Title" required>
        <UInput v-model="newLoadoutTitle" />
      </UFormGroup>

      <UFormGroup label="Description" required>
        <UTextarea autoresize v-model="newLoadoutDescription" />
      </UFormGroup>

      <UFormGroup label="Tags">
        
      </UFormGroup>

      <div class="button-group">
        <UButton label="Cancel" color="red" @click="isInfoModalOpen = false"/>
        <UButton label="Save" @click="saveInfo" />
      </div>
    </div>
  </UModal>
</template>

<script lang="ts" setup>
import { ArsenalMode } from '~/stores/arsenal';

  const arsenalStore = useArsenalStore();

  const isInfoModalOpen = ref(false);
  const isPreviewModalOpen = ref(false);
  const infoSelected = ref(false);
  const newLoadoutTitle = ref(arsenalStore.loadout.title);
  const newLoadoutDescription = ref(arsenalStore.loadout.description);
  const newLoadoutTags = ref(arsenalStore.loadout.tags); /* @TODO: Create Tag editor */
  
  const selectedClass = reactive({
    selected: infoSelected
  })

  const classOverride = {
    background: '',
    base: "arsenal-tooltip",
    ring: '',
    color: "white"
  };

  const toggleInfo = () => {
    infoSelected.value = !infoSelected.value;
  }

  const saveInfo = () => {
    arsenalStore.loadout.title = newLoadoutTitle.value;
    arsenalStore.loadout.description = newLoadoutDescription.value;
    arsenalStore.loadout.tags = newLoadoutTags.value;
    arsenalStore.saveLoadout();
    isInfoModalOpen.value = false;
  }
</script>

<style lang=scss>
  .info {
    text-align: center;
    font-size: 1rem;
    cursor: pointer;
    background-color: rgba(85, 85, 85, 0.6);
    border: 1px solid rgb(0, 0, 0);
    margin: 5px auto 5px auto;
    width: 75%;

    .info-title {
      padding: 0.1rem 0.5rem;
      padding-bottom: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .info-content {
      text-align: left;
      transition: 0.25s linear max-height;
      padding: 0rem;
      font-size: 0.75rem;
      overflow: hidden;
      max-height: 0px;

      .info-description {
        padding: 0.3rem 0.2rem;
      }

      .info-tags {
        border-top: 1px solid rgba(0, 0, 0, 1);
        padding: 0.4rem 0.2rem;

        div {
          display: inline-block;
          background-color: rgba(37, 37, 37, 0.6);
          border-radius: 2px;
          font-size: 0.75rem;
          padding: 0.2rem 0.3rem;
          margin-left: 5px;
        }
      }
    }

    &.selected .info-title {
        padding: 0.3rem;
        background-color: rgba(255, 255, 255, 0.25);

        &:hover {
            background-color: rgba(255, 255, 255, 0.25);
        }
    }

    &.selected .info-content {
        padding: 0.2rem;
        max-height: 10rem;
    }

    &:hover:not(.selected) {
        background-color: rgba(255, 255, 255, 0.25);
    }
  }

  .input[type=file] {
    cursor: pointer;
  }
</style>