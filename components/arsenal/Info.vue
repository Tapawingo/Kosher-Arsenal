<template>
  <div class="info" :class="selectedClass" @click="toggleInfo()">
    <div class="info-title">
      <UTooltip text="Edit Loadout Info" :popper="{ placement: 'top' }" :ui="classOverride">
        <Icon name="material-symbols:edit" @click.stop=""/>
      </UTooltip>
      <div>{{ arsenalStore.loadout.title }}</div>
      <UTooltip text="Change Preview Image" :popper="{ placement: 'top' }" :ui="classOverride">
        <Icon name="material-symbols:add-photo-alternate" @click.stop="isPreviewModalOpen = true"/>
      </UTooltip>
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
</template>

<script lang="ts" setup>
  const arsenalStore = useArsenalStore();

  const isPreviewModalOpen = ref(false);
  const infoSelected = ref(false);
  
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
          background-color: rgb(190, 32, 32);
          border-radius: 4px;
          padding: 2px;
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
        max-height: 5rem;
    }

    &:hover:not(.selected) {
        background-color: rgba(255, 255, 255, 0.25);
    }
  }

  .input[type=file] {
    cursor: pointer;
  }
</style>