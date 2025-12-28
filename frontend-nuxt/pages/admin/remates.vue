<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Remates Activos</h1>
        <p class="text-gray-600 mt-2">Gestiona los remates en curso</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
            <p class="text-sm text-gray-600">Finalizando Hoy</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.finalizandoHoy }}</p>
          </div>
          <Clock :size="32" class="text-red-500" />
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
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Auto, marca, modelo..."
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
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Período</label>
          <select
            v-model="filterDateRange"
            @change="onDateRangeChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Todos</option>
            <option value="7d">Últimos 7 días</option>
            <option value="1m">Último mes</option>
            <option value="3m">Últimos 3 meses</option>
            <option value="custom">Fecha personalizada</option>
          </select>
        </div>
        <div v-if="filterDateRange === 'custom'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
          <input
            type="date"
            v-model="filterCustomDate"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <div v-else class="flex items-end">
          <button
            @click="resetFilters"
            class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpiar Filtros
          </button>
        </div>
        <div v-if="filterDateRange === 'custom'" class="flex items-end">
          <button
            @click="resetFilters"
            class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Cargando remates...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
      {{ error }}
    </div>

    <!-- Lista de Remates -->
    <div v-else class="space-y-4">
      <div
        v-for="auto in filteredRemates"
        :key="auto.id"
        class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-4">
              <div class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  v-if="auto.imagenes && auto.imagenes.length > 0"
                  :src="getImageUrl(auto.imagenes[0])"
                  :alt="auto.marca + ' ' + auto.modelo"
                  class="w-full h-full object-cover"
                />
                <Car v-else :size="32" class="text-gray-400" />
              </div>
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <h3 class="text-xl font-bold text-gray-900">
                    {{ auto.marca }} {{ auto.modelo }} {{ auto.anio }}
                  </h3>
                  <span
                    :class="[
                      'px-2 py-1 text-xs font-semibold rounded-full',
                      getStatusBadgeClass(auto.estado)
                    ]"
                  >
                    {{ formatStatus(auto.estado) }}
                  </span>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                  <div>
                    <p class="text-xs text-gray-500">Puja Actual</p>
                    <p class="text-lg font-bold text-orange-600">${{ formatPrice(auto.precioActual) }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Precio Base</p>
                    <p class="text-sm font-medium text-gray-700">${{ formatPrice(auto.precioBase) }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Total Pujas</p>
                    <p class="text-sm font-medium text-gray-700">{{ auto.totalPujas || 0 }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Tiempo Restante</p>
                    <p 
                      v-if="auto.fechaFinRemate"
                      :class="[
                        'text-sm font-medium',
                        getTimeRemainingClass(auto.fechaFinRemate)
                      ]"
                    >
                      {{ getTimeRemaining(auto.fechaFinRemate) }}
                    </p>
                    <p v-else class="text-sm font-medium text-gray-700">N/A</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col space-y-2 ml-4">
            <button
              @click="viewRemate(auto.id)"
              class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
            >
              Ver Remate
            </button>
            <button
              v-if="auto.estado === 'en_remate'"
              @click="endRemate(auto.id)"
              class="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm"
            >
              Finalizar
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredRemates.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
        <Car :size="48" class="text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 text-lg">No hay remates activos</p>
        <p class="text-gray-400 text-sm mt-2">Los remates aparecerán aquí cuando se envíen autos a subasta</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { navigateTo } from 'nuxt/app'
import { Gavel, Clock, HandCoins, DollarSign, Car } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'
import { useImageUrl } from '~/composables/useImageUrl'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['admin', 'superadmin']
})

const { getAuthHeaders } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const searchQuery = ref('')
const filterStatus = ref('')
const filterDateRange = ref('')
const filterCustomDate = ref('')
const remates = ref([])
const loading = ref(false)
const error = ref(null)
let updateInterval = null

