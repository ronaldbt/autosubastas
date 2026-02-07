<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Peritajes</h1>
      <p class="text-gray-600 mt-2">Revisa los peritajes de tus vehículos</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Cargando peritajes...</p>
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
            <p class="text-sm text-gray-600">Pendientes</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.pendientes }}</p>
          </div>
          <Clock :size="32" class="text-yellow-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">En Proceso</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.enProceso }}</p>
          </div>
          <Calendar :size="32" class="text-blue-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Completadas</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.completadas }}</p>
          </div>
          <CheckCircle :size="32" class="text-green-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.total }}</p>
          </div>
          <ClipboardCheck :size="32" class="text-purple-500" />
        </div>
      </div>
    </div>

    <!-- Lista de Peritajes -->
    <div v-if="!loading && !error" class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="peritajes.length === 0" class="text-center py-12">
        <ClipboardCheck :size="48" class="text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 text-lg">No tienes peritajes registrados</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehículo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patente
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="peritaje in peritajes" :key="peritaje.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ peritaje.marca || 'N/A' }} {{ peritaje.modelo || '' }} {{ peritaje.anio || '' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ peritaje.patente }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(peritaje.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-semibold rounded-full',
                    getStatusBadgeClass(peritaje.estado)
                  ]"
                >
                  {{ formatStatus(peritaje.estado) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <NuxtLink
                  :to="`/perito/peritajes/${peritaje.id}`"
                  class="text-orange-600 hover:text-orange-900"
                >
                  Ver Detalles
                </NuxtLink>
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
import { Clock, Calendar, CheckCircle, ClipboardCheck } from 'lucide-vue-next'
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
const peritajes = ref([])

const stats = computed(() => {
  return {
    pendientes: peritajes.value.filter(p => p.estado === 'PENDIENTE').length,
    enProceso: peritajes.value.filter(p => p.estado === 'EN_PROCESO').length,
    completadas: peritajes.value.filter(p => p.estado === 'FINALIZADO').length,
    total: peritajes.value.length
  }
})

const formatStatus = (estado) => {
  const status = {
    PENDIENTE: 'Pendiente',
    EN_PROCESO: 'En Proceso',
    FINALIZADO: 'Finalizado'
  }
  return status[estado] || estado
}

const getStatusBadgeClass = (estado) => {
  const classes = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800',
    EN_PROCESO: 'bg-blue-100 text-blue-800',
    FINALIZADO: 'bg-green-100 text-green-800'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800'
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

const loadPeritajes = async () => {
  loading.value = true
  error.value = null
  try {
    // Primero obtener los autos del vendedor
    const autosResponse = await $fetch(`${API_BASE}/autos`, {
      headers: getAuthHeaders()
    })
    const misAutos = autosResponse || []
    const misAutosPatentes = misAutos.map(a => a.patente).filter(p => p)
    
    if (misAutosPatentes.length === 0) {
      peritajes.value = []
      return
    }
    
    // Obtener todos los peritajes y filtrar por patentes de mis autos
    const todosLosPeritajes = await $fetch(`${API_BASE}/peritajes`, {
      headers: getAuthHeaders()
    })
    
    // Filtrar peritajes que correspondan a mis autos por patente
    peritajes.value = (todosLosPeritajes || []).filter(p => 
      p.patente && misAutosPatentes.includes(p.patente.toUpperCase())
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch (err) {
    console.error('Error cargando peritajes:', err)
    error.value = err.data?.message || 'Error al cargar los peritajes'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPeritajes()
})
</script>
