<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Mis Autos</h1>
        <p class="text-gray-600 mt-2">Gestiona los autos que has publicado para remate</p>
      </div>
      <NuxtLink
        to="/vendedor/nuevo"
        class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
      >
        <PlusCircle :size="20" />
        <span>Subastar Auto</span>
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
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
          <Car :size="32" class="text-orange-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">En Remate</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.enRemate }}</p>
          </div>
          <Gavel :size="32" class="text-purple-500" />
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
            <p class="text-sm text-gray-600">Ingresos Estimados</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">${{ formatPrice(stats.ingresosTotales) }}</p>
          </div>
          <DollarSign :size="32" class="text-green-500" />
        </div>
      </div>
    </div>

    <!-- Lista de Autos -->
    <div v-if="!loading && !error" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="auto in autos"
        :key="auto.id"
        class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
      >
        <div class="h-40 bg-gray-200 flex items-center justify-center overflow-hidden">
          <img
            v-if="getFirstImage(auto)"
            :src="getImageUrl(getFirstImage(auto))"
            :alt="auto.marca + ' ' + auto.modelo"
            class="w-full h-full object-cover"
          />
          <Car v-else :size="40" class="text-gray-400" />
        </div>
        <div class="p-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-bold text-gray-900">
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
          <p class="text-sm text-gray-600">
            {{ auto.kilometraje ? `${formatNumber(auto.kilometraje)} km` : '' }} 
            {{ auto.transmision ? `• ${auto.transmision}` : '' }} 
            {{ auto.combustible ? `• ${auto.combustible}` : '' }}
          </p>
          <div class="mt-3 flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500">Precio Base</p>
              <p class="text-lg font-bold text-orange-600">${{ formatPrice(auto.precioBase) }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-500">Precio Actual</p>
              <p class="text-sm font-medium text-gray-900">${{ formatPrice(auto.precioActual || auto.precioBase) }}</p>
            </div>
          </div>
          
          <!-- Etapas del Remate -->
          <div class="mt-4">
            <EtapasRemate :auto="auto" :totalPujas="auto.totalPujas || 0" />
          </div>
          
          <div class="mt-4 flex items-center justify-between">
            <NuxtLink
              :to="`/vendedor/autos/${auto.id}`"
              class="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              Ver Detalles
            </NuxtLink>
          </div>
        </div>
      </div>
      
      <div v-if="autos.length === 0" class="col-span-full text-center py-12 bg-white rounded-lg shadow">
        <Car :size="48" class="text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 text-lg">No tienes autos registrados</p>
        <NuxtLink
          to="/vendedor/nuevo"
          class="mt-4 inline-block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Subastar tu primer auto
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Car, Gavel, CheckCircle, DollarSign, PlusCircle } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'
import { useImageUrl } from '~/composables/useImageUrl'
import EtapasRemate from '~/components/EtapasRemate.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['vendedor']
})

const { getAuthHeaders } = useAuth()
const { getImageUrl: getImageUrlHelper } = useImageUrl()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const loading = ref(true)
const error = ref(null)
const autos = ref([])
const stats = ref({
  totalAutos: 0,
  enRemate: 0,
  vendidos: 0,
  ingresosTotales: 0
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

const formatStatus = (estado) => {
  const status = {
    pendiente: 'Pendiente',
    en_revision: 'En Revisión',
    aprobado: 'Aprobado',
    en_remate: 'En Remate',
    vendido: 'Vendido',
    rechazado: 'Rechazado'
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
    rechazado: 'bg-red-100 text-red-800'
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

const loadAutos = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE}/autos`, {
      headers: getAuthHeaders()
    })
    autos.value = response || []
    
    // Obtener pujas para cada auto en remate
    for (const auto of autos.value) {
      if (auto.estado === 'en_remate') {
        try {
          const pujas = await $fetch(`${API_BASE}/remates?autoId=${auto.id}`, {
            headers: getAuthHeaders()
          })
          auto.totalPujas = pujas.length || 0
        } catch (err) {
          console.warn(`Error cargando pujas para auto ${auto.id}:`, err)
          auto.totalPujas = 0
        }
      } else {
        auto.totalPujas = 0
      }
    }
    
    // Calcular estadísticas
    stats.value = {
      totalAutos: autos.value.length,
      enRemate: autos.value.filter(a => a.estado === 'en_remate').length,
      vendidos: autos.value.filter(a => a.estado === 'vendido').length,
      ingresosTotales: autos.value
        .filter(a => a.estado === 'vendido')
        .reduce((sum, a) => {
          const precioVenta = parseFloat(a.precioActual || 0)
          return sum + precioVenta // El vendedor recibe el precio completo
        }, 0)
    }
  } catch (err) {
    console.error('Error cargando autos:', err)
    error.value = err.data?.message || 'Error al cargar los autos'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAutos()
})
</script>
