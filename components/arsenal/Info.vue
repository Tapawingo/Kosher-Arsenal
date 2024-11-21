<template>
  <div class="info" :class="selectedClass" @click="toggleInfo()">
    <div class="info-title">

      <div class="edit">
        <UTooltip v-if="arsenalStore.isEditMode()" text="Edit Loadout Info" :popper="{ placement: 'top' }" :ui="classOverride">
          <Icon name="material-symbols:edit" @click.stop="isInfoModalOpen = true"/>
        </UTooltip>
        <UTooltip v-if="!arsenalStore.isEditMode() && arsenalStore.isNormalViewMode()" text="List Mode (Alpha Preview)" :popper="{ placement: 'top' }" :ui="classOverride">
          <Icon name="material-symbols:list" @click.stop="arsenalStore.setViewMode(ArsenalViewMode.list)"/>
        </UTooltip>
        <UTooltip v-if="!arsenalStore.isEditMode() && arsenalStore.isListViewMode()" text="Normal Mode" :popper="{ placement: 'top' }" :ui="classOverride">
          <Icon name="material-symbols:width-normal" @click.stop="arsenalStore.setViewMode(ArsenalViewMode.normal)"/>
        </UTooltip>
      </div>

      <div>{{ arsenalStore.loadout.title }}</div>
      
      <div class="import-export">
        <UTooltip v-if="arsenalStore.isEditMode()" text="Export JSON" :popper="{ placement: 'top' }" :ui="classOverride">
          <Icon name="material-symbols:upload-rounded" @click.stop="onExport"/>
        </UTooltip>
        <UTooltip v-if="arsenalStore.isEditMode()" text="import JSON" :popper="{ placement: 'top' }" :ui="classOverride">
          <Icon name="material-symbols:download-rounded" @click.stop="" class="disabled"/>
        </UTooltip>
      </div>

    </div>

    <div class="info-content">
      <div class="info-description">{{ arsenalStore.loadout.description }}</div>
      <div class="info-tags">
        <div v-for="tag in arsenalStore.loadout.tags">{{ tag.label.replace('y:', '').replace('d:', '') }}</div>
      </div>
    </div>
  </div>

  <ArsenalModalInfo 
    v-model:is-open="isInfoModalOpen"
    v-model:form-data="infoModalData"
    @submit="onSubmit"
  />

  <a ref="exportLink" href="" style="display: none"></a>
</template>

<script lang="ts" setup>
  import type { LoadoutTagJson } from '~/classes/LoadoutTag';
import { ArsenalViewMode } from '~/stores/arsenal';

  const arsenalStore = useArsenalStore();

  const exportLink = ref<HTMLAnchorElement>();
  const isInfoModalOpen = ref(false);
  const infoSelected = ref(false);
  const infoModalData = ref<{ title: string, description: string, tags: LoadoutTagJson[], preview: File | undefined }>({
    title: arsenalStore.loadout.title,
    description: arsenalStore.loadout.description,
    tags: arsenalStore.loadout.tags,
    preview: undefined
  });
  
  const selectedClass = reactive({
    selected: infoSelected
  });

  const classOverride = {
    background: '',
    base: "arsenal-tooltip",
    ring: '',
    color: "white"
  };

  const toggleInfo = () => {
    infoSelected.value = !infoSelected.value;
  };

  /* Update modal defaults */
  arsenalStore.on('onLoadoutFetched', () => {
    infoModalData.value = {
      title: arsenalStore.loadout.title,
      description: arsenalStore.loadout.description,
      tags: arsenalStore.loadout.tags,
      preview: undefined
    }
  });

  const onExport = () => {
    const toast = useToast();
    if (!exportLink.value) {
      toast.add({
        title: 'Error',
        description: 'Failed to export JSON'
      });
      return;
    }

    exportLink.value.href = 'data:attachment/text,' + encodeURI(JSON.stringify(arsenalStore.loadout));
    exportLink.value.target = '_blank';
    exportLink.value.download = `${ arsenalStore.loadout.title }.json`;
    exportLink.value.click();
  };

  const onSubmit = async () => {
    const toast = useToast();
    arsenalStore.loadout.title = infoModalData.value.title;
    arsenalStore.loadout.description = infoModalData.value.description;
    arsenalStore.loadout.tags = infoModalData.value.tags;

    if (infoModalData.value.preview) {
      const file = new File(
        [infoModalData.value.preview], 
        `loadout-${ arsenalStore.loadout.id }`, 
        { type: infoModalData.value.preview.type }
      );
      const upload = useUpload('/api/loadout/preview', { method: 'PUT' });
      const blob = await upload(file);

      arsenalStore.loadout.preview = new ArsenalPreviewImage({ path: `/images/${ blob.pathname }` });
    }

    /* Set tags */
    arsenalStore.loadout.tags.forEach(tag => {
      $fetch('/api/tag/set', {
        method: 'POST',
        body: {
          label: tag.label,
          type: tag.type,
          loadoutId: arsenalStore.loadout.id
        }
      }).catch((e: any) => {
        toast.add({
          title: 'Error',
          description: e.toString()
        });
      })
    });

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

      & > .edit {
        display: flex;
        width: 2.5rem;
      }

      & > .import-export {
        display: flex;
        width: 2.5rem;
        gap: 0.5rem;

        span {
          scale: 1.2;
        }

        .disabled {
          cursor: auto;
          color: rgb(182, 182, 182);
        }
      }

      
      &:hover:not(.selected) {
          background-color: rgba(255, 255, 255, 0.25);
      }
    }
    
    .info-content {
      text-align: left;
      transition: 0.25s linear max-height !important;
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
      transition: 0.25s linear max-height !important;
      padding: 0.2rem;
      max-height: 10rem;
    }
  }

  .input[type=file] {
    cursor: pointer;
  }
</style>