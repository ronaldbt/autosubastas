<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Mi Dashboard</h1>
      <p class="text-gray-600 mt-2">Bienvenido, {{ user?.nombre }}</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Peritajes</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.total }}</p>
          </div>
          <ClipboardCheck :size="32" class="text-orange-500" />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Pendientes</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.pendientes }}</p>
          </div>
          <Clock :size="32" class="text-yellow-500" />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">En Proceso</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.enProceso }}</p>
          </div>
          <Settings :size="32" class="text-blue-500" />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Finalizados</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.finalizados }}</p>
          </div>
          <CheckCircle :size="32" class="text-green-500" />
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900">Peritajes Recientes</h2>
          <NuxtLink
            to="/perito/peritajes"
            class="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Ver todos →
          </NuxtLink>
        </div>
        <div v-if="loading" class="text-center py-8">
          <p class="text-gray-500">Cargando...</p>
        </div>
        <div v-else-if="recientes.length === 0" class="text-center py-8">
          <p class="text-gray-500">No hay peritajes recientes</p>
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="peritaje in recientes"
            :key="peritaje.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded"
          >
            <div>
              <p class="font-medium text-gray-900">{{ peritaje.patente }} - {{ peritaje.marca }} {{ peritaje.modelo }}</p>
              <p class="text-sm text-gray-500">{{ formatDate(peritaje.fecha) }}</p>
            </div>
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                getEstadoClass(peritaje.estado)
              ]"
            >
              {{ peritaje.estado }}
            </span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900">Acciones Rápidas</h2>
        </div>
        <div class="space-y-3">
          <button
            @click="handleNuevoPeritaje"
            class="block w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-center font-medium"
          >
            + Crear Nuevo Peritaje
          </button>
          <button
            @click="navigateTo('/perito/peritajes')"
            class="block w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium"
          >
            Ver Todos los Peritajes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ClipboardCheck, Clock, Settings, CheckCircle } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

const { user, getAuthHeaders } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const loading = ref(false)
const peritajes = ref([])

const stats = computed(() => {
  return {
    total: peritajes.value.length,
    pendientes: peritajes.value.filter(p => p.estado === 'PENDIENTE').length,
    enProceso: peritajes.value.filter(p => p.estado === 'EN_PROCESO').length,
    finalizados: peritajes.value.filter(p => p.estado === 'FINALIZADO').length
  }
})

const recientes = computed(() => {
  return peritajes.value.slice(0, 5)
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getEstadoClass = (estado) => {
  const classes = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800',
    EN_PROCESO: 'bg-blue-100 text-blue-800',
    FINALIZADO: 'bg-green-100 text-green-800'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800'
}

const loadPeritajes = async () => {
  loading.value = true
  try {
    const response = await $fetch(`${API_BASE}/peritajes`, {
      headers: getAuthHeaders()
    })
    peritajes.value = response
  } catch (error) {
    console.error('Error cargando peritajes:', error)
  } finally {
    loading.value = false
  }
}

const handleNuevoPeritaje = () => {
  navigateTo('/perito/peritajes/nuevo')
}

onMounted(() => {
  loadPeritajes()
})

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['perito']
})
</script>

