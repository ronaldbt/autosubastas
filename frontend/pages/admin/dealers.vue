<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Dealers</h1>
      <p class="text-gray-600 mt-2">Gestiona los dealers registrados</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Cargando dealers...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <!-- Stats -->
    <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Dealers</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ estadisticas.totalDealers }}</p>
          </div>
          <Users :size="32" class="text-blue-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Activos</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ estadisticas.dealersActivos }}</p>
          </div>
          <CheckCircle :size="32" class="text-green-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Pujas Totales</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ formatNumber(estadisticas.totalPujas) }}</p>
          </div>
          <HandCoins :size="32" class="text-orange-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Compras Totales</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ formatNumber(estadisticas.totalCompras) }}</p>
          </div>
          <ShoppingCart :size="32" class="text-purple-500" />
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

    <!-- Tabla de Dealers -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dealer
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pujas
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Compras
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gasto Total
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
            <tr v-if="loading" class="hover:bg-gray-50">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500">Cargando...</td>
            </tr>
            <tr v-else-if="filteredDealers.length === 0" class="hover:bg-gray-50">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500">No se encontraron dealers</td>
            </tr>
            <tr v-else v-for="dealer in filteredDealers" :key="dealer.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span class="text-orange-600 font-semibold text-sm">
                      {{ dealer.nombre?.charAt(0)?.toUpperCase() || 'D' }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ dealer.nombre || 'N/A' }}</div>
                    <div class="text-sm text-gray-500">{{ dealer.email || 'N/A' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ dealer.telefono || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ dealer.totalPujas }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ dealer.compras }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-bold text-green-600">${{ formatPrice(dealer.gastoTotal) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-semibold rounded-full',
                    dealer.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ dealer.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="viewDealer(dealer)"
                    class="text-orange-600 hover:text-orange-900"
                    title="Ver Detalles"
                  >
                    <Eye :size="18" />
                  </button>
                  <button
                    @click="editDealer(dealer)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Editar"
                  >
                    <Settings :size="18" />
                  </button>
                  <button
                    @click="toggleStatus(dealer)"
                    :class="dealer.activo ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                    :title="dealer.activo ? 'Desactivar' : 'Activar'"
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
          <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Anterior
          </button>
          <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Siguiente
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Mostrando <span class="font-medium">1</span> a <span class="font-medium">10</span> de
              <span class="font-medium">{{ filteredDealers.length }}</span> resultados
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Users, CheckCircle, HandCoins, ShoppingCart, Eye, Settings, UserCheck } from 'lucide-vue-next'
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
const dealers = ref([])
const estadisticas = ref({
  totalDealers: 0,
  dealersActivos: 0,
  totalPujas: 0,
  totalCompras: 0
})
const searchQuery = ref('')
const filterStatus = ref('')
const isToggling = ref(false)

const loadDealers = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await $fetch(`${API_BASE}/usuarios/dealers/estadisticas`, {
      headers: getAuthHeaders()
    })
    
    dealers.value = response.dealers || []
    estadisticas.value = response.estadisticas || {
      totalDealers: 0,
      dealersActivos: 0,
      totalPujas: 0,
      totalCompras: 0
    }
  } catch (err) {
    console.error('Error cargando dealers:', err)
    error.value = err.data?.message || 'Error al cargar los dealers'
  } finally {
    loading.value = false
  }
}

const filteredDealers = computed(() => {
  return dealers.value.filter(dealer => {
    const matchesSearch = !searchQuery.value ||
      dealer.nombre?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      dealer.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = !filterStatus.value ||
      (filterStatus.value === 'activo' && dealer.activo) ||
      (filterStatus.value === 'inactivo' && !dealer.activo)
    
    return matchesSearch && matchesStatus
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
}

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('es-CL').format(Math.round(price))
}

const formatNumber = (num) => {
  if (!num) return '0'
  return new Intl.NumberFormat('es-CL').format(num)
}

const viewDealer = (dealer) => {
  console.log('Ver dealer:', dealer)
  // TODO: Implementar vista de detalles del dealer
}

const editDealer = (dealer) => {
  console.log('Editar dealer:', dealer)
  // TODO: Implementar edición del dealer
}

const toggleStatus = async (dealer) => {
  if (isToggling.value) return
  
  isToggling.value = true
  try {
    await $fetch(`${API_BASE}/usuarios/${dealer.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: {
        activo: !dealer.activo
      }
    })
    
    // Actualizar el estado local
    dealer.activo = !dealer.activo
    
    // Recargar datos para actualizar estadísticas
    await loadDealers()
  } catch (err) {
    console.error('Error cambiando estado del dealer:', err)
    alert(err.data?.message || 'Error al cambiar el estado del dealer')
  } finally {
    isToggling.value = false
  }
}

onMounted(() => {
  loadDealers()
})
</script>










