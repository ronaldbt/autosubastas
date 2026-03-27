// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr: true,
  pages: true,
  app: {
    baseURL: '/',
    head: {
      link: [
        { rel: 'preconnect', href: 'https://images.unsplash.com', crossorigin: 'anonymous' },
        { rel: 'dns-prefetch', href: 'https://images.unsplash.com' },
        { rel: 'preconnect', href: 'https://picsum.photos', crossorigin: 'anonymous' },
        { rel: 'dns-prefetch', href: 'https://picsum.photos' },
        { rel: 'preconnect', href: 'https://api.autoremates.cl', crossorigin: 'anonymous' },
        { rel: 'dns-prefetch', href: 'https://api.autoremates.cl' }
      ]
    }
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
    },
    routeRules: {
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/favicon.ico': { headers: { 'cache-control': 'public, max-age=86400' } }
    }
  },
  sitemap: {
    hostname: process.env.NUXT_PUBLIC_SITE_URL || 'https://autoremates.cl',
    sources: ['/api/__sitemap__/urls'],
    exclude: [
      '/admin/**',
      '/superadmin/**',
      '/vendedor/**',
      '/dealer/**',
      '/perito/**',
      '/login',
      '/registro'
    ],
    defaults: {
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.7
    }
  }
})
