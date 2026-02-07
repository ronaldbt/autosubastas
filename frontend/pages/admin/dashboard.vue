<template>
  <div class="space-y-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
      <p class="text-gray-600 mt-2">Panel de control y gestión de remates y autos</p>
    </div>

    <ClientOnly>
      <template #fallback>
        <div class="text-center py-20">
          <p class="text-gray-500">Cargando estadísticas...</p>
        </div>
      </template>
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <p class="text-gray-500">Cargando estadísticas...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {{ error }}
      </div>

      <!-- Dashboard Content -->
      <div v-else-if="stats">
      <!-- Stats Cards - Primera Fila -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg p-6 border border-orange-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-orange-700 mb-1">Autos Pendientes</p>
              <p class="text-3xl font-bold text-orange-900">{{ stats.autos.pendientes }}</p>
              <p class="text-xs text-orange-600 mt-1">Requieren revisión</p>
            </div>
            <div class="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Car :size="32" class="text-white" />
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-6 border border-purple-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-purple-700 mb-1">Remates Activos</p>
              <p class="text-3xl font-bold text-purple-900">{{ stats.remates.activos }}</p>
              <p class="text-xs text-purple-600 mt-1">{{ stats.remates.pujasHoy }} pujas hoy</p>
            </div>
            <div class="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <Gavel :size="32" class="text-white" />
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 border border-green-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-green-700 mb-1">Ingresos del Mes</p>
              <p class="text-3xl font-bold text-green-900">${{ formatPrice(stats.financiero.ingresosMes) }}</p>
              <p class="text-xs text-green-600 mt-1">{{ stats.financiero.autosVendidosMes }} autos vendidos</p>
            </div>
            <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <DollarSign :size="32" class="text-white" />
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border border-blue-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-blue-700 mb-1">Peritajes Pendientes</p>
              <p class="text-3xl font-bold text-blue-900">{{ stats.peritajes.pendientes }}</p>
              <p class="text-xs text-blue-600 mt-1">{{ stats.peritajes.mes }} este mes</p>
            </div>
            <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <FileCheck :size="32" class="text-white" />
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards - Segunda Fila -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Autos Aprobados</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.autos.aprobados }}</p>
            </div>
            <CheckCircle :size="28" class="text-green-500" />
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Autos Vendidos</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.autos.vendidos }}</p>
            </div>
            <Trophy :size="28" class="text-yellow-500" />
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Vendedores</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.usuarios.totalVendedores }}</p>
            </div>
            <UserCheck :size="28" class="text-blue-500" />
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Dealers</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.usuarios.totalDealers }}</p>
            </div>
            <Users :size="28" class="text-indigo-500" />
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Remates Próximos -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock :size="20" class="text-orange-500" />
              Remates Próximos (24h)
            </h2>
            <NuxtLink to="/admin/remates" class="text-sm text-orange-600 hover:text-orange-700 font-medium">
              Ver todos →
            </NuxtLink>
          </div>
          <div class="space-y-3">
            <div
              v-for="remate in stats.remates.proximos"
              :key="remate.id"
              class="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200 hover:shadow-md transition-shadow"
            >
              <div class="flex-1">
                <p class="font-semibold text-gray-900">{{ remate.marca }} {{ remate.modelo }} {{ remate.anio }}</p>
                <p class="text-sm text-gray-600 mt-1">
                  <span class="font-medium">Inicia:</span> {{ formatDateTime(remate.fechaInicio) }}
                </p>
                <p class="text-sm text-gray-600">
                  <span class="font-medium">Precio base:</span> ${{ formatPrice(remate.precioBase) }}
                </p>
              </div>
              <div class="ml-4">
                <span class="px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-medium">
                  Próximo
                </span>
              </div>
            </div>
            <div v-if="stats.remates.proximos.length === 0" class="text-center py-8 text-gray-500">
              No hay remates programados para las próximas 24 horas
            </div>
          </div>
        </div>

        <!-- Acciones Rápidas -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap :size="20" class="text-yellow-500" />
            Acciones Rápidas
          </h2>
          <div class="space-y-3">
            <NuxtLink
              to="/admin/autos"
              class="block w-full text-left px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg transition-all border border-blue-200"
            >
              <p class="font-semibold text-gray-900">Gestionar Autos</p>
              <p class="text-sm text-gray-600 mt-1">{{ stats.autos.pendientes }} pendientes de revisión</p>
            </NuxtLink>
            <NuxtLink
              to="/admin/remates"
              class="block w-full text-left px-4 py-3 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg transition-all border border-purple-200"
            >
              <p class="font-semibold text-gray-900">Gestionar Remates</p>
              <p class="text-sm text-gray-600 mt-1">{{ stats.remates.activos }} remates activos</p>
            </NuxtLink>
            <NuxtLink
              to="/admin/autos-peritaje"
              class="block w-full text-left px-4 py-3 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg transition-all border border-green-200"
            >
              <p class="font-semibold text-gray-900">Realizar Peritajes</p>
              <p class="text-sm text-gray-600 mt-1">{{ stats.peritajes.pendientes }} pendientes</p>
            </NuxtLink>
            <NuxtLink
              to="/admin/dealers"
              class="block w-full text-left px-4 py-3 bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 rounded-lg transition-all border border-indigo-200"
            >
              <p class="font-semibold text-gray-900">Gestionar Dealers</p>
              <p class="text-sm text-gray-600 mt-1">{{ stats.usuarios.totalDealers }} registrados</p>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Estadísticas Adicionales -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Remates Finalizados Recientes -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp :size="20" class="text-green-500" />
            Ventas Recientes (Semana)
          </h2>
          <div class="space-y-3">
            <div
              v-for="venta in stats.remates.finalizados"
              :key="venta.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ venta.marca }} {{ venta.modelo }} {{ venta.anio }}</p>
                <p class="text-sm text-gray-600 mt-1">
                  Vendido: {{ formatDateTime(venta.fechaVenta) }}
                </p>
              </div>
              <div class="text-right ml-4">
                <p class="font-bold text-green-600">${{ formatPrice(venta.precioVenta) }}</p>
              </div>
            </div>
            <div v-if="stats.remates.finalizados.length === 0" class="text-center py-8 text-gray-500">
              No hay ventas esta semana
            </div>
          </div>
        </div>

        <!-- Top Marcas -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 :size="20" class="text-blue-500" />
            Top Marcas del Mes
          </h2>
          <div class="space-y-3">
            <div
              v-for="(marca, index) in stats.topMarcas"
              :key="marca.marca"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {{ index + 1 }}
                </div>
                <div>
                  <p class="font-semibold text-gray-900">{{ marca.marca || 'Sin marca' }}</p>
                  <p class="text-xs text-gray-600">{{ marca.cantidad }} autos vendidos</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-blue-600">${{ formatPrice(marca.total) }}</p>
              </div>
            </div>
            <div v-if="stats.topMarcas.length === 0" class="text-center py-8 text-gray-500">
              No hay datos de ventas este mes
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas de Pujas -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Resumen de Pujas -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity :size="20" class="text-purple-500" />
            Actividad de Pujas
          </h2>
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p class="text-2xl font-bold text-purple-900">{{ stats.remates.totalPujas }}</p>
              <p class="text-xs text-purple-600 mt-1">Total Pujas</p>
            </div>
            <div class="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p class="text-2xl font-bold text-blue-900">{{ stats.remates.pujasHoy }}</p>
              <p class="text-xs text-blue-600 mt-1">Hoy</p>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <p class="text-2xl font-bold text-green-900">{{ stats.remates.pujasSemana }}</p>
              <p class="text-xs text-green-600 mt-1">Esta Semana</p>
            </div>
          </div>
        </div>

        <!-- Resumen de Estados -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart :size="20" class="text-orange-500" />
            Autos por Estado
          </h2>
          <div class="space-y-2">
            <div
              v-for="estado in stats.autosPorEstado"
              :key="estado.estado"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full" :class="getEstadoColor(estado.estado)"></div>
                <span class="font-medium text-gray-900 capitalize">{{ estado.estado.replace('_', ' ') }}</span>
              </div>
              <span class="font-bold text-gray-900">{{ estado.cantidad }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  Car, Gavel, UserCheck, Users, DollarSign, FileCheck, 
  CheckCircle, Trophy, Clock, Zap, TrendingUp, BarChart3, 
  Activity, PieChart
} from 'lucide-vue-next'
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
const stats = ref(null)

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('es-CL').format(Math.round(price))
}

const formatDateTime = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getEstadoColor = (estado) => {
  const colors = {
    'pendiente': 'bg-orange-500',
    'aprobado': 'bg-blue-500',
    'en_remate': 'bg-purple-500',
    'vendido': 'bg-green-500',
    'rechazado': 'bg-red-500',
    'en_revision': 'bg-yellow-500'
  }
  return colors[estado] || 'bg-gray-500'
}

const loadStats = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await $fetch(`${API_BASE}/stats/dashboard`, {
      headers: getAuthHeaders()
    })
    stats.value = response
  } catch (err) {
    console.error('Error cargando estadísticas:', err)
    error.value = err.data?.message || 'Error al cargar las estadísticas'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStats()
  // Actualizar cada 30 segundos
  setInterval(loadStats, 30000)
})
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
