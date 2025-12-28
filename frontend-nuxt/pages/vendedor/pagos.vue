<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Mis Pagos</h1>
      <p class="text-gray-600 mt-2">Revisa los pagos por tus ventas</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Cargando pagos...</p>
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
            <p class="text-sm text-gray-600">Total del Mes</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">${{ formatPrice(stats.totalMes) }}</p>
          </div>
          <DollarSign :size="32" class="text-green-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Pendientes</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">${{ formatPrice(stats.pendientes) }}</p>
          </div>
          <Clock :size="32" class="text-yellow-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Pagados</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">${{ formatPrice(stats.pagados) }}</p>
          </div>
          <CheckCircle :size="32" class="text-blue-500" />
        </div>
      </div>
    </div>

    <!-- Tabla de Pagos -->
    <div v-if="!loading && !error" class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="pagos.length === 0" class="text-center py-12">
        <DollarSign :size="48" class="text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 text-lg">No tienes pagos registrados</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Auto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referencia
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="pago in pagos" :key="pago.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(pago.fecha) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ pago.auto }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-bold text-green-600">${{ formatPrice(pago.monto) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-semibold rounded-full',
                    getStatusBadgeClass(pago.estado)
                  ]"
                >
                  {{ formatStatus(pago.estado) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500 font-mono">{{ pago.referencia }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { DollarSign, Clock, CheckCircle } from 'lucide-vue-next'
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
const pagos = ref([])

const stats = computed(() => {
  const ahora = new Date()
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
  
  const pagosMes = pagos.value.filter(p => {
    const fechaPago = new Date(p.fecha)
    return fechaPago >= inicioMes
  })
  
  const totalMes = pagosMes.reduce((sum, p) => sum + parseFloat(p.monto || 0), 0)
  const pendientes = pagos.value
    .filter(p => p.estado === 'pendiente')
    .reduce((sum, p) => sum + parseFloat(p.monto || 0), 0)
  const pagados = pagos.value
    .filter(p => p.estado === 'pagado')
    .reduce((sum, p) => sum + parseFloat(p.monto || 0), 0)
  
  return {
    totalMes,
    pendientes,
    pagados
  }
})

const formatStatus = (estado) => {
  const status = {
    pendiente: 'Pendiente',
    pagado: 'Pagado',
    cancelado: 'Cancelado'
  }
  return status[estado] || estado
}

const getStatusBadgeClass = (estado) => {
  const classes = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    pagado: 'bg-green-100 text-green-800',
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

const loadPagos = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE}/autos`, {
      headers: getAuthHeaders()
    })
    
    // Filtrar solo autos vendidos y crear registros de pago
    const autosVendidos = (response || []).filter(a => a.estado === 'vendido')
    
    pagos.value = autosVendidos.map((auto, index) => {
      const precioVenta = parseFloat(auto.precioActual || 0)
      // Por defecto, considerar pagados los vendidos hace más de 7 días, pendientes los recientes
      const fechaVenta = new Date(auto.updatedAt)
      const diasDesdeVenta = (new Date() - fechaVenta) / (1000 * 60 * 60 * 24)
      const estado = diasDesdeVenta > 7 ? 'pagado' : 'pendiente'
      
      return {
        id: auto.id,
        fecha: auto.updatedAt,
        auto: `${auto.marca || 'Sin marca'} ${auto.modelo || ''} ${auto.anio || ''}`.trim(),
        monto: precioVenta, // El vendedor recibe el precio completo
        estado: estado,
        referencia: `VEN-${auto.id}-${new Date(auto.updatedAt).getFullYear()}`
      }
    }).sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  } catch (err) {
    console.error('Error cargando pagos:', err)
    error.value = err.data?.message || 'Error al cargar los pagos'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPagos()
})
</script>
