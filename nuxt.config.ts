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
    '@nuxt/icon',
    "@nuxt/image",
    "@pinia/nuxt",
    '@nuxthub/core',
    'nitro-cloudflare-dev'
  ],

  hub: {
    blob: true,
    cache: true,
    database: true,
    kv: false
  },

  icon: {
    serverBundle: {
      collections: ['material-symbols']
    }
  }
})