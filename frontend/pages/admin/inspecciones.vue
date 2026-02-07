<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Peritajes</h1>
      <p class="text-gray-600 mt-2">Gestiona los peritajes realizados (últimos 3 meses)</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-20">
      <p class="text-gray-500">Cargando peritajes...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
      {{ error }}
    </div>

    <!-- Stats -->
    <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Pendientes</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.pendientes }}</p>
          </div>
          <Clock :size="32" class="text-yellow-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">En Proceso</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.enProceso }}</p>
          </div>
          <Calendar :size="32" class="text-blue-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Finalizados</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.finalizados }}</p>
          </div>
          <CheckCircle :size="32" class="text-green-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Este Mes</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.esteMes }}</p>
          </div>
          <ClipboardCheck :size="32" class="text-purple-500" />
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div v-if="!loading && !error" class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Patente, marca, modelo..."
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
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN_PROCESO">En Proceso</option>
            <option value="FINALIZADO">Finalizado</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input
            type="date"
            v-model="filterDate"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
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

    <!-- Tabla de Peritajes -->
    <div v-if="!loading && !error" class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="filteredPeritajes.length === 0" class="text-center py-12">
        <p class="text-gray-500">No hay peritajes para mostrar</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehículo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patente
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Perito
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="peritaje in filteredPeritajes" :key="peritaje.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    <Car :size="24" class="text-gray-400" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ peritaje.marca || 'N/A' }} {{ peritaje.modelo || '' }}
                    </div>
                    <div class="text-sm text-gray-500">{{ peritaje.anio || 'N/A' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ peritaje.patente }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ peritaje.perito?.nombre || 'N/A' }}</div>
                <div class="text-sm text-gray-500">{{ peritaje.perito?.email || '' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(peritaje.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-semibold rounded-full',
                    getStatusBadgeClass(peritaje.estado)
                  ]"
                >
                  {{ formatStatus(peritaje.estado) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <NuxtLink
                    :to="`/admin/autos-peritaje?id=${peritaje.id}`"
                    class="text-orange-600 hover:text-orange-900"
                    title="Ver Detalles"
                  >
                    <Eye :size="18" />
                  </NuxtLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div v-if="filteredPeritajes.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button 
            @click="currentPage > 1 && currentPage--"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button 
            @click="currentPage++"
            :disabled="currentPage >= totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Mostrando <span class="font-medium">{{ startIndex + 1 }}</span> a 
              <span class="font-medium">{{ Math.min(endIndex, filteredPeritajes.length) }}</span> de
              <span class="font-medium">{{ filteredPeritajes.length }}</span> resultados
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Clock, Calendar, CheckCircle, ClipboardCheck, Car, Eye } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['admin']
})

const { getAuthHeaders } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const loading = ref(true)
const error = ref(null)
const peritajes = ref([])
const searchQuery = ref('')
const filterStatus = ref('')
const filterDate = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const stats = computed(() => {
  const ahora = new Date()
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
  
  return {
    pendientes: peritajes.value.filter(p => p.estado === 'PENDIENTE').length,
    enProceso: peritajes.value.filter(p => p.estado === 'EN_PROCESO').length,
    finalizados: peritajes.value.filter(p => p.estado === 'FINALIZADO').length,
    esteMes: peritajes.value.filter(p => new Date(p.createdAt) >= inicioMes).length
  }
})

const filteredPeritajes = computed(() => {
  let filtered = peritajes.value

  // Filtro de búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(peritaje => {
      return (
        peritaje.patente?.toLowerCase().includes(query) ||
        peritaje.marca?.toLowerCase().includes(query) ||
        peritaje.modelo?.toLowerCase().includes(query) ||
        peritaje.perito?.nombre?.toLowerCase().includes(query) ||
        peritaje.perito?.email?.toLowerCase().includes(query)
      )
    })
  }

  // Filtro de estado
  if (filterStatus.value) {
    filtered = filtered.filter(peritaje => peritaje.estado === filterStatus.value)
  }

  // Filtro de fecha
  if (filterDate.value) {
    filtered = filtered.filter(peritaje => {
      const fechaPeritaje = new Date(peritaje.createdAt).toISOString().split('T')[0]
      return fechaPeritaje === filterDate.value
    })
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredPeritajes.value.length / itemsPerPage)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage
})

const endIndex = computed(() => {
  return startIndex.value + itemsPerPage
})

const loadPeritajes = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE}/peritajes`, {
      headers: getAuthHeaders()
    })
    peritajes.value = response || []
  } catch (err) {
    console.error('Error cargando peritajes:', err)
    error.value = err.data?.message || 'Error al cargar los peritajes'
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  filterDate.value = ''
  currentPage.value = 1
}

const formatStatus = (estado) => {
  const status = {
    PENDIENTE: 'Pendiente',
    EN_PROCESO: 'En Proceso',
    FINALIZADO: 'Finalizado'
  }
  return status[estado] || estado
}

const getStatusBadgeClass = (estado) => {
  const classes = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800',
    EN_PROCESO: 'bg-blue-100 text-blue-800',
    FINALIZADO: 'bg-green-100 text-green-800'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800'
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

onMounted(() => {
  loadPeritajes()
})
</script>
