<template>
  <div class="header-tabs">
    <div class="tabs">
      <button :class="{ active: selectedTab === 'feed' }" @click="" class="disabled">Feed</button>
      <button :class="{ active: selectedTab === 'community' }" @click="selectedTab = 'community'">Discover Content</button>
      <button :class="{ active: selectedTab === 'personal' }" @click="selectedTab = 'personal'">My Content</button>
    </div>
  </div>
  <div class="page-loadouts">
    <div v-show="selectedTab === 'community'"><LoadoutsCommunityContent /></div>
    <div v-show="selectedTab === 'personal'"><LoadoutsMyContent /></div>
  </div>
</template>

<script setup lang="ts">
  /* Users should have a credibility rating. once the rating is above a certain number content can be posted without a check. non credible users will have their shit tagged */

  const selectedTab = ref('community'); /* If user is not logged in community tab should be default */

  definePageMeta({
    layout: 'sitenav'
  });
</script>

<style lang="scss">
  @use "@/assets/styles/landingPage/main";
</style>