<template>
  <div class="font-sans text-slate-900 bg-slate-50 min-h-screen">
    <Header />
    <main class="pt-24 pb-16">
      <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-4xl font-black text-slate-900 mb-6">Cómo funcionan los remates de autos</h1>
        <p class="text-xl text-slate-600 mb-12">
          Vende tu auto de forma segura, rápida y al mejor precio del mercado en 4 simples pasos. Puedes ver los <NuxtLink to="/remates" class="text-blue-600 font-semibold hover:underline">remates activos</NuxtLink> o inscribir tu auto cuando quieras.
        </p>

        <div class="space-y-8">
          <div v-for="(step, index) in steps" :key="index" class="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex gap-6">
            <div class="flex-shrink-0 w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xl">
              {{ index + 1 }}
            </div>
            <div>
              <h2 class="text-xl font-bold text-slate-900 mb-2">{{ step.title }}</h2>
              <p class="text-slate-600">{{ step.desc }}</p>
            </div>
          </div>
        </div>

        <div class="mt-12 text-center">
          <NuxtLink to="/remates" class="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700">
            Ver remates activos
            <ArrowRight :size="20" />
          </NuxtLink>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ArrowRight } from 'lucide-vue-next'

definePageMeta({ auth: false })

const steps = [
  { title: 'Inscripción', desc: 'Inscribes tu auto en la plataforma. Nos cuentas marca, modelo, año y características principales. El proceso es gratuito y sin compromiso.' },
  { title: 'Inspección', desc: 'Realizamos una inspección técnica profesional de 60 puntos. Revisamos motor, carrocería, chasis y documentación. Tu auto queda certificado ante los compradores.' },
  { title: 'Subasta online', desc: 'Tu auto se subasta en vivo con compradores verificados (dealers). Cada uno puede ver el informe de inspección y pujar por el vehículo.' },
  { title: 'Venta y pago', desc: 'Se acepta la mejor oferta. El pago es inmediato y tú decides si vender o no según el precio alcanzado. Sin obligación de vender si no te convence.' }
]

useSeoMeta({
  title: 'Cómo funcionan los remates de autos | AutoRemates Chile',
  description: 'Conoce el proceso en 4 pasos: inscripción, inspección, subasta online y pago. Remates de autos de particulares y empresas en Chile con inspección incluida.',
  ogTitle: 'Cómo funcionan los remates de autos | AutoRemates',
  ogDescription: 'Proceso en 4 pasos: inscripción, inspección, subasta y pago. Sin obligación de vender.'
})

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl || 'https://autoremates.cl'

useHead({
  link: [{ rel: 'canonical', href: siteUrl + '/como-funciona' }]
})
</script>
