<template>
  <div class="loadout-details">
    <div class="body">
      <h1>{{ props.loadout.title }}</h1>
      <div class="details">
        <header>
          <p>{{ props.loadout.description }}</p>
          <div class="tags">
            <div v-for="tag in props.loadout.tags">#{{ tag.label }}</div>
          </div>
        </header>

        <div class="meta">
          <div class="preview">
            <img src="/arsenal/preview/default.svg" alt="">
          </div>
          <div class="statistics">
            <UTooltip text="Visibility" class="visibility">
              <Icon :name="visibility2Icon(props.loadout.visibility)" />
              <span>{{ visibility2String(props.loadout.visibility) }}</span>
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
      <div class="comments">
        <textarea name="comment" placeholder="Add a comment..."></textarea>
          <section>
            <div>
              <div class="author">Comment author</div>
              <p>comment content</p>
              <div class="details">
                <span>Created: xx/xx/xx xx:xx</span>
              </div>
            </div>
            <div>
              <div class="author">Comment author</div>
              <p>comment content</p>
              <div class="details">
                <span>Created: xx/xx/xx xx:xx</span>
              </div>
            </div>
            <div>
              <div class="author">Comment author</div>
              <p>comment content</p>
              <div class="details">
                <span>Created: xx/xx/xx xx:xx</span>
              </div>
            </div>
          </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { visibility2String, visibility2Icon, type ArsenalLoadoutJson } from '@/classes/ArsenalLoadout';

  const props = defineProps<{ loadout: ArsenalLoadoutJson }>();
</script>