// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    '@pinia/nuxt',
  ],
  primevue: {
    options: {
      unstyled: true
    },
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
