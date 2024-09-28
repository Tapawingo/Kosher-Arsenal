<template>
  <div class="loadouts-page">
    <div class="tabs">
      <button :class="{ active: selectedTab === 'community' }" @click="selectedTab = 'community'">Community Content</button>
      <button :class="{ active: selectedTab === 'personal' }" @click="selectedTab = 'personal'">My Content</button>
    </div>

    <LoadoutsCommunityContent v-if="selectedTab === 'community'" />
    <LoadoutsMyContent v-if="selectedTab === 'personal'" />
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