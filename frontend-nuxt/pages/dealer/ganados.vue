<template>
  <div class="min-h-screen pb-20 bg-slate-50">
    <!-- Main Content -->
    <main>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header class="mb-6">
          <div>
            <h2 class="text-3xl font-black text-slate-900 mb-1">Autos Ganados</h2>
            <p class="text-sm text-slate-500">
              Autos que has ganado en remates
            </p>
          </div>
        </header>

        <div v-if="loading" class="text-center py-12">
          <p class="text-slate-400 font-medium text-xs">Cargando autos ganados...</p>
        </div>

        <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-xs">
          {{ error }}
        </div>

        <div v-else>
          <!-- Stats -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1">Total Ganados</p>
                  <p class="text-2xl font-black text-slate-900">{{ stats.autosGanados }}</p>
                </div>
                <div class="bg-yellow-50 p-2 rounded-lg">
                  <Trophy :size="20" class="text-yellow-600" />
                </div>
              </div>
            </div>
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1">Total Invertido</p>
                  <p class="text-2xl font-black text-slate-900">${{ formatPrice(totalInvertido) }}</p>
                </div>
                <div class="bg-green-50 p-2 rounded-lg">
                  <DollarSign :size="20" class="text-green-600" />
                </div>
              </div>
            </div>
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1">Este Año</p>
                  <p class="text-2xl font-black text-slate-900">{{ autosEsteAnio }}</p>
                </div>
                <div class="bg-blue-50 p-2 rounded-lg">
                  <Calendar :size="20" class="text-blue-600" />
                </div>
              </div>
            </div>
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1">Promedio</p>
                  <p class="text-2xl font-black text-slate-900">${{ formatPrice(promedioCompra) }}</p>
                </div>
                <div class="bg-orange-50 p-2 rounded-lg">
                  <TrendingUp :size="20" class="text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          <!-- Lista de Autos Ganados -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div
              v-for="auto in autosGanados"
              :key="auto.id"
              class="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all overflow-hidden group"
            >
              <div class="h-40 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                <img
                  v-if="getFirstImage(auto)"
                  :src="getFirstImage(auto)"
                  :alt="`${auto.auto.marca} ${auto.auto.modelo}`"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
                <Car v-else :size="40" class="text-slate-400" />
                <div class="absolute top-3 right-3">
                  <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-100 text-green-700 uppercase tracking-wide">
                    Ganado
                  </span>
                </div>
              </div>
              <div class="p-5">
                <h3 class="text-base font-black text-slate-900 mb-1.5">
                  {{ auto.auto.marca }} {{ auto.auto.modelo }} {{ auto.auto.anio }}
                </h3>
                <div class="space-y-1.5 mb-3 p-3 bg-slate-50 rounded-lg">
                  <div class="flex justify-between">
                    <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Precio Final</span>
                    <span class="text-xs font-black text-green-600">${{ formatPrice(auto.precioFinal) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Fecha Ganado</span>
                    <span class="text-xs font-bold text-slate-700">{{ formatDate(auto.fechaGanado) }}</span>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button
                    @click="viewAuto(auto)"
                    class="flex-1 px-3 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-bold"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="autosGanados.length === 0" class="text-center py-12">
            <p class="text-slate-400 font-medium text-xs">Aún no has ganado ningún auto</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Trophy, DollarSign, Calendar, TrendingUp, Car } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'
import { useImageUrl } from '~/composables/useImageUrl'
import { navigateTo } from 'nuxt/app'

const { getAuthHeaders } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const loading = ref(false)
const error = ref(null)
const stats = ref({
  autosGanados: 0,
  autosGanadosRecientes: []
})
const autosGanados = ref([])

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['dealer']
})

const totalInvertido = computed(() => {
  return autosGanados.value.reduce((sum, auto) => sum + parseFloat(auto.precioFinal || 0), 0)
})

