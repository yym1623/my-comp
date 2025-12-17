import { fileURLToPath } from 'url'
import Aura from '@primevue/themes/aura'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  alias: {
    '@app': fileURLToPath(new URL('./app', import.meta.url)),
  },

  nitro: {
    alias: {
      '@server': fileURLToPath(new URL('./server', import.meta.url)),
    }
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxtjs/tailwindcss',
    ['@primevue/nuxt-module', {
      options: {
        theme: {
          preset: Aura,
          options: {
            cssLayer: {
              name: 'primevue',
              order: 'tailwind-base, primevue, tailwind-utilities'
            }
          }
        }
      }
    }]
  ]
})