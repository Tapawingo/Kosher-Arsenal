<template>
  <div class="app-container">
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
  <UNotifications class="notification" />
</template>

<script setup lang="ts">
  import { usePreferredDark } from '@vueuse/core';
  /* @TODO: Fix hydration issues (https://ryanclements.dev/posts/fixing-nuxt-hydration-mismatches-in-the-real-world) */
  /* @TODO: Run tests for web vitals (https://web.dev/articles/vitals#tools_to_measure_and_report_core_web_vitals) */

  const userSettings = useAuthStore();

  useHead({
    title: 'Kosher Arsenal',
    meta: [
      { name: 'description', content: 'Kosher Arsenal is a tool to visualize and/or organize loadouts, firearms or any other category users see fit.' },
      { name: 'viewport', content: "width=device-width, initial-scale=1.0" }
    ],
    htmlAttrs: {
      lang: 'en',
      class: () => { 
        if (userSettings.themeIsDarkmode()) return 'dark-theme';
        if (!userSettings.themeIsDarkmode()) return 'light-theme';
      }
    },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: () => { return usePreferredDark() ? '/favicon.ico' : '/favicon_dark.ico' }
    }
  ]
  });

  useSeoMeta({
    title: 'Kosher Arsenal',
    description: 'Kosher Arsenal is a tool to visualize and/or organize loadouts, firearms or any other category users see fit.',
    
    ogTitle: 'Kosher Arsenal',
    ogDescription: 'Kosher Arsenal is a tool to visualize and/or organize loadouts, firearms or any other category users see fit.',
    ogImage: '/image.png',
    ogUrl: '',

    twitterCard: 'summary_large_image',
    twitterTitle: 'Kosher Arsenal',
    twitterDescription: 'Kosher Arsenal is a tool to visualize and/or organize loadouts, firearms or any other category users see fit.',
    twitterImage: '/image.png',
  })

</script>