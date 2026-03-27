<template>
  <div>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Remates Activos</h1>
        <p class="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Gestiona todos los remates en curso</p>
      </div>
      <button class="w-full sm:w-auto px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
        <PlusCircle :size="20" />
        <span>Nuevo Remate</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 mb-6">
      <p class="text-gray-500">Cargando remates...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
      {{ error }}
    </div>

    <!-- Stats -->
    <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Remates Activos</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.activos }}</p>
          </div>
          <Gavel :size="32" class="text-orange-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Pujas</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.totalPujas }}</p>
          </div>
          <HandCoins :size="32" class="text-blue-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Valor Total</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">${{ formatPrice(stats.valorTotal) }}</p>
          </div>
          <DollarSign :size="32" class="text-green-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Finalizando Hoy</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.finalizandoHoy }}</p>
          </div>
          <Clock :size="32" class="text-red-500" />
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Auto, remate..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            v-model="filterStatus"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Todos</option>
            <option value="en_remate">En Remate</option>
            <option value="vendido">Vendido</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de Remates -->
    <div class="space-y-4">
      <div
        v-for="remate in filteredRemates"
        :key="remate.id"
        class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 sm:p-6"
      >
        <div class="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
          <div class="flex flex-col sm:flex-row flex-1 min-w-0 gap-4">
            <div class="w-full sm:w-28 h-40 sm:h-28 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0 mx-auto sm:mx-0">
              <img
                v-if="getFirstImage(remate.auto)"
                :src="getImageUrl(getFirstImage(remate.auto))"
                :alt="remate.auto.marca + ' ' + remate.auto.modelo"
                class="w-full h-full object-cover"
              />
              <Car v-else :size="32" class="text-gray-400" />
            </div>
            <div class="flex-1 min-w-0 w-full">
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap sm:gap-3">
                <h3 class="text-lg sm:text-xl font-bold text-gray-900 break-words">
                  {{ remate.auto.marca }} {{ remate.auto.modelo }} {{ remate.auto.anio }}
                </h3>
                <span
                  :class="[
                    'px-2 py-1 text-xs font-semibold rounded-full shrink-0 self-start',
                    getStatusBadgeClass(remate.auto.estado)
                  ]"
                >
                  {{ formatStatus(remate.auto.estado) }}
                </span>
              </div>
              <p class="text-sm text-gray-600 mt-1 break-words">
                {{ remate.auto.patente ? `${remate.auto.patente} • ` : '' }}
                {{ remate.auto.kilometraje ? `${remate.auto.kilometraje} km` : '' }}
              </p>
              <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div class="min-w-0 rounded-lg bg-orange-50/50 sm:bg-transparent p-2 sm:p-0 -mx-2 sm:mx-0">
                  <p class="text-xs text-gray-500 font-medium">Puja Actual</p>
                  <p class="text-base sm:text-lg font-bold text-orange-600 break-all">${{ formatPrice(remate.pujaActual) }}</p>
                </div>
                <div class="min-w-0">
                  <p class="text-xs text-gray-500 font-medium">Precio Base</p>
                  <p class="text-sm font-medium text-gray-700 break-all">${{ formatPrice(remate.precioBase) }}</p>
                </div>
                <div class="min-w-0">
                  <p class="text-xs text-gray-500 font-medium">Pujas</p>
                  <p class="text-sm font-medium text-gray-700">{{ remate.totalPujas }}</p>
                </div>
                <div class="min-w-0">
                  <p class="text-xs text-gray-500 font-medium">Finaliza</p>
                  <p class="text-sm font-medium text-gray-700 break-words">{{ formatDate(remate.fechaFin) }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-row flex-wrap lg:flex-col gap-2 w-full lg:w-auto lg:min-w-[9rem] shrink-0">
            <button
              type="button"
              @click="viewRemate(remate)"
              class="flex-1 min-w-[30%] lg:flex-none lg:w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
            >
              Ver Detalles
            </button>
            <button
              type="button"
              @click="editRemate(remate)"
              class="flex-1 min-w-[30%] lg:flex-none lg:w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Editar
            </button>
            <button
              v-if="remate.estado === 'en_remate'"
              type="button"
              @click="endRemate(remate)"
              class="flex-1 min-w-full sm:min-w-[30%] lg:flex-none lg:w-full px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
            >
              Finalizar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <div class="mt-6 bg-white rounded-lg shadow p-4 flex items-center justify-between">
      <p class="text-sm text-gray-700">
        Mostrando <span class="font-medium">1</span> a <span class="font-medium">10</span> de
        <span class="font-medium">{{ filteredRemates.length }}</span> resultados
      </p>
      <div class="flex space-x-2">
        <button class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Anterior
        </button>
        <button class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Gavel, HandCoins, DollarSign, Clock, Car } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'
import { useImageUrl } from '~/composables/useImageUrl'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['superadmin']
})

