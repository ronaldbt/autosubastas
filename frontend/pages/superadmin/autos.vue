<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Autos</h1>
        <p class="text-gray-600 mt-2">Gestiona todos los autos del sistema</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 mb-6">
      <p class="text-gray-500">Cargando autos...</p>
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
            <p class="text-sm text-gray-600">Total Autos</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.totalAutos }}</p>
          </div>
          <Car :size="32" class="text-blue-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">En Remate</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.enRemate }}</p>
          </div>
          <Gavel :size="32" class="text-orange-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Vendidos</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.vendidos }}</p>
          </div>
          <CheckCircle :size="32" class="text-green-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Pendientes</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.pendientes }}</p>
          </div>
          <Clock :size="32" class="text-yellow-500" />
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Marca, modelo..."
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
            <option value="pendiente">Pendiente</option>
            <option value="en_remate">En Remate</option>
            <option value="vendido">Vendido</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Marca</label>
          <select
            v-model="filterBrand"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Todas</option>
            <option
              v-for="marca in marcasUnicas"
              :key="marca"
              :value="marca.toLowerCase()"
            >
              {{ marca }}
            </option>
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

    <!-- Grid de Autos -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="auto in filteredAutos"
        :key="auto.id"
        class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
      >
        <div class="h-48 bg-gray-200 relative">
          <img
            v-if="getFirstImage(auto)"
            :src="getImageUrl(getFirstImage(auto))"
            :alt="auto.marca + ' ' + auto.modelo"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <Car :size="48" class="text-gray-400" />
          </div>
          <span
            :class="[
              'absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full',
              getStatusBadgeClass(auto.estado)
            ]"
          >
            {{ formatStatus(auto.estado) }}
          </span>
        </div>
        <div class="p-4">
          <h3 class="text-lg font-bold text-gray-900">{{ auto.marca }} {{ auto.modelo }} {{ auto.anio }}</h3>
          <p class="text-sm text-gray-600 mt-1">
            {{ auto.patente ? `${auto.patente} • ` : '' }}
            {{ auto.kilometraje ? `${formatNumber(auto.kilometraje)} km` : '' }}
            {{ auto.transmision ? ` • ${auto.transmision}` : '' }}
            {{ auto.combustible ? ` • ${auto.combustible}` : '' }}
          </p>
          <div class="mt-4 flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold text-orange-600">${{ formatPrice(auto.precioActual || auto.precioBase) }}</p>
            </div>
            <div class="flex space-x-2">
              <button
                @click="viewAuto(auto)"
                class="px-3 py-1 text-sm text-orange-600 hover:bg-orange-50 rounded transition-colors"
              >
                Ver
              </button>
              <button
                @click="editAuto(auto)"
                class="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <div class="mt-6 bg-white rounded-lg shadow p-4 flex items-center justify-between">
      <p class="text-sm text-gray-700">
        Mostrando <span class="font-medium">1</span> a <span class="font-medium">12</span> de
        <span class="font-medium">{{ filteredAutos.length }}</span> resultados
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
import { Car, Gavel, CheckCircle, Clock } from 'lucide-vue-next'
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
const filterBrand = ref('')
const autos = ref([])
const loading = ref(false)
const error = ref(null)
const stats = ref({
  totalAutos: 0,
  enRemate: 0,
  vendidos: 0,
  pendientes: 0
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

const filteredAutos = computed(() => {
  return autos.value.filter(auto => {
    const matchesSearch = !searchQuery.value ||
      `${auto.marca} ${auto.modelo}`.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (auto.patente && auto.patente.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    const matchesStatus = !filterStatus.value || auto.estado === filterStatus.value
    const matchesBrand = !filterBrand.value || auto.marca.toLowerCase().includes(filterBrand.value.toLowerCase())
    
    return matchesSearch && matchesStatus && matchesBrand
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  filterBrand.value = ''
}

const formatStatus = (estado) => {
  const status = {
    pendiente: 'Pendiente',
    en_revision: 'En Revisión',
    aprobado: 'Aprobado',
    en_remate: 'En Remate',
    vendido: 'Vendido',
    rechazado: 'Rechazado',
    disponible: 'Disponible',
    cancelado: 'Cancelado'
  }
  return status[estado] || estado
}

const getStatusBadgeClass = (estado) => {
  const classes = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    en_revision: 'bg-blue-100 text-blue-800',
    aprobado: 'bg-green-100 text-green-800',
    en_remate: 'bg-purple-100 text-purple-800',
    vendido: 'bg-gray-100 text-gray-800',
    rechazado: 'bg-red-100 text-red-800',
    disponible: 'bg-green-100 text-green-800',
    cancelado: 'bg-gray-100 text-gray-800'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800'
}

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('es-CL').format(Math.round(price))
}

const formatNumber = (num) => {
  if (!num) return '0'
  return new Intl.NumberFormat('es-CL').format(num)
}

const marcasUnicas = computed(() => {
  const marcas = [...new Set(autos.value.map(a => a.marca).filter(Boolean))]
  return marcas.sort()
})

const loadAutos = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE}/autos`, {
      headers: getAuthHeaders()
    })
    autos.value = response || []
    
    // Calcular estadísticas
    stats.value = {
      totalAutos: autos.value.length,
      enRemate: autos.value.filter(a => a.estado === 'en_remate').length,
      vendidos: autos.value.filter(a => a.estado === 'vendido').length,
      pendientes: autos.value.filter(a => a.estado === 'pendiente').length
    }
  } catch (err) {
    console.error('Error cargando autos:', err)
    error.value = err.data?.message || 'Error al cargar los autos'
  } finally {
    loading.value = false
  }
}

const viewAuto = (auto) => {
  console.log('Ver auto:', auto)
  // TODO: Navegar a página de detalles
}

const editAuto = (auto) => {
  console.log('Editar auto:', auto)
  // TODO: Navegar a página de edición
}

onMounted(() => {
  loadAutos()
})
</script>










