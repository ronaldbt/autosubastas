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
    '@nuxtjs/sitemap'
  ],
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://autoventas360.cl',
    name: 'AutoVentas360',
    description: 'El primer remate online de autos en Chile con inspección profesional incluida. Vende tu auto en 2 horas con seguridad, rapidez y transparencia.',
    defaultLocale: 'es-CL'
  },
  typescript: {
    typeCheck: false
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://api.autoventas360.cl/api',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://autoventas360.cl'
    }
  },
  nitro: {
    devProxy: {
      enabled: false
    }
  },
  sitemap: {
    hostname: process.env.NUXT_PUBLIC_SITE_URL || 'https://autoventas360.cl',
    exclude: [
      '/admin/**',
      '/superadmin/**',
      '/vendedor/**',
      '/dealer/**',
      '/perito/**'
    ]
  }
})
