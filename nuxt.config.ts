import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Symbols&display=swap' }
      ]
    }
  },
  // Ваши настройки Nuxt 3
  modules: [],

  nitro: {
    // Ваши настройки Nitro, если есть
  },

  build: {
    transpile: [],
  },

  compatibilityDate: '2024-10-11',
})