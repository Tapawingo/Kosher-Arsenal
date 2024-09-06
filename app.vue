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

  const userSettings = await useUserSettings();

  const { theme } = storeToRefs(userSettings);

  onMounted(() => {
    if (localStorage.getItem("theme")) {
      document.documentElement.classList.remove(`${ localStorage.getItem("theme") }-theme`);
    }

    useHead({
      htmlAttrs: {
        lang: 'en',
        class: () => {
          console.log(theme.value);
          if (theme.value === 'dark') {
            return 'dark-theme'
          } else {
            return 'light-theme'
          };
        }
      }
    })
  });

  useHead({
    title: 'Kosher Arsenal',
    meta: [
      { name: 'description', content: 'Kosher Arsenal is a tool to visualize and/or organize loadouts, firearms or any other category users see fit.' },
      { name: 'viewport', content: "width=device-width, initial-scale=1.0" }
    ],
    htmlAttrs: {
      lang: 'en'
    },
    script: [ { 
      innerHTML: 'if (localStorage.getItem("theme")) document.documentElement.classList.add(`${ localStorage.getItem("theme") }-theme`)'
    } ],
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