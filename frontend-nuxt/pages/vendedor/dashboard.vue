<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Mi Dashboard</h1>
      <p class="text-gray-600 mt-2">Bienvenido, {{ user?.nombre }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-20">
      <p class="text-gray-500">Cargando estadísticas...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
      {{ error }}
    </div>

    <!-- Stats Cards -->
    <div v-else-if="stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Mis Autos</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.totalAutos }}</p>
          </div>
          <Car :size="32" class="text-orange-500" />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">En Remate</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.enRemate }}</p>
          </div>
          <Gavel :size="32" class="text-purple-500" />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Vendidos</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.vendidos }}</p>
          </div>
          <CheckCircle :size="32" class="text-green-500" />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Ganado Total</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">${{ formatPrice(stats.ingresosTotales) }}</p>
          </div>
          <DollarSign :size="32" class="text-green-500" />
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-if="stats && !loading" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900">Mis Autos</h2>
          <NuxtLink
            to="/vendedor/nuevo"
            class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
          >
            + Nuevo Auto
          </NuxtLink>
        </div>
        <div v-if="stats.autosRecientes && stats.autosRecientes.length > 0" class="space-y-3">
          <div 
            v-for="auto in stats.autosRecientes" 
            :key="auto.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded"
          >
            <div>
              <p class="font-medium text-gray-900">{{ auto.marca }} {{ auto.modelo }} {{ auto.anio }}</p>
              <p class="text-sm text-gray-500">{{ formatStatus(auto.estado) }}</p>
            </div>
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                getStatusBadgeClass(auto.estado)
              ]"
            >
              {{ formatStatus(auto.estado) }}
            </span>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          <p>No tienes autos registrados</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Remates Activos</h2>
        <div v-if="stats.rematesActivos && stats.rematesActivos.length > 0" class="space-y-3">
          <div 
            v-for="remate in stats.rematesActivos" 
            :key="remate.id"
            class="p-4 bg-gradient-to-r from-orange-50 to-purple-50 rounded-lg"
          >
            <p class="font-medium text-gray-900 mb-1">{{ remate.marca }} {{ remate.modelo }} {{ remate.anio }}</p>
            <p class="text-sm text-gray-600 mb-2">Precio actual: ${{ formatPrice(remate.precioActual) }}</p>
            <div class="flex items-center space-x-2 text-xs text-gray-500">
              <Clock :size="14" />
              <span v-if="remate.fechaFinRemate">
                Termina {{ getTimeRemaining(remate.fechaFinRemate) }}
              </span>
              <span v-else>Sin fecha de finalización</span>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          <p>No tienes remates activos</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Car, Gavel, CheckCircle, DollarSign, Clock } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

const { user, getAuthHeaders } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const loading = ref(true)
const error = ref(null)
const stats = ref(null)

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('es-CL').format(Math.round(price))
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

const getTimeRemaining = (fechaFin) => {
  if (!fechaFin) return 'N/A'
  const ahora = new Date()
  const fin = new Date(fechaFin)
  const diff = fin - ahora
  
  if (diff <= 0) return 'Finalizado'
  
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24))
  const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (dias > 0) return `en ${dias} día${dias > 1 ? 's' : ''}`
  if (horas > 0) return `en ${horas} hora${horas > 1 ? 's' : ''}`
  return 'pronto'
}

const loadStats = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE}/stats/vendedor`, {
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

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['vendedor']
})

onMounted(() => {
  loadStats()
})
</script>
