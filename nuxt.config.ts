// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 1. Opt into Nuxt 4 directory structure and performance engine
  future: {
    compatibilityVersion: 4,
  },

  // 2. Set the date for feature snapshotting
  compatibilityDate: '2025-07-15',

  // 3. Enable your selected modules
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