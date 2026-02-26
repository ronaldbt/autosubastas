<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Log de versión para confirmar que el contenedor/front es el último desplegado
if (typeof window !== 'undefined') {
  console.log('[AutoRemates] Frontend build 2026-02-26-debug – si ves este mensaje, el contenedor está actualizado')
}
useHead({
  htmlAttrs: {
    lang: 'es-CL'
  },
  title: 'AutoRemates Chile - Remate y Subasta de Autos Online',
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon-256.png', sizes: '256x256' },
    { rel: 'icon', type: 'image/png', href: '/favicon-128.png', sizes: '128x128' },
    { rel: 'icon', type: 'image/png', href: '/favicon-64.png', sizes: '64x64' },
    { rel: 'icon', type: 'image/png', href: '/favicon-32.png', sizes: '32x32' },
    { rel: 'icon', type: 'image/png', href: '/favicon-16.png', sizes: '16x16' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
    { rel: 'shortcut icon', href: '/favicon-128.png' },
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ],
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'description', content: 'El primer remate online de autos en Chile. Remates de particulares y empresas. Entregamos el auto al comprador en cualquier ciudad de Chile. Pago inmediato y sin compromiso.' },
    { name: 'robots', content: 'index, follow' },
    { name: 'language', content: 'Spanish' },
    { name: 'geo.region', content: 'CL' },
    { name: 'geo.placename', content: 'Chile' },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'AutoRemates Chile' },
    { property: 'og:locale', content: 'es_CL' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@autoremates' }
  ]
})
</script>

