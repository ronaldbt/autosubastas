<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard Super Admin</h1>
      <p class="text-gray-600 mt-2">Panel de control principal</p>
    </div>

    <ClientOnly>
      <template #fallback>
        <div class="text-center py-12"><p class="text-gray-500">Cargando estadísticas...</p></div>
      </template>
      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500">Cargando estadísticas...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
        {{ error }}
      </div>

      <!-- Stats Cards -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Usuarios</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.usuarios?.totalVendedores + stats.usuarios?.totalDealers || 0 }}</p>
          </div>
          <Users :size="32" class="text-blue-500" />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Autos Activos</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.autos?.enRemate || 0 }}</p>
          </div>
          <Car :size="32" class="text-orange-500" />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Remates Activos</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.remates?.activos || 0 }}</p>
          </div>
          <Gavel :size="32" class="text-purple-500" />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Ingresos del Mes</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">${{ formatPrice(stats.financiero?.ingresosMes || 0) }}</p>
          </div>
          <DollarSign :size="32" class="text-green-500" />
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-if="!loading && !error" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Resumen de Autos</h2>
        <div class="space-y-3">
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span class="text-sm text-gray-600">Pendientes</span>
            <span class="text-lg font-bold text-gray-900">{{ stats.autos?.pendientes || 0 }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span class="text-sm text-gray-600">Aprobados</span>
            <span class="text-lg font-bold text-gray-900">{{ stats.autos?.aprobados || 0 }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span class="text-sm text-gray-600">Vendidos</span>
            <span class="text-lg font-bold text-gray-900">{{ stats.autos?.vendidos || 0 }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span class="text-sm text-gray-600">Total</span>
            <span class="text-lg font-bold text-gray-900">{{ stats.autos?.total || 0 }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div class="space-y-3">
          <NuxtLink
            to="/superadmin/usuarios"
            class="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <p class="font-medium text-gray-900">Gestionar Usuarios</p>
            <p class="text-sm text-gray-500">Ver y administrar todos los usuarios</p>
          </NuxtLink>
          <NuxtLink
            to="/superadmin/configuracion"
            class="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <p class="font-medium text-gray-900">Configuración del Sistema</p>
            <p class="text-sm text-gray-500">Ajustes generales de la plataforma</p>
          </NuxtLink>
          <NuxtLink
            to="/superadmin/autos"
            class="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <p class="font-medium text-gray-900">Gestionar Autos</p>
            <p class="text-sm text-gray-500">Ver y administrar todos los autos</p>
          </NuxtLink>
        </div>
      </div>
    </div>
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Users, Car, Gavel, DollarSign } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['superadmin']
})

const { getAuthHeaders } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const loading = ref(true)
const error = ref(null)
const stats = ref({})

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('es-CL').format(Math.round(price))
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
})
</script>











