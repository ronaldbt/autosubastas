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
            <option value="remates">Remates</option>
            <option value="vendedores">Vendedores</option>
            <option value="dealers">Dealers</option>
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

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="text-gray-500">Cargando reportes...</div>
    </div>

    <!-- Error State -->
    <div v-if="error && !loading" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <!-- Métricas Principales -->
    <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Ventas Totales</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ metricas.ventasTotales.valor }}</p>
            <p 
              :class="[
                'text-xs mt-1',
                metricas.ventasTotales.esPositiva ? 'text-green-600' : 'text-red-600'
              ]"
            >
              {{ metricas.ventasTotales.esPositiva ? '+' : '' }}{{ metricas.ventasTotales.variacion }}% vs mes anterior
            </p>
          </div>
          <DollarSign :size="32" class="text-green-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Autos Vendidos</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ metricas.autosVendidos.valor }}</p>
            <p 
              :class="[
                'text-xs mt-1',
                metricas.autosVendidos.esPositiva ? 'text-green-600' : 'text-red-600'
              ]"
            >
              {{ metricas.autosVendidos.esPositiva ? '+' : '' }}{{ metricas.autosVendidos.variacion }}% vs mes anterior
            </p>
          </div>
          <Car :size="32" class="text-blue-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Remates Activos</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ metricas.rematesActivos.valor }}</p>
            <p 
              :class="[
                'text-xs mt-1',
                metricas.rematesActivos.esPositiva ? 'text-green-600' : 'text-red-600'
              ]"
            >
              {{ metricas.rematesActivos.esPositiva ? '+' : '' }}{{ metricas.rematesActivos.variacion }}% vs mes anterior
            </p>
          </div>
          <Gavel :size="32" class="text-orange-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Tasa de Conversión</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ metricas.tasaConversion.valor }}%</p>
            <p 
              :class="[
                'text-xs mt-1',
                metricas.tasaConversion.esPositiva ? 'text-green-600' : 'text-red-600'
              ]"
            >
              {{ metricas.tasaConversion.esPositiva ? '+' : '' }}{{ metricas.tasaConversion.variacion }}% vs mes anterior
            </p>
          </div>
          <TrendingUp :size="32" class="text-purple-500" />
        </div>
      </div>
    </div>

    <!-- Gráficos -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Ventas por Semana</h2>
        <div class="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded">
          <p class="text-gray-500">Gráfico de ventas (integrar Chart.js o similar)</p>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Top Vendedores</h2>
        <div class="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded">
          <p class="text-gray-500">Gráfico de vendedores (integrar Chart.js o similar)</p>
        </div>
      </div>
    </div>

    <!-- Tabla de Resumen -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-bold text-gray-900">Resumen de Actividad</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Este Mes
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mes Anterior
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Variación
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in summaryData" :key="item.categoria" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ item.categoria }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ item.esteMes }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ item.mesAnterior }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'text-sm font-medium',
                    item.variacion >= 0 ? 'text-green-600' : 'text-red-600'
                  ]"
                >
                  {{ item.variacion >= 0 ? '+' : '' }}{{ item.variacion }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Download, DollarSign, Car, Gavel, TrendingUp } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['admin']
})

const { getAuthHeaders } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const dateStart = ref('')
const dateEnd = ref('')
const reportType = ref('general')
const loading = ref(false)
const error = ref(null)

const metricas = ref({
  ventasTotales: { valor: '$0', variacion: '0', esPositiva: true },
  autosVendidos: { valor: 0, variacion: '0', esPositiva: true },
  rematesActivos: { valor: 0, variacion: '0', esPositiva: true },
  tasaConversion: { valor: '0', variacion: '0', esPositiva: true }
})

const summaryData = ref([
  {
    categoria: 'Autos Aprobados',
    esteMes: 0,
    mesAnterior: 0,
    variacion: 0
  },
  {
    categoria: 'Remates Iniciados',
    esteMes: 0,
    mesAnterior: 0,
    variacion: 0
  },
  {
    categoria: 'Inspecciones',
    esteMes: 0,
    mesAnterior: 0,
    variacion: 0
  },
  {
    categoria: 'Ventas Completadas',
    esteMes: 0,
    mesAnterior: 0,
    variacion: 0
  }
])

const loadReportes = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE}/stats/reportes`, {
      headers: getAuthHeaders()
    })
    
    metricas.value = response.metricas
    summaryData.value = response.resumen
  } catch (err) {
    console.error('Error cargando reportes:', err)
    error.value = err.data?.message || 'Error al cargar los reportes'
  } finally {
    loading.value = false
  }
}

const generateReport = () => {
  console.log('Generar reporte:', { dateStart: dateStart.value, dateEnd: dateEnd.value, reportType: reportType.value })
  // Aquí se puede implementar la lógica para generar reportes con filtros
  loadReportes()
}

onMounted(() => {
  loadReportes()
})
</script>










