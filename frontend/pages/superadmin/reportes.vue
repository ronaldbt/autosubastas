<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Reportes</h1>
        <p class="text-gray-600 mt-2">Análisis y estadísticas del sistema</p>
      </div>
      <button class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2">
        <Download :size="20" />
        <span>Exportar Reporte</span>
      </button>
    </div>

    <!-- Filtros de Fecha -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
          <input
            type="date"
            v-model="dateStart"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
          <input
            type="date"
            v-model="dateEnd"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Reporte</label>
          <select
            v-model="reportType"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="ventas">Ventas</option>
            <option value="usuarios">Usuarios</option>
            <option value="remates">Remates</option>
            <option value="pagos">Pagos</option>
            <option value="general">General</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="generateReport"
            class="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Generar
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 mb-6">
      <p class="text-gray-500">Cargando reportes...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
      {{ error }}
    </div>

    <!-- Métricas Principales -->
    <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Ingresos Totales</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">${{ formatPrice(stats.ingresosTotales) }}</p>
          </div>
          <DollarSign :size="32" class="text-green-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Autos Vendidos</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.autosVendidos }}</p>
          </div>
          <Car :size="32" class="text-blue-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Usuarios Activos</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.usuariosActivos }}</p>
          </div>
          <Users :size="32" class="text-purple-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Tasa de Conversión</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ Math.round(stats.tasaConversion) }}%</p>
          </div>
          <TrendingUp :size="32" class="text-orange-500" />
        </div>
      </div>
    </div>

    <!-- Gráficos -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Ventas por Mes</h2>
        <div class="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded">
          <p class="text-gray-500">Gráfico de ventas (integrar Chart.js o similar)</p>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Distribución por Rol</h2>
        <div class="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded">
          <p class="text-gray-500">Gráfico de distribución (integrar Chart.js o similar)</p>
        </div>
      </div>
    </div>

    <!-- Tabla de Top Vendedores -->
    <div class="bg-white rounded-lg shadow overflow-hidden mb-6">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-bold text-gray-900">Top Vendedores</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendedor
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Autos Vendidos
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ingresos Generados
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comisiones
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Calificación
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="stats.topVendedores.length === 0" class="hover:bg-gray-50">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                No hay datos de vendedores disponibles
              </td>
            </tr>
            <tr v-for="vendedor in stats.topVendedores" :key="vendedor.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span class="text-orange-600 font-semibold text-sm">
                      {{ vendedor.nombre.charAt(0) }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ vendedor.nombre }}</div>
                    <div class="text-sm text-gray-500">{{ vendedor.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 font-medium">{{ vendedor.autosVendidos }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-bold text-green-600">${{ formatPrice(vendedor.ingresos) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-500">N/A</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-sm font-medium text-gray-900 mr-2">{{ vendedor.calificacion }}/5</span>
                  <div class="flex">
                    <Star
                      v-for="i in 5"
                      :key="i"
                      :size="16"
                      :class="i <= vendedor.calificacion ? 'text-yellow-400 fill-current' : 'text-gray-300'"
                    />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Resumen de Actividad -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Resumen de Actividad</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-2">Remates Activos</h3>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Este mes</span>
              <span class="font-medium text-gray-900">89</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Mes anterior</span>
              <span class="font-medium text-gray-900">76</span>
            </div>
          </div>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-2">Nuevos Usuarios</h3>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Este mes</span>
              <span class="font-medium text-gray-900">156</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Mes anterior</span>
              <span class="font-medium text-gray-900">142</span>
            </div>
          </div>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-2">Pagos Procesados</h3>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Este mes</span>
              <span class="font-medium text-gray-900">456</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Mes anterior</span>
              <span class="font-medium text-gray-900">389</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Download, DollarSign, Car, Users, TrendingUp, Star } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['superadmin']
})

const { getAuthHeaders } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const dateStart = ref('')
const dateEnd = ref('')
const reportType = ref('general')
const loading = ref(false)
const error = ref(null)
const stats = ref({
  ingresosTotales: 0,
  autosVendidos: 0,
  usuariosActivos: 0,
  tasaConversion: 0,
  topVendedores: []
})

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('es-CL').format(Math.round(price))
}

const loadReportes = async () => {
  loading.value = true
  error.value = null
  try {
    // Cargar estadísticas del dashboard
    const dashboardStats = await $fetch(`${API_BASE}/stats/dashboard`, {
      headers: getAuthHeaders()
    })
    
    // Cargar estadísticas de vendedores
    const vendedoresStats = await $fetch(`${API_BASE}/usuarios/vendedores/estadisticas`, {
      headers: getAuthHeaders()
    })
    
    // Calcular métricas
    const ingresosTotales = dashboardStats.financiero?.ingresosMes || 0
    const autosVendidos = dashboardStats.autos?.vendidos || 0
    const usuariosActivos = (dashboardStats.usuarios?.vendedoresActivos || 0) + (dashboardStats.usuarios?.dealersActivos || 0)
    
    // Calcular tasa de conversión (autos vendidos / autos en remate)
    const autosEnRemate = dashboardStats.autos?.enRemate || 0
    const tasaConversion = autosEnRemate > 0 ? (autosVendidos / (autosEnRemate + autosVendidos)) * 100 : 0
    
    // Top vendedores
    const topVendedores = (vendedoresStats.vendedores || [])
      .sort((a, b) => (b.ventas || 0) - (a.ventas || 0))
      .slice(0, 5)
      .map(v => ({
        id: v.id,
        nombre: v.nombre,
        email: v.email,
        autosVendidos: v.ventas || 0,
        ingresos: v.ingresosTotales || 0,
        comisiones: 0, // El vendedor no paga comisión
        calificacion: 4.5 // Placeholder
      }))
    
    stats.value = {
      ingresosTotales,
      autosVendidos,
      usuariosActivos,
      tasaConversion,
      topVendedores
    }
  } catch (err) {
    console.error('Error cargando reportes:', err)
    error.value = err.data?.message || 'Error al cargar los reportes'
  } finally {
    loading.value = false
  }
}

const generateReport = () => {
  console.log('Generar reporte:', { dateStart: dateStart.value, dateEnd: dateEnd.value, reportType: reportType.value })
  // TODO: Implementar generación de reporte PDF/Excel
}

onMounted(() => {
  loadReportes()
})
</script>