const stats = computed(() => {
  const hoy = new Date().toDateString()
  const activos = remates.value.filter(a => a.estado === 'en_remate')
  const finalizandoHoy = activos.filter(a => {
    if (!a.fechaFinRemate) return false
    const fechaFin = new Date(a.fechaFinRemate)
    return fechaFin.toDateString() === hoy
  }).length
  
  const totalPujas = remates.value.reduce((sum, a) => sum + (a.totalPujas || 0), 0)
  const valorTotal = remates.value.reduce((sum, a) => sum + parseFloat(a.precioActual || 0), 0)
  
  return {
    activos: activos.length,
    finalizandoHoy,
    totalPujas,
    valorTotal
  }
})

const filteredRemates = computed(() => {
  return remates.value.filter(auto => {
    const matchesSearch = !searchQuery.value ||
      `${auto.marca} ${auto.modelo}`.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = !filterStatus.value || auto.estado === filterStatus.value
    
    // Filtro de fecha
    const matchesDate = !filterDateRange.value || matchesDateFilter(auto)
    
    return matchesSearch && matchesStatus && matchesDate
  })
})

const matchesDateFilter = (auto) => {
  if (!filterDateRange.value) return true
  
  // Usar fechaInicioRemate si existe, sino usar createdAt
  const fechaReferencia = auto.fechaInicioRemate || auto.createdAt
  if (!fechaReferencia) return false
  
  const fechaAuto = new Date(fechaReferencia)
  const ahora = new Date()
  let fechaLimite = null
  
  switch (filterDateRange.value) {
    case '7d':
      fechaLimite = new Date(ahora)
      fechaLimite.setDate(ahora.getDate() - 7)
      break
    case '1m':
      fechaLimite = new Date(ahora)
      fechaLimite.setMonth(ahora.getMonth() - 1)
      break
    case '3m':
      fechaLimite = new Date(ahora)
      fechaLimite.setMonth(ahora.getMonth() - 3)
      break
    case 'custom':
      if (!filterCustomDate.value) return true
      fechaLimite = new Date(filterCustomDate.value)
      fechaLimite.setHours(0, 0, 0, 0)
      // Para fecha personalizada, mostrar desde esa fecha en adelante
      return fechaAuto >= fechaLimite
    default:
      return true
  }
  
  if (fechaLimite) {
    fechaLimite.setHours(0, 0, 0, 0)
    return fechaAuto >= fechaLimite
  }
  
  return true
}

const onDateRangeChange = () => {
  // Limpiar fecha personalizada si se cambia a otra opción
  if (filterDateRange.value !== 'custom') {
    filterCustomDate.value = ''
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  filterDateRange.value = ''
  filterCustomDate.value = ''
}

const formatStatus = (estado) => {
  const status = {
    en_remate: 'En Remate',
    vendido: 'Vendido',
    aprobado: 'Aprobado',
    disponible: 'Disponible'
  }
  return status[estado] || estado
}

const getStatusBadgeClass = (estado) => {
  const classes = {
    en_remate: 'bg-purple-100 text-purple-800',
    vendido: 'bg-gray-100 text-gray-800',
    aprobado: 'bg-green-100 text-green-800',
    disponible: 'bg-green-100 text-green-800'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800'
}

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('es-CL').format(price)
}

const { getImageUrl: getImageUrlHelper } = useImageUrl()

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  return getImageUrlHelper(imagePath)
}

const getTimeRemaining = (fechaFin) => {
  if (!fechaFin) return 'N/A'
  const ahora = new Date()
  const fin = new Date(fechaFin)
  const diff = fin - ahora
  
  if (diff <= 0) return 'Finalizado'
  
  const minutos = Math.floor(diff / 60000)
  const segundos = Math.floor((diff % 60000) / 1000)
  
  return `${minutos}:${segundos.toString().padStart(2, '0')}`
}

const getTimeRemainingClass = (fechaFin) => {
  if (!fechaFin) return 'text-gray-700'
  const ahora = new Date()
  const fin = new Date(fechaFin)
  const diff = fin - ahora
  const minutos = Math.floor(diff / 60000)
  
  if (diff <= 0) return 'text-red-600 font-bold'
  if (minutos < 5) return 'text-red-600 font-bold'
  if (minutos < 10) return 'text-orange-600 font-semibold'
  return 'text-green-600'
}

