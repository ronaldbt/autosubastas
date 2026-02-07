<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Vendedores</h1>
      <p class="text-gray-600 mt-2">Gestiona los vendedores registrados</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-20">
      <p class="text-gray-500">Cargando vendedores...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
      {{ error }}
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border border-blue-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-blue-700 mb-1">Total Vendedores</p>
              <p class="text-3xl font-bold text-blue-900">{{ estadisticas.totalVendedores }}</p>
            </div>
            <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <UserCheck :size="32" class="text-white" />
            </div>
          </div>
        </div>
        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 border border-green-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-green-700 mb-1">Activos</p>
              <p class="text-3xl font-bold text-green-900">{{ estadisticas.vendedoresActivos }}</p>
            </div>
            <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle :size="32" class="text-white" />
            </div>
          </div>
        </div>
        <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg p-6 border border-orange-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-orange-700 mb-1">Autos Publicados</p>
              <p class="text-3xl font-bold text-orange-900">{{ estadisticas.totalAutosPublicados }}</p>
            </div>
            <div class="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Car :size="32" class="text-white" />
            </div>
          </div>
        </div>
        <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-6 border border-purple-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-purple-700 mb-1">Ventas Totales</p>
              <p class="text-3xl font-bold text-purple-900">{{ estadisticas.totalVentas }}</p>
            </div>
            <div class="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <Trophy :size="32" class="text-white" />
            </div>
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
              placeholder="Nombre, email..."
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
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
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

      <!-- Tabla de Vendedores -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendedor
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Autos Publicados
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ventas
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calificación
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
              <tr v-if="filteredVendedores.length === 0" class="hover:bg-gray-50">
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                  No hay vendedores registrados
                </td>
              </tr>
              <tr v-for="vendedor in filteredVendedores" :key="vendedor.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
                      <span class="text-white font-semibold text-sm">
                        {{ vendedor.nombre?.charAt(0).toUpperCase() || 'U' }}
                      </span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ vendedor.nombre }}</div>
                      <div class="text-sm text-gray-500">{{ vendedor.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ vendedor.telefono || 'N/A' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ vendedor.autosPublicados }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ vendedor.ventas }}</div>
                  <div class="text-xs text-gray-500">${{ formatPrice(vendedor.ingresosGenerados) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <span class="text-sm font-medium text-gray-900 mr-2">{{ vendedor.calificacion }}/5</span>
                    <div class="flex">
                      <Star
                        v-for="i in 5"
                        :key="i"
                        :size="14"
                        :class="i <= Math.round(vendedor.calificacion) ? 'text-yellow-400 fill-current' : 'text-gray-300'"
                      />
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-2 py-1 text-xs font-semibold rounded-full',
                      vendedor.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ vendedor.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button
                      @click="viewVendedor(vendedor)"
                      class="text-orange-600 hover:text-orange-900 transition-colors"
                      title="Ver Detalles"
                    >
                      <Eye :size="18" />
                    </button>
                    <button
                      @click="editVendedor(vendedor)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Editar"
                    >
                      <Settings :size="18" />
                    </button>
                    <button
                      @click="toggleStatus(vendedor)"
                      :disabled="isToggling"
                      :class="[
                        'transition-colors',
                        vendedor.activo ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900',
                        isToggling ? 'opacity-50 cursor-not-allowed' : ''
                      ]"
                      :title="vendedor.activo ? 'Desactivar' : 'Activar'"
                    >
                      <UserCheck :size="18" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button 
              @click="previousPage"
              :disabled="currentPage === 1"
              :class="[
                'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
                currentPage === 1 
                  ? 'text-gray-300 bg-gray-100 cursor-not-allowed' 
                  : 'text-gray-700 bg-white hover:bg-gray-50'
              ]"
            >
              Anterior
            </button>
            <button 
              @click="nextPage"
              :disabled="currentPage >= totalPages"
              :class="[
                'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
                currentPage >= totalPages 
                  ? 'text-gray-300 bg-gray-100 cursor-not-allowed' 
                  : 'text-gray-700 bg-white hover:bg-gray-50'
              ]"
            >
              Siguiente
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando <span class="font-medium">{{ startIndex + 1 }}</span> a 
                <span class="font-medium">{{ endIndex }}</span> de
                <span class="font-medium">{{ filteredVendedores.length }}</span> resultados
              </p>
            </div>
            <div class="flex space-x-2">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                :class="[
                  'px-3 py-1 border border-gray-300 rounded-md text-sm',
                  currentPage === 1 
                    ? 'text-gray-300 bg-gray-100 cursor-not-allowed' 
                    : 'text-gray-700 bg-white hover:bg-gray-50'
                ]"
              >
                Anterior
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage >= totalPages"
                :class="[
                  'px-3 py-1 border border-gray-300 rounded-md text-sm',
                  currentPage >= totalPages 
                    ? 'text-gray-300 bg-gray-100 cursor-not-allowed' 
                    : 'text-gray-700 bg-white hover:bg-gray-50'
                ]"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { UserCheck, CheckCircle, Car, Trophy, Star, Eye, Settings } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['admin', 'superadmin']
})

