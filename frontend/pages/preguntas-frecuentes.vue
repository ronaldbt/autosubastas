<template>
  <div class="font-sans text-slate-900 bg-slate-50 min-h-screen">
    <Header />
    <main class="pt-24 pb-16">
      <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-4xl font-black text-slate-900 mb-6">Preguntas frecuentes sobre remate de autos</h1>
        <p class="text-xl text-slate-600 mb-12">
          Todo lo que necesitas saber sobre nuestro sistema de remates de autos en Chile.
        </p>

        <FAQ />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
definePageMeta({ auth: false })

useSeoMeta({
  title: 'Preguntas frecuentes | AutoRemates Chile',
  description: 'Respuestas sobre remates de autos, inspección, subastas online y cómo participar. AutoRemates Chile - remates de autos de particulares y empresas.',
  ogTitle: 'Preguntas frecuentes | AutoRemates Chile',
  ogDescription: 'Todo lo que necesitas saber sobre remates de autos, inspección y subastas.'
})

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl || 'https://autoremates.cl'

useHead({
  link: [{ rel: 'canonical', href: siteUrl + '/preguntas-frecuentes' }]
})
</script>
