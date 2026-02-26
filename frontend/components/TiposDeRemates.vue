<template>
  <section id="tipos-de-remates" class="py-24 bg-white">
    <div class="container mx-auto px-4">
      <AnimatedSection class="text-center mb-12">
        <h2 class="text-4xl font-extrabold text-gray-900 mb-4">Tipos de Remates de Autos en Chile</h2>
        <p class="text-gray-500 text-lg max-w-2xl mx-auto mb-4">
          Existen diversos tipos de remates de autos: chocados, de aseguradora, judiciales, municipales y más. <strong class="text-gray-700">AutoRemates se especializa en remates de particulares y empresas, con vehículos en buen estado.</strong>
        </p>
      </AnimatedSection>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedSection
          v-for="(tipo, index) in tipos"
          :key="tipo.slug"
          :delay="index * 80"
          class="group"
        >
          <div class="bg-gray-50 hover:bg-brand-orange/5 border border-gray-100 hover:border-brand-orange/20 rounded-xl p-6 transition-all duration-300 h-full">
            <div class="w-12 h-12 rounded-lg bg-brand-orange/10 flex items-center justify-center mb-4 group-hover:bg-brand-orange/20 transition-colors">
              <component :is="tipo.icon" :size="24" class="text-brand-orange" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ tipo.title }}</h3>
            <p class="text-sm text-gray-600 leading-relaxed">{{ tipo.desc }}</p>
            <NuxtLink
              :to="`/blog/remates-${tipo.slug}`"
              class="inline-flex items-center gap-1 mt-4 text-brand-orange font-semibold text-sm hover:underline"
            >
              Leer más
              <ArrowRight :size="14" />
            </NuxtLink>
          </div>
        </AnimatedSection>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Car, Shield, Scale, Building2, Truck, AlertTriangle, FileWarning, ArrowRight } from 'lucide-vue-next'
import AnimatedSection from './AnimatedSection.vue'

const tipos = [
  {
    slug: 'chocados',
    title: 'Remates de autos chocados',
    desc: 'Vehículos con daño por accidente. Incluye inspección técnica. Ideal para reparación o repuestos.',
    icon: Car
  },
  {
    slug: 'aseguradora',
    title: 'Remates de aseguradora',
    desc: 'Autos de compañías de seguros. Pérdida total, siniestrados. Oportunidades a precios reducidos.',
    icon: Shield
  },
  {
    slug: 'judiciales',
    title: 'Remates judiciales',
    desc: 'Vehículos rematados por tribunales: embargos, incautaciones, ejecuciones hipotecarias.',
    icon: Scale
  },
  {
    slug: 'carabineros',
    title: 'Remates de Carabineros',
    desc: 'Autos incautados o decomisados. Subastas públicas de vehículos recuperados.',
    icon: Truck
  },
  {
    slug: 'corrales-municipales',
    title: 'Corrales municipales',
    desc: 'Autos retirados de la vía pública. Multas impagas o abandonados. Remates por municipalidades.',
    icon: Building2
  },
  {
    slug: 'aduana',
    title: 'Remates de aduana',
    desc: 'Especialmente en Iquique (ZOFRI). Vehículos liberados, importados. Oportunidades en zona franca.',
    icon: Truck
  },
  {
    slug: 'siniestrados',
    title: 'Remates siniestrados',
    desc: 'Autos con pérdida total declarada. De aseguradoras y liquidadores. Requieren revisión técnica.',
    icon: AlertTriangle
  },
  {
    slug: 'embargados',
    title: 'Remates embargados',
    desc: 'Vehículos con embargo por deudas. Remates judiciales. Documentación verificada.',
    icon: FileWarning
  }
]
</script>