const { getAuthHeaders } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const loading = ref(true)
const error = ref(null)
const vendedores = ref([])
const estadisticas = ref({
  totalVendedores: 0,
  vendedoresActivos: 0,
  totalAutosPublicados: 0,
  totalVentas: 0
})
const searchQuery = ref('')
const filterStatus = ref('')
const isToggling = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10

const loadVendedores = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await $fetch(`${API_BASE}/usuarios/vendedores/estadisticas`, {
      headers: getAuthHeaders()
    })
    
    vendedores.value = response.vendedores || []
    estadisticas.value = response.estadisticas || {
      totalVendedores: 0,
      vendedoresActivos: 0,
      totalAutosPublicados: 0,
      totalVentas: 0
    }
  } catch (err) {
    console.error('Error cargando vendedores:', err)
    error.value = err.data?.message || 'Error al cargar los vendedores'
  } finally {
    loading.value = false
  }
}

const filteredVendedores = computed(() => {
  let filtered = vendedores.value.filter(vendedor => {
    const matchesSearch = !searchQuery.value ||
      vendedor.nombre?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      vendedor.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = !filterStatus.value ||
      (filterStatus.value === 'activo' && vendedor.activo) ||
      (filterStatus.value === 'inactivo' && !vendedor.activo)
    
    return matchesSearch && matchesStatus
  })

  // Paginación
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filtered.slice(start, end)
})

const totalPages = computed(() => {
  const total = vendedores.value.filter(vendedor => {
    const matchesSearch = !searchQuery.value ||
      vendedor.nombre?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      vendedor.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = !filterStatus.value ||
      (filterStatus.value === 'activo' && vendedor.activo) ||
      (filterStatus.value === 'inactivo' && !vendedor.activo)
    
    return matchesSearch && matchesStatus
  }).length
  
  return Math.ceil(total / itemsPerPage)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage
})

const endIndex = computed(() => {
  const total = vendedores.value.filter(vendedor => {
    const matchesSearch = !searchQuery.value ||
      vendedor.nombre?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      vendedor.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = !filterStatus.value ||
      (filterStatus.value === 'activo' && vendedor.activo) ||
      (filterStatus.value === 'inactivo' && !vendedor.activo)
    
    return matchesSearch && matchesStatus
  }).length
  
  return Math.min(startIndex.value + itemsPerPage, total)
})

const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  currentPage.value = 1
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('es-CL').format(Math.round(price))
}

const viewVendedor = (vendedor) => {
  console.log('Ver vendedor:', vendedor)
  // TODO: Implementar vista de detalles
  alert(`Ver detalles de ${vendedor.nombre}`)
}

const editVendedor = (vendedor) => {
  console.log('Editar vendedor:', vendedor)
  // TODO: Implementar edición
  alert(`Editar ${vendedor.nombre}`)
}

const toggleStatus = async (vendedor) => {
  if (isToggling.value) return
  
  const nuevoEstado = !vendedor.activo
  const confirmacion = confirm(
    `¿Estás seguro de ${nuevoEstado ? 'activar' : 'desactivar'} a ${vendedor.nombre}?`
  )
  
  if (!confirmacion) return
  
  isToggling.value = true
  
  try {
    await $fetch(`${API_BASE}/usuarios/${vendedor.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: {
        activo: nuevoEstado
      }
    })
    
    // Actualizar estado local
    vendedor.activo = nuevoEstado
    estadisticas.value.vendedoresActivos = vendedores.value.filter(v => v.activo).length
    
    alert(`${vendedor.nombre} ha sido ${nuevoEstado ? 'activado' : 'desactivado'} exitosamente`)
  } catch (err) {
    console.error('Error cambiando estado:', err)
    alert(err.data?.message || 'Error al cambiar el estado del vendedor')
  } finally {
    isToggling.value = false
  }
}

// Resetear página cuando cambian los filtros
watch([searchQuery, filterStatus], () => {
  currentPage.value = 1
})

onMounted(() => {
  loadVendedores()
})
</script>
