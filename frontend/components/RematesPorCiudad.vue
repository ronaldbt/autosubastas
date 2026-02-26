<template>
  <section id="remates-por-ciudad" class="py-24 bg-gray-50">
    <div class="container mx-auto px-4">
      <AnimatedSection class="text-center mb-16">
        <h2 class="text-4xl font-extrabold text-gray-900 mb-4">Remates de Autos por Ciudad</h2>
        <p class="text-gray-500 text-lg max-w-2xl mx-auto">
          Encuentra remates de autos en las principales ciudades de Chile. Santiago, Concepción, Iquique, Valparaíso y más.
        </p>
      </AnimatedSection>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedSection
          v-for="(ciudad, index) in ciudades"
          :key="ciudad.slug"
          :delay="index * 60"
        >
          <NuxtLink
            :to="`/remates?ciudad=${ciudad.slug}`"
            class="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-brand-orange/30 hover:shadow-lg transition-all group"
          >
            <div class="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors flex-shrink-0">
              <MapPin :size="20" class="text-brand-orange" />
            </div>
            <div>
              <h3 class="font-bold text-gray-900 group-hover:text-brand-orange transition-colors">
                Remates en {{ ciudad.nombre }}
              </h3>
              <p class="text-sm text-gray-500">{{ ciudad.desc }}</p>
            </div>
            <ArrowRight :size="16" class="text-gray-400 group-hover:text-brand-orange group-hover:translate-x-1 transition-all ml-auto" />
          </NuxtLink>
        </AnimatedSection>
      </div>
    </div>
  </section>
</template>

<script setup>
import { MapPin, ArrowRight } from 'lucide-vue-next'
import AnimatedSection from './AnimatedSection.vue'

const ciudades = [
  { slug: 'santiago', nombre: 'Santiago', desc: 'RM y alrededores' },
  { slug: 'concepcion', nombre: 'Concepción', desc: 'Región del Biobío' },
  { slug: 'iquique', nombre: 'Iquique', desc: 'Zona franca, aduana' },
  { slug: 'valparaiso', nombre: 'Valparaíso', desc: 'V Región' },
  { slug: 'la-serena', nombre: 'La Serena', desc: 'Región de Coquimbo' },
  { slug: 'temuco', nombre: 'Temuco', desc: 'Región de La Araucanía' },
  { slug: 'antofagasta', nombre: 'Antofagasta', desc: 'II Región' }
]
</script>
