<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Historial</h1>
      <p class="text-gray-600 mt-2">Revisa el historial de tus ventas y remates</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Cargando historial...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
      {{ error }}
    </div>

    <!-- Stats -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Vendidos</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.totalVendidos }}</p>
          </div>
          <CheckCircle :size="32" class="text-green-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Ingresos Totales</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">${{ formatPrice(stats.ingresosTotales) }}</p>
          </div>
          <DollarSign :size="32" class="text-green-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Promedio Venta</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">${{ formatPrice(stats.promedioVenta) }}</p>
          </div>
          <TrendingUp :size="32" class="text-blue-500" />
        </div>
      </div>
    </div>

    <!-- Lista de Historial -->
    <div v-if="!loading && !error" class="space-y-4">
      <div
        v-for="item in historial"
        :key="item.id"
        class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <h3 class="text-lg font-bold text-gray-900">
                {{ item.marca }} {{ item.modelo }} {{ item.anio }}
              </h3>
              <span
                :class="[
                  'px-2 py-1 text-xs font-semibold rounded-full',
                  getStatusBadgeClass(item.estado)
                ]"
              >
                {{ formatStatus(item.estado) }}
              </span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
              <div>
                <p class="text-xs text-gray-500">Precio de Venta</p>
                <p class="text-sm font-bold text-green-600">${{ formatPrice(item.precioFinal) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Fecha Venta</p>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(item.fechaVenta) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Estado</p>
                <p class="text-sm font-medium text-gray-900">{{ formatStatus(item.estado) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="historial.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
        <CheckCircle :size="48" class="text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 text-lg">No tienes ventas registradas</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { CheckCircle, DollarSign, CreditCard, TrendingUp } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['vendedor']
})

const { getAuthHeaders } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const loading = ref(true)
const error = ref(null)
const historial = ref([])

const stats = computed(() => {
  const vendidos = historial.value.filter(h => h.estado === 'vendido')
  const ingresosTotales = vendidos.reduce((sum, h) => sum + parseFloat(h.precioFinal || 0), 0)
  const promedioVenta = vendidos.length > 0 ? ingresosTotales / vendidos.length : 0
  
  return {
    totalVendidos: vendidos.length,
    ingresosTotales,
    promedioVenta
  }
})

const formatStatus = (estado) => {
  const status = {
    vendido: 'Vendido',
    cancelado: 'Cancelado'
  }
  return status[estado] || estado
}

const getStatusBadgeClass = (estado) => {
  const classes = {
    vendido: 'bg-green-100 text-green-800',
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
    day: 'numeric'
  })
}

const loadHistorial = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE}/autos`, {
      headers: getAuthHeaders()
    })
    
    // Filtrar solo vendidos y finalizados
    const autosVendidos = (response || []).filter(a => a.estado === 'vendido')
    
    historial.value = autosVendidos.map(auto => {
      const precioVenta = parseFloat(auto.precioActual || 0)
      
      return {
        id: auto.id,
        marca: auto.marca || 'Sin marca',
        modelo: auto.modelo || 'Sin modelo',
        anio: auto.anio || 'N/A',
        precioFinal: precioVenta, // El vendedor recibe el precio completo
        fechaVenta: auto.updatedAt,
        estado: 'vendido'
      }
    }).sort((a, b) => new Date(b.fechaVenta) - new Date(a.fechaVenta))
  } catch (err) {
    console.error('Error cargando historial:', err)
    error.value = err.data?.message || 'Error al cargar el historial'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadHistorial()
})
</script>