const loadRemates = async () => {
  loading.value = true
  error.value = null
  try {
    // Traer autos que estén en remate O que hayan sido vendidos (que hayan tenido remate)
    // Hacer dos peticiones separadas ya que el endpoint solo acepta un estado a la vez
    let allAutos = []
    
    try {
      const enRemate = await $fetch(`${API_BASE}/autos?estado=en_remate`, {
        headers: getAuthHeaders()
      })
      allAutos = [...allAutos, ...(enRemate || [])]
    } catch (err) {
      console.warn('Error cargando remates activos:', err)
    }
    
    try {
      const vendidos = await $fetch(`${API_BASE}/autos?estado=vendido`, {
        headers: getAuthHeaders()
      })
      // Solo incluir vendidos que hayan tenido fechaInicioRemate (que hayan estado en remate)
      const vendidosConRemate = (vendidos || []).filter(auto => auto.fechaInicioRemate)
      allAutos = [...allAutos, ...vendidosConRemate]
    } catch (err) {
      console.warn('Error cargando remates vendidos:', err)
    }
    
    // Eliminar duplicados por ID
    const uniqueAutos = allAutos.reduce((acc, auto) => {
      if (!acc.find(a => a.id === auto.id)) {
        acc.push(auto)
      }
      return acc
    }, [])
    
    // Obtener pujas para cada auto
    for (const auto of uniqueAutos) {
      try {
        const pujas = await $fetch(`${API_BASE}/remates?autoId=${auto.id}`, {
          headers: getAuthHeaders()
        })
        auto.totalPujas = pujas.length
        // Actualizar precio actual con la puja más alta
        if (pujas.length > 0) {
          const pujaMasAlta = pujas.reduce((max, p) => parseFloat(p.monto) > parseFloat(max.monto) ? p : max, pujas[0])
          auto.precioActual = parseFloat(pujaMasAlta.monto)
        } else if (auto.estado === 'vendido' && auto.precioActual) {
          // Si está vendido y no hay pujas, mantener el precioActual que ya tiene
          // No hacer nada, ya tiene precioActual
        } else if (auto.precioBase) {
          // Si no hay pujas, usar precioBase como precioActual
          auto.precioActual = parseFloat(auto.precioBase || 0)
        }
      } catch (err) {
        console.warn(`Error cargando pujas para auto ${auto.id}:`, err)
        auto.totalPujas = 0
        if (!auto.precioActual && auto.precioBase) {
          auto.precioActual = parseFloat(auto.precioBase || 0)
        }
      }
    }
    
    remates.value = uniqueAutos
  } catch (err) {
    console.error('Error cargando remates:', err)
    error.value = err.data?.message || 'Error al cargar remates'
  } finally {
    loading.value = false
  }
}

const viewRemate = (autoId) => {
  navigateTo(`/admin/remates/${autoId}`)
}

const endRemate = async (autoId) => {
  if (!confirm('¿Estás seguro de finalizar este remate?')) return
  
  try {
    await $fetch(`${API_BASE}/autos/${autoId}/finalizar-remate`, {
      method: 'PUT',
      headers: getAuthHeaders()
    })
    alert('Remate finalizado exitosamente!')
    await loadRemates()
  } catch (err) {
    console.error('Error finalizando remate:', err)
    alert(err.data?.message || 'Error al finalizar remate')
  }
}

onMounted(() => {
  loadRemates()
  // Actualizar cada 3 segundos solo si hay remates activos
  updateInterval = setInterval(() => {
    // Solo actualizar si hay remates en estado 'en_remate' y que aún no hayan terminado
    const hayRematesActivos = remates.value.some(a => {
      if (a.estado !== 'en_remate') return false
      if (a.fechaFinRemate) {
        const ahora = new Date()
        const fin = new Date(a.fechaFinRemate)
        return fin > ahora // Solo activo si aún no ha terminado
      }
      return true
    })
    if (hayRematesActivos) {
      loadRemates()
    } else {
      // Si no hay remates activos, detener actualizaciones
      if (updateInterval) {
        clearInterval(updateInterval)
        updateInterval = null
      }
    }
  }, 3000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>
