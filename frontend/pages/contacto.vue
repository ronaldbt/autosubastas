<template>
  <div class="font-sans text-slate-900 bg-slate-50 min-h-screen">
    <Header />
    <main class="pt-24 pb-16">
      <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-4xl font-black text-slate-900 mb-6">Contacto</h1>
        <p class="text-xl text-slate-600 mb-12">
          Estamos para ayudarte con tus consultas sobre remates de autos, inspecciones o inscripción de vehículos.
        </p>
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <h2 class="text-lg font-bold text-slate-900 mb-6">Datos de contacto</h2>
            <ul class="space-y-6 text-slate-600">
              <li class="flex items-start gap-4">
                <div class="bg-blue-100 p-2 rounded-lg">
                  <MapPin :size="20" class="text-blue-600" />
                </div>
                <div>
                  <span class="font-semibold text-slate-800 block mb-1">Dirección</span>
                  Av. Apoquindo 4500, Las Condes, Santiago, Chile
                </div>
              </li>
              <li class="flex items-start gap-4">
                <div class="bg-blue-100 p-2 rounded-lg">
                  <Phone :size="20" class="text-blue-600" />
                </div>
                <div>
                  <span class="font-semibold text-slate-800 block mb-1">Teléfono</span>
                  <a href="tel:+56979796841" class="text-blue-600 hover:underline">+56 9 7979 6841</a>
                </div>
              </li>
              <li class="flex items-start gap-4">
                <div class="bg-blue-100 p-2 rounded-lg">
                  <Mail :size="20" class="text-blue-600" />
                </div>
                <div>
                  <span class="font-semibold text-slate-800 block mb-1">Email</span>
                  <a href="mailto:contacto@autoremates.cl" class="text-blue-600 hover:underline">contacto@autoremates.cl</a>
                </div>
              </li>
            </ul>
          </div>
          <div class="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <h2 class="text-lg font-bold text-slate-900 mb-6">Horario de atención</h2>
            <p class="text-slate-600">Lunes a viernes: 9:00 - 18:00 hrs</p>
            <p class="text-slate-500 text-sm mt-2">Respondemos consultas por email en menos de 24 horas.</p>
            <div class="mt-8">
              <NuxtLink to="/remates" class="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700">
                Ver remates activos
                <ArrowRight :size="18" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-vue-next'

definePageMeta({ auth: false })

useSeoMeta({
  title: 'Contacto | AutoRemates Chile',
  description: 'Contacta a AutoRemates. Dirección, teléfono y email para consultas sobre remates de autos, inspección e inscripción de vehículos.',
  ogTitle: 'Contacto | AutoRemates Chile',
  ogDescription: 'Dirección, teléfono y email para consultas sobre remates de autos.'
})

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl || 'https://autoremates.cl'

useHead({
  link: [{ rel: 'canonical', href: siteUrl + '/contacto' }]
})
</script>
