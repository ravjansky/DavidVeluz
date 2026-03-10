// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-07-15',

  app: {
    head: {
      link: [
        // FontShare — Panchang, Satoshi & Melodrama
        { rel: 'preconnect', href: 'https://api.fontshare.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://api.fontshare.com/v2/css?f[]=panchang@200,500,700,800&f[]=satoshi@300,400,500,700&f[]=melodrama@400,500,600,700&display=swap',
        },
      ],
    },
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxtjs/seo',
    '@vite-pwa/nuxt',
    'nuxt-lucide-icons'
  ],

  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/<your-cloud-name>/image/upload/'
    }
  },

  vite: {
    optimizeDeps: {
      include: ['ogl'],
    },
  },

  devtools: { enabled: true }
})