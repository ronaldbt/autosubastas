<template>
  <div class="min-h-screen pb-20 bg-slate-50">
    <!-- Main Content -->
    <main>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- Countdown al próximo remate (viernes 15:00) -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div class="text-center">
            <p class="text-sm text-slate-500 font-semibold mb-1">Próximo remate</p>
            <p class="text-xl font-black text-slate-900 mb-4">{{ nextFridayText }} · 15:00 hrs</p>
            <CountdownTimer />
          </div>
        </div>

        <header class="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 class="text-3xl font-black text-slate-900 mb-1">Explorar Autos</h2>
            <p class="text-sm text-slate-500">
              Autos aprobados para el próximo remate y en remate ahora
            </p>
          </div>
        </header>

        <!-- Filtros -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label class="block text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1.5">Buscar</label>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Marca, modelo..."
                class="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors text-slate-900 font-medium text-xs"
              />
            </div>
            <div>
              <label class="block text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1.5">Marca</label>
              <select
                v-model="filterBrand"
                class="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors text-slate-900 font-medium text-xs shadow-sm"
              >
                <option value="">Todas</option>
                <option v-for="marca in marcas" :key="marca" :value="marca">{{ marca }}</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1.5">Precio Máximo</label>
              <input
                type="number"
                v-model="filterMaxPrice"
                placeholder="Ej: 15000000"
                class="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors text-slate-900 font-medium text-xs"
              />
            </div>
            <div class="flex items-end">
              <button
                @click="resetFilters"
                class="w-full px-3 py-2.5 border-2 border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-semibold text-xs"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        <div v-if="loading" class="text-center py-12">
          <p class="text-slate-400 font-medium text-xs">Cargando autos...</p>
        </div>

        <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-xs">
          {{ error }}
        </div>

        <!-- Grid de Autos -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div
            v-for="auto in filteredAutos"
            :key="auto.id"
            class="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all overflow-hidden group cursor-pointer"
            @click="viewAuto(auto)"
          >
            <div class="h-40 bg-slate-100 relative overflow-hidden">
              <img
                v-if="auto.imagenes && auto.imagenes[0]"
                :src="getImageUrl(auto.imagenes[0])"
                :alt="auto.marca + ' ' + auto.modelo"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <Car :size="40" class="text-slate-400" />
              </div>
              <div v-if="auto.estado === 'aprobado'" class="absolute top-3 left-3 z-10 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                Próximo remate
              </div>
              <div v-else-if="auto.estado === 'en_remate'" class="absolute top-3 left-3 z-10 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                En remate
              </div>
              <button
                @click.stop="toggleFavorite(auto)"
                class="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-lg hover:bg-slate-50 transition-colors z-10"
              >
                <Heart
                  :size="16"
                  :class="auto.esFavorito ? 'text-red-500 fill-current' : 'text-slate-400'"
                />
              </button>
            </div>
            <div class="p-5">
              <h3 class="text-base font-black text-slate-900 mb-1.5">
                {{ auto.marca }} {{ auto.modelo }} {{ auto.anio }}
              </h3>
              <p class="text-xs text-slate-500 mb-3">
                <span v-if="auto.kilometraje">{{ formatNumber(auto.kilometraje) }} km</span>
                <span v-if="auto.transmision"> • {{ auto.transmision }}</span>
                <span v-if="auto.combustible"> • {{ auto.combustible }}</span>
              </p>
              <div class="flex items-center justify-between mb-3 p-3 bg-slate-50 rounded-lg">
                <div>
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-0.5">Puja Actual</p>
                  <p class="text-lg font-black text-blue-600">${{ formatPrice(auto.precioActual || auto.precioBase) }}</p>
                </div>
                <div class="text-right">
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-0.5">Precio Base</p>
                  <p class="text-xs font-bold text-slate-700">${{ formatPrice(auto.precioBase) }}</p>
                </div>
              </div>
              <div class="flex items-center justify-between text-[10px] text-slate-500 mb-3">
                <span class="font-semibold">{{ auto.totalPujas || 0 }} pujas</span>
                <span v-if="auto.estado === 'en_remate' && auto.fechaFinRemate">Termina: {{ formatDate(auto.fechaFinRemate) }}</span>
                <span v-else-if="auto.estado === 'aprobado'" class="text-amber-600 font-semibold">Próximo remate {{ nextFridayText }}</span>
              </div>
              <div class="flex gap-2">
                <button
                  @click.stop="viewAuto(auto)"
                  class="flex-1 px-3 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-bold"
                >
                  Ver Detalles
                </button>
                <button
                  v-if="auto.estado === 'en_remate'"
                  @click.stop="pujar(auto)"
                  class="flex-1 px-3 py-2.5 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-xs font-bold"
                >
                  Pujar
                </button>
                <span v-else class="flex-1 px-3 py-2.5 border-2 border-slate-200 text-slate-400 rounded-lg text-xs font-bold text-center">
                  Puja el viernes
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!loading && !error && filteredAutos.length === 0" class="text-center py-12">
          <p class="text-slate-400 font-medium text-xs">No hay autos aprobados ni en remate</p>
        </div>

        <!-- Paginación -->
        <div v-if="!loading && !error && filteredAutos.length > 0" class="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between">
          <p class="text-xs text-slate-600 font-semibold">
            Mostrando <span class="font-black text-slate-900">{{ filteredAutos.length }}</span> resultado{{ filteredAutos.length !== 1 ? 's' : '' }}
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Car, Heart } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'
import { useImageUrl } from '~/composables/useImageUrl'
import { useNextFridayRemate } from '~/composables/useNextFridayRemate'
import CountdownTimer from '~/components/CountdownTimer.vue'
import { navigateTo } from 'nuxt/app'

