// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr: true,
  pages: true,
  app: {
    baseURL: '/'
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/seo',
    '@nuxtjs/sitemap',
    '@nuxt/content'
  ],
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://autoremates.cl',
    name: 'AutoRemates',
    description: 'Remate de autos y subasta de autos online en Chile. Remates de autos en Santiago, Concepción e Iquique. Autos chocados, usados, de aseguradora. Inspección profesional incluida.',
    defaultLocale: 'es-CL'
  },
  typescript: {
    typeCheck: false
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://api.autoremates.cl/api',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://autoremates.cl'
    }
  },
  content: {
    database: {
      type: 'sqlite'
    }
  },
  nitro: {
    devProxy: {
      enabled: false
    }
  },
  sitemap: {
    hostname: process.env.NUXT_PUBLIC_SITE_URL || 'https://autoremates.cl',
    exclude: [
      '/admin/**',
      '/superadmin/**',
      '/vendedor/**',
      '/dealer/**',
      '/perito/**'
    ]
  }
})
