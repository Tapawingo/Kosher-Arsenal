<template>
  <div class="tag-editor">
    <ul>
      <li v-for="tag in tags" class="tag">
        {{ tag.label }}
        <UButton @click="deleteTag(tag)">X</UButton>
      </li>
      <li class="input">
        <input type="text" v-model="newTagTitle" placeholder="New tag" @keydown.enter.prevent="onNewTag">
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { LoadoutTagType, type LoadoutTagJson } from '~/classes/LoadoutTag';

  /* To get tag type use colons as a type seperator */
  const tags = defineModel<LoadoutTagJson[]>('tags', { required: true });
  const newTagTitle = ref('');

  /* Detect type */ /* @TODO: Explain types somewhere */
  const inferType = (label: string): LoadoutTagType => {
    if (label.startsWith('y:')) return LoadoutTagType.year; /* @TODO: validate year */
    if (label.startsWith('d:')) return LoadoutTagType.date; /* @TODO validate date */
    return LoadoutTagType.text
  }

  /* Delete tag */
  const deleteTag = (tag: LoadoutTagJson) => {
    const index = tags.value.indexOf(tag);
    tags.value.splice(index, 1);
  };

  /* Create new tag */
  const onNewTag = () => {
    const type = inferType(newTagTitle.value);
    /* @TODO: Check for duplicates */
    tags.value.push({
      label: newTagTitle.value,
      type: type
    });

    newTagTitle.value = '';
  };
</script>

<style lang="scss">
  .tag-editor {
    ul {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;

      & > .tag {
        background-color: rgb(24, 24, 24);
        border-radius: 0.5rem;
        padding: 0.2rem 0.5rem;

        & > button {
          background-color: transparent;
          border-radius: 0.1rem;
          justify-content: center;
          padding: 0.15rem;
          width: 1rem;
          height: 1rem;

          &:hover {
            background-color: red;
          }
        }
      }

      & > .input {
        & > input {
          flex-grow: 1;
          border-radius: 0.5rem;
          padding: 0.2rem 0.5rem;

          &:focus {
            border: none;
            outline: none;
          }
        }
      }
    }
  }
</style>