const { getAuthHeaders } = useAuth()
const { getImageUrl: getImageUrlHelper } = useImageUrl()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const searchQuery = ref('')
const filterStatus = ref('')
const remates = ref([])
const loading = ref(false)
const error = ref(null)
const stats = ref({
  activos: 0,
  finalizandoHoy: 0,
  totalPujas: 0,
  valorTotal: 0
})

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  return getImageUrlHelper(imagePath)
}

const getFirstImage = (auto) => {
  if (!auto.imagenes) return null
  let imagenes = []
  if (Array.isArray(auto.imagenes)) {
    imagenes = auto.imagenes
  } else if (typeof auto.imagenes === 'string') {
    try {
      imagenes = JSON.parse(auto.imagenes)
    } catch (e) {
      imagenes = [auto.imagenes]
    }
  }
  return imagenes.length > 0 ? imagenes[0] : null
}

const filteredRemates = computed(() => {
  return remates.value.filter(remate => {
    const matchesSearch = !searchQuery.value ||
      `${remate.auto.marca} ${remate.auto.modelo}`.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = !filterStatus.value || remate.auto.estado === filterStatus.value
    
    return matchesSearch && matchesStatus
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
}

const formatStatus = (estado) => {
  const status = {
    en_remate: 'En Remate',
    vendido: 'Vendido',
    finalizado: 'Finalizado',
    cancelado: 'Cancelado'
  }
  return status[estado] || estado
}

const getStatusBadgeClass = (estado) => {
  const classes = {
    en_remate: 'bg-green-100 text-green-800',
    vendido: 'bg-gray-100 text-gray-800',
    finalizado: 'bg-gray-100 text-gray-800',
    cancelado: 'bg-red-100 text-red-800'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800'
}

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('es-CL').format(Math.round(price))
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadRemates = async () => {
  loading.value = true
  error.value = null
  try {
    // Cargar autos en remate y vendidos
    const [rematesActivos, rematesVendidos] = await Promise.all([
      $fetch(`${API_BASE}/autos?estado=en_remate`, { headers: getAuthHeaders() }),
      $fetch(`${API_BASE}/autos?estado=vendido`, { headers: getAuthHeaders() })
    ])
    
    const todosRemates = [...(rematesActivos || []), ...(rematesVendidos || [])]
    
    // Obtener pujas para cada remate
    const rematesConPujas = await Promise.all(
      todosRemates.map(async (auto) => {
        try {
          const pujas = await $fetch(`${API_BASE}/remates?autoId=${auto.id}`, {
            headers: getAuthHeaders()
          })
          const pujaMaxima = pujas && pujas.length > 0 
            ? Math.max(...pujas.map(p => parseFloat(p.monto || 0)))
            : 0
          
          return {
            id: auto.id,
            auto: auto,
            precioBase: parseFloat(auto.precioBase || 0),
            pujaActual: pujaMaxima || parseFloat(auto.precioActual || auto.precioBase || 0),
            totalPujas: pujas ? pujas.length : 0,
            estado: auto.estado,
            fechaInicio: auto.fechaInicioRemate,
            fechaFin: auto.fechaFinRemate
          }
        } catch (err) {
          console.warn(`Error cargando pujas para auto ${auto.id}:`, err)
          return {
            id: auto.id,
            auto: auto,
            precioBase: parseFloat(auto.precioBase || 0),
            pujaActual: parseFloat(auto.precioActual || auto.precioBase || 0),
            totalPujas: 0,
            estado: auto.estado,
            fechaInicio: auto.fechaInicioRemate,
            fechaFin: auto.fechaFinRemate
          }
        }
      })
    )
    
    remates.value = rematesConPujas
    
    // Calcular estadísticas
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const manana = new Date(hoy)
    manana.setDate(manana.getDate() + 1)
    
    stats.value = {
      activos: remates.value.filter(r => r.estado === 'en_remate').length,
      finalizandoHoy: remates.value.filter(r => {
        if (!r.fechaFin) return false
        const fechaFin = new Date(r.fechaFin)
        fechaFin.setHours(0, 0, 0, 0)
        return fechaFin.getTime() === hoy.getTime()
      }).length,
      totalPujas: remates.value.reduce((sum, r) => sum + r.totalPujas, 0),
      valorTotal: remates.value.reduce((sum, r) => sum + r.pujaActual, 0)
    }
  } catch (err) {
    console.error('Error cargando remates:', err)
    error.value = err.data?.message || 'Error al cargar los remates'
  } finally {
    loading.value = false
  }
}

const viewRemate = (remate) => {
  console.log('Ver remate:', remate)
  // TODO: Navegar a página de detalles
}

const editRemate = (remate) => {
  console.log('Editar remate:', remate)
  // TODO: Navegar a página de edición
}

const endRemate = async (remate) => {
  if (!confirm('¿Estás seguro de finalizar este remate?')) return
  try {
    await $fetch(`${API_BASE}/autos/${remate.id}/estado`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: { estado: 'vendido' }
    })
    await loadRemates()
  } catch (err) {
    console.error('Error finalizando remate:', err)
    alert(err.data?.message || 'Error al finalizar el remate')
  }
}

onMounted(() => {
  loadRemates()
})
</script>










