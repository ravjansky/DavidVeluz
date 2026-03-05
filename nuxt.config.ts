// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-07-15',

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxtjs/seo',
    '@vite-pwa/nuxt',
    'nuxt-lucide-icons'
  ],

  // 4. Cloudinary & Performance Config
  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/<your-cloud-name>/image/upload/'
    }
  },

  devtools: { enabled: true }
})