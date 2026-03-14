// https://nuxt.com/docs/api/configuration/nuxt-config

import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{purple.50}',
      100: '{purple.100}',
      200: '{purple.200}',
      300: '{purple.300}',
      400: '{purple.400}',
      500: '{purple.500}',
      600: '{purple.600}',
      700: '{purple.700}',
      800: '{purple.800}',
      900: '{purple.900}',
      950: '{purple.950}'
    }
  }
});

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    https: true,
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    '@nuxtjs/color-mode'
  ],
  ssr: false,
  primevue: {
    options: {
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: '.dark'
        }
      }
    },
  },
  colorMode: {
    preference: 'system', // default ikut system
    fallback: 'light',    // kalau system tidak tersedia
    classSuffix: '',      // supaya jadi .dark bukan .dark-mode
  },
  css: [
    'primeicons/primeicons.css',
    '~/assets/css/tailwind.css',
    '~/assets/css/main.css',
  ],
  typescript: {
    typeCheck: false,
    strict: false,
    shim: false,
  },
  app: {
    head: {
      title: 'Qitab',
      meta: [
        { name: 'description', content: 'Qitab - Baca Al-Qur\'an' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
      ],
    },
  },
  
})