const autosEsteAnio = computed(() => {
  const ahora = new Date()
  const inicioAnio = new Date(ahora.getFullYear(), 0, 1)
  return autosGanados.value.filter(auto => {
    const fechaGanado = new Date(auto.fechaGanado)
    return fechaGanado >= inicioAnio
  }).length
})

const promedioCompra = computed(() => {
  if (autosGanados.value.length === 0) return 0
  return totalInvertido.value / autosGanados.value.length
})

const loadAutosGanados = async () => {
  loading.value = true
  error.value = null
  try {
    console.log('[ganados.vue] Cargando autos ganados...')
    const statsResponse = await $fetch(`${API_BASE}/stats/dealer`, {
      headers: getAuthHeaders()
    })
    
    console.log('[ganados.vue] Respuesta completa:', statsResponse)
    console.log('[ganados.vue] Autos ganados recientes:', statsResponse.autosGanadosRecientes)
    
    stats.value = statsResponse
    autosGanados.value = statsResponse.autosGanadosRecientes || []
    
    // Log detallado de cada auto
    autosGanados.value.forEach((auto, index) => {
      console.log(`[ganados.vue] Auto ${index + 1}:`, {
        id: auto.id,
        autoId: auto.auto.id,
        marca: auto.auto.marca,
        modelo: auto.auto.modelo,
        imagenes: auto.auto.imagenes,
        imagenesType: typeof auto.auto.imagenes,
        imagenesIsArray: Array.isArray(auto.auto.imagenes),
        imagenesLength: auto.auto.imagenes ? auto.auto.imagenes.length : 0,
        primeraImagen: getFirstImage(auto)
      })
    })
  } catch (err) {
    console.error('[ganados.vue] Error cargando autos ganados:', err)
    error.value = err.data?.message || 'Error al cargar los autos ganados'
  } finally {
    loading.value = false
  }
}

const getFirstImage = (auto) => {
  if (!auto || !auto.auto) {
    console.log('[ganados.vue] getFirstImage: auto o auto.auto es null/undefined')
    return null
  }
  
  const imagenes = auto.auto.imagenes
  console.log(`[ganados.vue] getFirstImage para auto ${auto.auto.id}:`, {
    imagenes,
    imagenesType: typeof imagenes,
    imagenesIsArray: Array.isArray(imagenes)
  })
  
  if (!imagenes) {
    console.log(`[ganados.vue] getFirstImage: No hay imágenes para auto ${auto.auto.id}`)
    return null
  }
  
  let imagenesArray = []
  if (Array.isArray(imagenes)) {
    imagenesArray = imagenes
  } else if (typeof imagenes === 'string') {
    try {
      imagenesArray = JSON.parse(imagenes)
    } catch (e) {
      imagenesArray = [imagenes]
    }
  }
  
  if (imagenesArray.length === 0) {
    console.log(`[ganados.vue] getFirstImage: Array de imágenes vacío para auto ${auto.auto.id}`)
    return null
  }
  
  const primeraImagen = imagenesArray[0]
  console.log(`[ganados.vue] getFirstImage - primera imagen raw para auto ${auto.auto.id}:`, primeraImagen)
  
  // Usar el helper para obtener la URL (maneja R2 y rutas locales)
  if (primeraImagen) {
    const { getImageUrl: getImageUrlHelper } = useImageUrl()
    const imageUrl = getImageUrlHelper(primeraImagen)
    console.log(`[ganados.vue] getFirstImage - URL procesada para auto ${auto.auto.id}:`, imageUrl)
    return imageUrl
  }
  
  console.log(`[ganados.vue] getFirstImage - No se pudo obtener imagen para auto ${auto.auto.id}`)
  return null
}

const handleImageError = (event) => {
  console.error('[ganados.vue] Error cargando imagen:', event.target.src)
  event.target.style.display = 'none'
}

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('es-CL').format(price)
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const viewAuto = (auto) => {
  navigateTo(`/dealer/remates-live-${auto.auto.id}`)
}

onMounted(() => {
  loadAutosGanados()
})
</script>
