// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  imports: {
    dirs: ['classes']
  },
  modules: [
    '@nuxt/ui',
    "@nuxt/image",
    "@pinia/nuxt",
    'nuxt-file-storage',
    '@nuxthub/core',
    'nitro-cloudflare-dev'
  ],

  hub: {
    blob: true,
    cache: true,
    database: true,
    kv: true
  },

  fileStorage: {
    mount: 'public'
  }
})