<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Pagos</h1>
      <p class="text-gray-600 mt-2">Gestiona todos los pagos del sistema</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 mb-6">
      <p class="text-gray-500">Cargando pagos...</p>
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
            <p class="text-sm text-gray-600">Completados</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">${{ formatPrice(stats.completados) }}</p>
          </div>
          <CheckCircle :size="32" class="text-blue-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Transacciones</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.transacciones }}</p>
          </div>
          <CreditCard :size="32" class="text-purple-500" />
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
            placeholder="Usuario, referencia..."
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
            <option value="completado">Completado</option>
            <option value="fallido">Fallido</option>
            <option value="reembolsado">Reembolsado</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select
            v-model="filterType"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Todos</option>
            <option value="comision">Comisión</option>
            <option value="puja">Puja</option>
            <option value="compra">Compra</option>
            <option value="inspeccion">Inspección</option>
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

    <!-- Tabla de Pagos -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
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
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="pago in filteredPagos" :key="pago.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(pago.fecha) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ pago.usuario }}</div>
                <div class="text-sm text-gray-500">{{ pago.usuarioEmail }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-semibold rounded-full',
                    getTypeBadgeClass(pago.tipo)
                  ]"
                >
                  {{ formatType(pago.tipo) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ pago.descripcion }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-bold" :class="pago.monto > 0 ? 'text-green-600' : 'text-red-600'">
                  {{ pago.monto > 0 ? '+' : '' }}${{ formatPrice(Math.abs(pago.monto)) }}
                </div>
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
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="viewPago(pago)"
                    class="text-orange-600 hover:text-orange-900"
                    title="Ver Detalles"
                  >
                    <Eye :size="18" />
                  </button>
                  <button
                    v-if="pago.estado === 'pendiente'"
                    @click="processPago(pago)"
                    class="text-green-600 hover:text-green-900"
                    title="Procesar"
                  >
                    <CheckCircle :size="18" />
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
              Mostrando <span class="font-medium">1</span> a <span class="font-medium">25</span> de
              <span class="font-medium">{{ filteredPagos.length }}</span> resultados
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { DollarSign, Clock, CheckCircle, CreditCard, Eye } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['superadmin']
})

const { getAuthHeaders } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const searchQuery = ref('')
const filterStatus = ref('')
const filterType = ref('')
const pagos = ref([])
const loading = ref(false)
const error = ref(null)
const stats = ref({
  totalMes: 0,
  pendientes: 0,
  completados: 0,
  transacciones: 0
})

const filteredPagos = computed(() => {
  return pagos.value.filter(pago => {
    const matchesSearch = !searchQuery.value ||
      pago.usuario?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      pago.referencia?.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = !filterStatus.value || pago.estado === filterStatus.value
    const matchesType = !filterType.value || pago.tipo === filterType.value
    
    return matchesSearch && matchesStatus && matchesType
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  filterType.value = ''
}

const formatType = (tipo) => {
  const types = {
    comision: 'Comisión',
    puja: 'Puja',
    compra: 'Compra',
    inspeccion: 'Inspección'
  }
  return types[tipo] || tipo
}

const getTypeBadgeClass = (tipo) => {
  const classes = {
    comision: 'bg-blue-100 text-blue-800',
    puja: 'bg-purple-100 text-purple-800',
    compra: 'bg-green-100 text-green-800',
    inspeccion: 'bg-orange-100 text-orange-800'
  }
  return classes[tipo] || 'bg-gray-100 text-gray-800'
}

const formatStatus = (estado) => {
  const status = {
    pendiente: 'Pendiente',
    completado: 'Completado',
    fallido: 'Fallido',
    reembolsado: 'Reembolsado'
  }
  return status[estado] || estado
}

const getStatusBadgeClass = (estado) => {
  const classes = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    completado: 'bg-green-100 text-green-800',
    fallido: 'bg-red-100 text-red-800',
    reembolsado: 'bg-gray-100 text-gray-800'
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

const loadPagos = async () => {
  loading.value = true
  error.value = null
  try {
    // Obtener todos los autos vendidos
    const autosVendidos = await $fetch(`${API_BASE}/autos?estado=vendido`, {
      headers: getAuthHeaders()
    })
    
    // Generar pagos basados en autos vendidos
    // La comisión es el 5% del precio de venta (precioActual)
    const pagosGenerados = (autosVendidos || []).map((auto) => {
      const precioVenta = parseFloat(auto.precioActual || auto.precioBase || 0)
      const comision = precioVenta * 0.05 // 5% de comisión
      const fechaVenta = new Date(auto.updatedAt || auto.createdAt)
      const ahora = new Date()
      const diasDesdeVenta = Math.floor((ahora - fechaVenta) / (1000 * 60 * 60 * 24))
      
      return {
        id: auto.id,
        fecha: fechaVenta,
        usuario: auto.creador?.nombre || 'N/A',
        usuarioEmail: auto.creador?.email || 'N/A',
        tipo: 'comision',
        descripcion: `Comisión por venta de ${auto.marca} ${auto.modelo} ${auto.anio}`,
        monto: comision,
        estado: diasDesdeVenta >= 7 ? 'completado' : 'pendiente', // Pagado después de 7 días
        referencia: `COM-${auto.id}-${new Date(fechaVenta).getFullYear()}`
      }
    })
    
    pagos.value = pagosGenerados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    
    // Calcular estadísticas
    const ahora = new Date()
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
    
    const pagosMes = pagos.value.filter(p => new Date(p.fecha) >= inicioMes)
    
    stats.value = {
      totalMes: pagosMes.reduce((sum, p) => sum + p.monto, 0),
      pendientes: pagos.value.filter(p => p.estado === 'pendiente').reduce((sum, p) => sum + p.monto, 0),
      completados: pagos.value.filter(p => p.estado === 'completado').reduce((sum, p) => sum + p.monto, 0),
      transacciones: pagos.value.length
    }
  } catch (err) {
    console.error('Error cargando pagos:', err)
    error.value = err.data?.message || 'Error al cargar los pagos'
  } finally {
    loading.value = false
  }
}

const viewPago = (pago) => {
  console.log('Ver pago:', pago)
  // TODO: Navegar a página de detalles
}

const processPago = (pago) => {
  console.log('Procesar pago:', pago)
  // TODO: Implementar lógica de procesamiento
}

const refundPago = (pago) => {
  console.log('Reembolsar pago:', pago)
  // TODO: Implementar lógica de reembolso
}

onMounted(() => {
  loadPagos()
})
</script>










