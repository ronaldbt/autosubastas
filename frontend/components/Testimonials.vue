<template>
  <section class="py-24 bg-white">
    <div class="container mx-auto px-4">
      <AnimatedSection class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900">
          Más de 300 Personas ya Vendieron con Nosotros
        </h2>
        <p class="text-slate-500 mt-4 text-lg">La confianza es nuestro motor principal.</p>
      </AnimatedSection>

      <div class="grid md:grid-cols-3 gap-8">
        <AnimatedSection 
          v-for="(t, index) in TESTIMONIALS" 
          :key="t.id" 
          :delay="index * 150"
        >
          <div class="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
            <div class="flex gap-1 mb-6">
              <Star v-for="i in t.rating" :key="i" :size="18" class="fill-yellow-400 text-yellow-400" />
            </div>
            <blockquote class="text-slate-700 text-lg mb-6 flex-1 italic">
              "{{ t.text }}"
            </blockquote>
            <div class="flex items-center gap-4 mt-auto">
              <img :src="t.image" :alt="t.name" class="w-12 h-12 rounded-full object-cover ring-2 ring-blue-600/20" />
              <div>
                <div class="font-bold text-slate-900">{{ t.name }}</div>
                <div class="text-xs text-slate-500">{{ t.role }}</div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      <AnimatedSection :delay="400" class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto border-t border-slate-100 pt-10">
        <div class="text-center">
          <div class="text-4xl font-extrabold text-blue-600">4.9/5</div>
          <div class="text-sm font-medium text-slate-500 mt-1">Satisfacción Promedio</div>
        </div>
        <div class="text-center border-l-0 md:border-l border-slate-200">
          <div class="text-4xl font-extrabold text-blue-600">320+</div>
          <div class="text-sm font-medium text-slate-500 mt-1">Autos Vendidos</div>
        </div>
        <div class="text-center border-l-0 md:border-l border-slate-200">
          <div class="text-4xl font-extrabold text-blue-600">98%</div>
          <div class="text-sm font-medium text-slate-500 mt-1">Tasa de Venta</div>
        </div>
      </AnimatedSection>
    </div>
  </section>
</template>

<script setup>
import { Star } from 'lucide-vue-next'
import { TESTIMONIALS } from '~/utils/constants'
import AnimatedSection from './AnimatedSection.vue'
</script>