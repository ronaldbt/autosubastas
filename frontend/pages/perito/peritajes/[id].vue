<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <NuxtLink
          to="/perito/peritajes"
          class="text-orange-600 hover:text-orange-700 mb-2 inline-flex items-center text-sm"
        >
          ← Volver a Peritajes
        </NuxtLink>
        <h1 class="text-3xl font-bold text-gray-900">Detalle del Peritaje</h1>
        <p class="text-gray-600 mt-2">{{ peritaje?.patente }} - {{ peritaje?.marca }} {{ peritaje?.modelo }}</p>
      </div>
      <div class="flex space-x-3">
        <span
          v-if="peritaje"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-semibold',
            getEstadoClass(peritaje.estado)
          ]"
        >
          {{ peritaje.estado }}
        </span>
        <button
          v-if="peritaje && peritaje.estado !== 'FINALIZADO'"
          @click="updateEstado"
          class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          {{ peritaje.estado === 'PENDIENTE' ? 'Marcar En Proceso' : 'Finalizar' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Cargando peritaje...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
      {{ error }}
    </div>

    <div v-else-if="peritaje" class="space-y-8">
      <!-- INFORMACIÓN GENERAL -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-800">Información del Vehículo</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Patente</label>
            <p class="text-gray-900">{{ peritaje.patente || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Marca</label>
            <p class="text-gray-900">{{ peritaje.marca || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Modelo</label>
            <p class="text-gray-900">{{ peritaje.modelo || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Color</label>
            <p class="text-gray-900">{{ peritaje.color || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Propietario</label>
            <p class="text-gray-900">{{ peritaje.propietario || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Cliente</label>
            <p class="text-gray-900">{{ peritaje.cliente || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Teléfono</label>
            <p class="text-gray-900">{{ peritaje.telefono || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <p class="text-gray-900">{{ peritaje.email || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Fecha del Peritaje</label>
            <p class="text-gray-900">{{ formatDate(peritaje.fecha) }}</p>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-slate-700 mb-1">Dirección</label>
            <p class="text-gray-900">{{ peritaje.direccion || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Número de Motor</label>
            <p class="text-gray-900">{{ peritaje.numeroMotor || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Número de Chasis</label>
            <p class="text-gray-900">{{ peritaje.numeroChasis || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Número de Serial</label>
            <p class="text-gray-900">{{ peritaje.numeroSerial || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Tipo de Transporte</label>
            <p class="text-gray-900">{{ peritaje.tipoTransporte || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Valor Avalúo</label>
            <p class="text-gray-900">${{ peritaje.valorAvaluo?.toLocaleString() || '0' }}</p>
          </div>
        </div>
      </div>

      <!-- FRENOS -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-800">Sistema de Frenos</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Eficacia Delantera (%)</label>
            <p class="text-gray-900">{{ peritaje.frenos_eficacia_delantera || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Eficacia Trasera (%)</label>
            <p class="text-gray-900">{{ peritaje.frenos_eficacia_trasera || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Dif. Fuerza Delantera</label>
            <p class="text-gray-900">{{ peritaje.frenos_diferencia_fuerza_delantera || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Dif. Fuerza Trasera</label>
            <p class="text-gray-900">{{ peritaje.frenos_diferencia_fuerza_trasera || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Esfuerzo (kg)</label>
            <p class="text-gray-900">{{ peritaje.frenos_esfuerzo || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Peso (kg)</label>
            <p class="text-gray-900">{{ peritaje.frenos_peso || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Total</label>
            <p class="text-gray-900">{{ peritaje.frenos_total || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Estado General</label>
            <p class="text-gray-900">{{ peritaje.frenos_estado_general || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- SUSPENSIÓN -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-800">Sistema de Suspensión</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Delantera Izquierda</label>
            <p class="text-gray-900">{{ peritaje.suspension_delantera_izquierda || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Delantera Derecha</label>
            <p class="text-gray-900">{{ peritaje.suspension_delantera_derecha || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Trasera Izquierda</label>
            <p class="text-gray-900">{{ peritaje.suspension_trasera_izquierda || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Trasera Derecha</label>
            <p class="text-gray-900">{{ peritaje.suspension_trasera_derecha || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Diferencia Delantera</label>
            <p class="text-gray-900">{{ peritaje.suspension_diferencia_delantera || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Diferencia Trasera</label>
            <p class="text-gray-900">{{ peritaje.suspension_diferencia_trasera || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Estado General</label>
            <p class="text-gray-900">{{ peritaje.suspension_estado_general || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- CARROCERÍA -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-800">Inspección de Carrocería</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(value, key) in peritaje.carroceria" :key="key">
            <label class="block text-sm font-semibold text-slate-700 mb-1 capitalize">{{ key.replaceAll('_', ' ') }}</label>
            <p class="text-gray-900">{{ value || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- CHASIS -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-800">Inspección de Chasis</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(value, key) in peritaje.chasis" :key="key">
            <label class="block text-sm font-semibold text-slate-700 mb-1 capitalize">{{ key.replaceAll('_', ' ') }}</label>
            <p class="text-gray-900">{{ value || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <!-- LLANTAS -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-800">Estado de Llantas</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="(llanta, key) in peritaje.llantas" :key="key" class="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 class="font-bold text-lg text-slate-800 mb-4 capitalize">{{ key.replace('_', ' ') }}</h3>
            <div class="space-y-2">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1">Marca</label>
                <p class="text-gray-900">{{ llanta?.marca || 'N/A' }}</p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1">Medida</label>
                <p class="text-gray-900">{{ llanta?.medida || 'N/A' }}</p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1">Profundidad (mm)</label>
                <p class="text-gray-900">{{ llanta?.profundidad || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- OBSERVACIONES Y PRECIO -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-slate-800">Observaciones Generales</h2>
            </div>
            <p class="text-gray-900 whitespace-pre-wrap">{{ peritaje.observaciones_generales || 'Sin observaciones' }}</p>
          </div>

          <div>
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-slate-800">Precio del Peritaje</h2>
            </div>
            <p class="text-3xl font-bold text-gray-900">${{ peritaje.precio?.toLocaleString() || '0' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useRoute } from 'vue-router'

const { getAuthHeaders } = useAuth()
const route = useRoute()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const peritaje = ref(null)
const loading = ref(false)
const error = ref(null)

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

const loadPeritaje = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE}/peritajes/${route.params.id}`, {
      headers: getAuthHeaders()
    })
    peritaje.value = response
  } catch (err) {
    console.error('Error cargando peritaje:', err)
    error.value = err.data?.message || 'Error al cargar el peritaje'
  } finally {
    loading.value = false
  }
}

const updateEstado = async () => {
  if (!peritaje.value) return
  
  const nuevoEstado = peritaje.value.estado === 'PENDIENTE' ? 'EN_PROCESO' : 'FINALIZADO'
  
  try {
    const response = await $fetch(`${API_BASE}/peritajes/${peritaje.value.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: {
        estado: nuevoEstado
      }
    })
    peritaje.value.estado = response.estado
  } catch (err) {
    console.error('Error actualizando estado:', err)
    alert(err.data?.message || 'Error al actualizar el estado')
  }
}

onMounted(() => {
  loadPeritaje()
})

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['perito']
})
</script>










