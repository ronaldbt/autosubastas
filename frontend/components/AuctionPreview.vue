<template>
  <section id="remates" class="py-24 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center max-w-3xl mx-auto mb-12">
        <AnimatedSection>
          <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Remates de autos online
          </h2>
          <p class="text-slate-600 mb-6">Cada auto tiene su propio plazo. Participa en las subastas en curso.</p>
          <div class="w-24 h-1 bg-blue-600 mx-auto mb-6 rounded-full"></div>
        </AnimatedSection>
      </div>

      <div v-if="featuredCars.length === 0" class="text-center py-12 bg-white rounded-2xl border border-slate-200">
        <p class="text-slate-600 text-lg mb-4">No hay remates activos en este momento.</p>
        <p class="text-slate-500 text-sm">Los autos aparecerán aquí cuando un administrador los envíe a subasta desde el panel de admin.</p>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatedSection 
          v-for="(car, index) in featuredCars" 
          :key="car.id" 
          :delay="index * 150" 
          class="h-full"
        >
          <div class="bg-white rounded-3xl overflow-hidden shadow-sm border-2 border-slate-200 hover:shadow-xl transition-all duration-300 h-full flex flex-col group">
            <div class="relative h-56 overflow-hidden">
              <div class="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <div class="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md w-fit">
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                  INSPECCIONADO
                </div>
                <RemateCountdownBadge v-if="car.fechaFinRemate" :fecha-fin-remate="car.fechaFinRemate" />
              </div>
              <img 
                :src="car.imageUrl" 
                :alt="car.title" 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            </div>

            <div class="p-6 flex-1 flex flex-col">
              <h3 class="text-xl font-bold text-slate-900 mb-1">{{ car.title }}</h3>
              <p class="text-slate-500 text-sm mb-3">
                {{ car.year }} · {{ car.fuel }}<template v-if="car.km != null && car.km > 0"> · {{ formatKilometrajeChile(car.km) }}</template>
              </p>
              <div class="flex flex-wrap gap-1.5 mb-3">
                <span v-if="car.transmission && car.transmission !== '—'" class="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded uppercase">
                  {{ car.transmission }}
                </span>
              </div>

              <div v-if="car.ultimaOferta != null" class="mb-3 p-2.5 bg-amber-50 rounded-lg flex items-center justify-between gap-2">
                <span class="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                  <Wrench :size="14" />
                  Última oferta
                </span>
                <span class="text-base font-bold text-slate-900">${{ formatPriceChile(car.ultimaOferta) }}</span>
              </div>

              <div class="mt-auto pt-4 border-t border-slate-100 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <span class="text-xs text-slate-500 uppercase font-semibold">Mín</span>
                  <p class="text-xl font-bold text-slate-900">
                    ${{ formatPriceChile(car.reservePrice) }}
                  </p>
                </div>
                <NuxtLink
                  :to="`/dealer/remates-live-${car.id}`"
                  class="bg-slate-900 hover:bg-blue-600 text-white font-black py-3 px-5 rounded-xl text-center text-sm transition-colors shrink-0 inline-block w-full"
                >
                  Ver detalles y pujar
                </NuxtLink>
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
              class="px-8 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition shadow-lg"
            >
              Ver remates activos
            </NuxtLink>
            <NuxtLink
              to="/registro"
              class="px-8 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
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
import { ref, onMounted } from 'vue'
import { Wrench } from 'lucide-vue-next'
import { useImageUrl } from '~/composables/useImageUrl'
import { formatPriceChile, formatKilometrajeChile } from '~/utils/format'
import AnimatedSection from './AnimatedSection.vue'
import RemateCountdownBadge from './RemateCountdownBadge.vue'

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
    ultimaOferta: auto.ultimaOferta != null ? Number(auto.ultimaOferta) : null,
    fechaFinRemate: auto.fechaFinRemate || null,
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