import { fileURLToPath } from 'url'
import Aura from '@primevue/themes/aura'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Hydration 오류 방지
  ssr: true,
  experimental: {
    payloadExtraction: false
  },

  app: {
    head: {
      htmlAttrs: {
        class: 'dark'
      },
      title: 'MyComp',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '컴포넌트를 드래그 앤 드롭으로 쉽게 만들고 관리하세요' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/favicon.svg' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  alias: {
    // 프로젝트 루트 기준 alias (예: '@/stores/panel')
    '@': fileURLToPath(new URL('./', import.meta.url)),
    // Nuxt srcDir(app) 기준 alias
    '@app': fileURLToPath(new URL('./app', import.meta.url)),
  },

  nitro: {
    alias: {
      '@server': fileURLToPath(new URL('./server', import.meta.url)),
    }
  },

  runtimeConfig: {
    // 서버 사이드에서만 접근 가능 (환경 변수)
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    
    // 클라이언트 사이드에서도 접근 가능 (public)
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    }
  },

  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
    // '@nuxt/hints', // hydration 오류로 인해 비활성화
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxtjs/tailwindcss',
    ['@primevue/nuxt-module', {
      options: {
        theme: {
          preset: Aura,
          options: {
            darkModeSelector: '.dark',
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