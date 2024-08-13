<template>
  <NuxtPage />
</template>

<script setup lang="ts">

  useHead({
    title: 'Kosher Arsenal',
    meta: [
      { name: 'description', content: 'Kosher Arsenal is a tool to visualize and/or organize loadouts, firearms or any other category users see fit.' },
      { name: 'viewport', content: "width=device-width, initial-scale=1.0" }
    ],
    htmlAttrs: {
      lang: 'en'
    },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.ico'
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