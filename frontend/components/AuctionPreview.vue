<template>
  <section id="remates" class="py-24 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="text-center max-w-3xl mx-auto mb-12">
        <AnimatedSection>
          <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Remates activos
          </h2>
          <p class="text-gray-600 mb-6">Cada auto tiene su propio plazo. Participa en las subastas en curso.</p>
          <div class="w-24 h-1 bg-brand-orange mx-auto mb-6"></div>
        </AnimatedSection>
      </div>

      <div v-if="featuredCars.length === 0" class="text-center py-12 bg-white rounded-2xl border border-gray-200">
        <p class="text-gray-600 text-lg mb-4">No hay remates activos en este momento.</p>
        <p class="text-gray-500 text-sm">Los autos aparecerán aquí cuando un administrador los envíe a subasta desde el panel de admin.</p>
      </div>
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatedSection 
          v-for="(car, index) in featuredCars" 
          :key="car.id" 
          :delay="index * 150" 
          class="h-full"
        >
          <div class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col group">
            <div class="relative h-56 overflow-hidden">
              <div class="absolute top-4 left-4 z-10 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
                INSPECCIONADO
              </div>
              <img 
                :src="car.imageUrl" 
                :alt="car.title" 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <NuxtLink
                  :to="`/remates/${car.id}`"
                  class="w-full bg-white text-gray-900 font-bold py-2 rounded shadow hover:bg-brand-orange hover:text-white transition-colors text-center block"
                >
                  Ver Detalles
                </NuxtLink>
              </div>
            </div>

            <div class="p-6 flex-1 flex flex-col">
              <h3 class="text-xl font-bold text-gray-900 mb-1">{{ car.title }}</h3>
              <p class="text-gray-500 text-sm mb-4">{{ car.year }}</p>

              <div class="grid grid-cols-3 gap-2 mb-6 text-sm text-gray-600">
                <div class="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded">
                  <Gauge :size="16" class="text-brand-orange" />
                  <span>{{ (car.km / 1000).toFixed(0) }}k km</span>
                </div>
                <div class="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded">
                  <Cog :size="16" class="text-brand-orange" />
                  <span class="truncate w-full text-center">{{ car.transmission }}</span>
                </div>
                <div class="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded">
                  <Fuel :size="16" class="text-brand-orange" />
                  <span>{{ car.fuel }}</span>
                </div>
              </div>

              <div class="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <div class="flex flex-col">
                  <span class="text-xs text-gray-500 uppercase font-semibold">Precio Reserva</span>
                  <span class="text-xl font-bold text-gray-900">
                    ${{ (car.reservePrice / 1000000).toFixed(1) }}M
                  </span>
                </div>
                <div class="text-right">
                  <span class="text-xs text-green-600 font-semibold bg-green-100 px-2 py-1 rounded">Ofertas Abiertas</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      <div class="mt-12 text-center">
        <AnimatedSection :delay="600">
          <div class="inline-flex gap-4">
            <NuxtLink
              to="/remates"
              class="px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition shadow-lg"
            >
              Ver remates activos
            </NuxtLink>
            <NuxtLink
              to="/registro"
              class="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Registrarme para Comprar
            </NuxtLink>
          </div>
        </AnimatedSection>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Gauge, Fuel, Cog } from 'lucide-vue-next'
import { useImageUrl } from '~/composables/useImageUrl'
import AnimatedSection from './AnimatedSection.vue'

const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'
const { getImageUrl } = useImageUrl()

const featuredCars = ref([])

function mapAutoToCard (auto) {
  const img = auto.imagenes && auto.imagenes[0]
  return {
    id: auto.id,
    title: `${auto.marca || ''} ${auto.modelo || ''}`.trim() || 'Auto',
    year: auto.anio || '—',
    km: Number(auto.kilometraje) || 0,
    transmission: auto.peritaje?.transmision || '—',
    fuel: auto.peritaje?.combustible || '—',
    reservePrice: Number(auto.precioBase) || Number(auto.precioActual) || 0,
    imageUrl: img ? getImageUrl(img) : 'https://picsum.photos/seed/car' + auto.id + '/800/600',
    inspected: true
  }
}

onMounted(async () => {
  try {
    const list = await $fetch(`${API_BASE}/autos?estado=en_remate`)
    const mapped = (Array.isArray(list) ? list : []).map(mapAutoToCard)
    featuredCars.value = mapped
  } catch (e) {
    console.warn('[AuctionPreview] No se pudieron cargar remates activos:', e)
    featuredCars.value = []
  }
})
</script>