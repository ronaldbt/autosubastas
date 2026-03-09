<template>
  <section id="tipos-de-remates" class="py-24 bg-white">
    <div class="container mx-auto px-4">
      <AnimatedSection class="text-center mb-12">
        <h2 class="text-4xl font-extrabold text-slate-900 mb-4">Tipos de Remates de Autos en Chile</h2>
        <p class="text-slate-500 text-lg max-w-2xl mx-auto mb-4">
          Existen diversos tipos de remates de autos: remate de autos embargados, remate de autos embargados Chile, remate siniestrados, remate autos siniestrados, chocados, de aseguradora, judiciales, municipales y más. <strong class="text-slate-700">AutoRemates se especializa en remates de particulares y empresas, con vehículos en buen estado.</strong>
        </p>
      </AnimatedSection>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedSection
          v-for="(tipo, index) in tipos"
          :key="tipo.slug"
          :delay="index * 80"
          class="group"
        >
          <div class="bg-slate-50 hover:bg-blue-600/5 border border-slate-200 hover:border-blue-600/20 rounded-xl p-6 transition-all duration-300 h-full">
            <div class="w-12 h-12 rounded-lg bg-blue-600/10 flex items-center justify-center mb-4 group-hover:bg-blue-600/20 transition-colors">
              <component :is="tipo.icon" :size="24" class="text-blue-600" />
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">{{ tipo.title }}</h3>
            <p class="text-sm text-slate-600 leading-relaxed">{{ tipo.desc }}</p>
            <NuxtLink
              :to="`/blog/remates-${tipo.slug}`"
              class="inline-flex items-center gap-1 mt-4 text-blue-600 font-semibold text-sm hover:underline"
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
    desc: 'Compra de vehículos chocados para reparación o repuestos. Vehículos con daño por accidente. Incluye inspección técnica.',
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
    title: 'Remate autos siniestrados',
    desc: 'Remate siniestrados: autos con pérdida total declarada. De aseguradoras y liquidadores. Requieren revisión técnica.',
    icon: AlertTriangle
  },
  {
    slug: 'embargados',
    title: 'Remate de autos embargados',
    desc: 'Remate de autos embargados en Chile. Vehículos con embargo por deudas. Remates judiciales. Documentación verificada.',
    icon: FileWarning
  }
]
</script>