const { getAuthHeaders } = useAuth()
const { getImageUrl } = useImageUrl()
const { nextFridayText } = useNextFridayRemate()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const filterBrand = ref('')
const filterMaxPrice = ref('')
const autos = ref([])
const marcas = ref([])

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['dealer']
})

const loadAutos = async () => {
  loading.value = true
  error.value = null
  try {
    const headers = getAuthHeaders()
    const [enRemate, aprobados] = await Promise.all([
      $fetch(`${API_BASE}/autos?estado=en_remate`, { headers }),
      $fetch(`${API_BASE}/autos?estado=aprobado`, { headers })
    ])
    const merged = [
      ...enRemate.map(a => ({ ...a, esFavorito: false, totalPujas: 0 })),
      ...aprobados.map(a => ({ ...a, esFavorito: false, totalPujas: 0 }))
    ]
    autos.value = merged

    const marcasSet = new Set(autos.value.map(a => a.marca).filter(Boolean))
    marcas.value = Array.from(marcasSet).sort()

    for (const auto of autos.value) {
      if (auto.estado !== 'en_remate') continue
      try {
        const pujas = await $fetch(`${API_BASE}/remates?autoId=${auto.id}`, { headers })
        auto.totalPujas = pujas.length
      } catch (err) {
        console.error('Error cargando pujas:', err)
      }
    }
  } catch (err) {
    console.error('Error cargando autos:', err)
    error.value = err.data?.message || 'Error al cargar los autos'
  } finally {
    loading.value = false
  }
}

const filteredAutos = computed(() => {
  return autos.value.filter(auto => {
    const matchesSearch = !searchQuery.value ||
      `${auto.marca || ''} ${auto.modelo || ''}`.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesBrand = !filterBrand.value || (auto.marca && auto.marca.toLowerCase() === filterBrand.value.toLowerCase())
    
    const precioActual = auto.precioActual || auto.precioBase || 0
    const matchesPrice = !filterMaxPrice.value || precioActual <= Number(filterMaxPrice.value)
    
    return matchesSearch && matchesBrand && matchesPrice
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  filterBrand.value = ''
  filterMaxPrice.value = ''
}

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('es-CL').format(price)
}

const formatNumber = (num) => {
  if (!num) return '0'
  return new Intl.NumberFormat('es-CL').format(num)
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-CL', {
    month: 'short',
    day: 'numeric'
  })
}

const toggleFavorite = (auto) => {
  auto.esFavorito = !auto.esFavorito
  // TODO: Implementar guardado en backend
}

const viewAuto = (auto) => {
  navigateTo(`/dealer/remates-live-${auto.id}`)
}

const pujar = (auto) => {
  navigateTo(`/dealer/remates-live-${auto.id}`)
}

onMounted(() => {
  loadAutos()
})
</script>
