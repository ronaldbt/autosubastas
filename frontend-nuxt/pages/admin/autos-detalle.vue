<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="mb-10 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            @click="navigateTo('/admin/autos')"
            class="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft :size="24" class="text-slate-600" />
          </button>
          <div>
            <h1 class="text-4xl font-black text-slate-900 mb-2">Detalle del Auto</h1>
            <p class="text-slate-500">Información completa del vehículo y su peritaje</p>
          </div>
        </div>
        <div class="flex space-x-2">
          <button
            v-if="auto && !auto.peritaje && (auto.estado === 'pendiente' || auto.estado === 'en_revision' || auto.estado === 'aprobado')"
            @click="navigateTo(`/admin/autos-peritaje?autoId=${auto.id}`)"
            class="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center space-x-2 font-semibold"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>Hacer Revisión (Peritaje)</span>
          </button>
          <button
            v-if="auto && (auto.estado === 'pendiente' || auto.estado === 'en_revision')"
            @click="approveAuto"
            class="px-5 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl active:scale-95 font-semibold"
          >
            Aprobar
          </button>
          <button
            v-if="auto && (auto.estado === 'pendiente' || auto.estado === 'en_revision')"
            @click="rejectAuto"
            class="px-5 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl active:scale-95 font-semibold"
          >
            Rechazar
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-20">
        <p class="text-slate-400 font-medium">Cargando información del auto...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
        {{ error }}
      </div>

      <div v-else-if="auto" class="space-y-8">
        <!-- Información del Auto -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div class="flex items-start justify-between mb-8">
            <h2 class="text-3xl font-black text-slate-900">Información del Vehículo</h2>
            <span
              :class="[
                'px-4 py-2 text-sm font-bold rounded-full uppercase tracking-wide',
                getStatusBadgeClass(auto.estado)
              ]"
            >
              {{ formatStatus(auto.estado) }}
            </span>
          </div>

          <!-- Imágenes -->
          <div v-if="auto.imagenes && auto.imagenes.length > 0" class="mb-8">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="(imagen, index) in auto.imagenes"
                :key="index"
                class="aspect-video bg-slate-100 rounded-xl overflow-hidden"
              >
                <img
                  :src="getImageUrl(imagen)"
                  :alt="`${auto.marca} ${auto.modelo} - Imagen ${index + 1}`"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label class="block text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Marca</label>
              <p class="text-lg font-black text-slate-900">{{ auto.marca }}</p>
            </div>
            <div>
              <label class="block text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Modelo</label>
              <p class="text-lg font-black text-slate-900">{{ auto.modelo }}</p>
            </div>
            <div>
              <label class="block text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Año</label>
              <p class="text-lg font-black text-slate-900">{{ auto.anio }}</p>
            </div>
            <div>
              <label class="block text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Kilometraje</label>
              <p class="text-lg font-black text-slate-900">{{ formatNumber(auto.kilometraje) }} km</p>
            </div>
            <div>
              <label class="block text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Color</label>
              <p class="text-lg font-black text-slate-900">{{ auto.color || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Precio Base</label>
              <p class="text-lg font-black text-slate-900">${{ formatPrice(auto.precioBase) }}</p>
            </div>
            <div>
              <label class="block text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Precio Actual</label>
              <p class="text-lg font-black text-slate-900">${{ formatPrice(auto.precioActual) }}</p>
            </div>
            <div>
              <label class="block text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Vendedor</label>
              <p class="text-lg font-black text-slate-900">{{ auto.creador?.nombre || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Email Vendedor</label>
              <p class="text-lg font-black text-slate-900">{{ auto.creador?.email || 'N/A' }}</p>
            </div>
          </div>

          <div v-if="auto.descripcion" class="mt-8 p-6 bg-slate-50 rounded-xl">
            <label class="block text-xs text-slate-400 font-bold uppercase tracking-wide mb-2">Descripción</label>
            <p class="text-slate-900 whitespace-pre-wrap font-medium">{{ auto.descripcion }}</p>
          </div>
        </div>

        <!-- Peritaje -->
        <div v-if="auto.peritaje" class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-3xl font-black text-slate-900">Peritaje del Vehículo</h2>
            <button
              v-if="canEditPeritaje"
              @click="navigateTo(`/admin/autos-peritaje?autoId=${auto.id}`)"
              class="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center space-x-2 font-semibold"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              <span>Editar Peritaje</span>
            </button>
          </div>
          
          <div class="space-y-8">
            <!-- Información General del Peritaje -->
            <div>
              <h3 class="text-xl font-black text-slate-800 mb-6">Información General</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label class="block text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Patente</label>
                  <p class="text-lg font-black text-slate-900">{{ auto.peritaje.patente }}</p>
                </div>
                <div>
                  <label class="block text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Fecha del Peritaje</label>
                  <p class="text-lg font-black text-slate-900">{{ formatDate(auto.peritaje.fecha) }}</p>
                </div>
                <div>
                  <label class="block text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Estado</label>
                  <span
                    :class="[
                      'px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide',
                      getPeritajeEstadoClass(auto.peritaje.estado)
                    ]"
                  >
                    {{ auto.peritaje.estado }}
                  </span>
                </div>
                <div>
                  <label class="block text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Perito</label>
                  <p class="text-lg font-black text-slate-900">{{ auto.peritaje.perito?.nombre || 'N/A' }}</p>
                </div>
                <div>
                  <label class="block text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Precio del Peritaje</label>
                  <p class="text-lg font-black text-slate-900">${{ formatPrice(auto.peritaje.precio) }}</p>
                </div>
              </div>
            </div>

            <!-- Sistema de Frenos -->
            <div v-if="auto.peritaje.frenos_eficacia_delantera !== null" class="border-t border-slate-200 pt-8">
              <h3 class="text-xl font-black text-slate-800 mb-6">Sistema de Frenos</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label class="block text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Eficacia Delantera</label>
                  <p class="text-lg font-black text-slate-900">{{ auto.peritaje.frenos_eficacia_delantera }}%</p>
                </div>
                <div>
                  <label class="block text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Eficacia Trasera</label>
                  <p class="text-lg font-black text-slate-900">{{ auto.peritaje.frenos_eficacia_trasera }}%</p>
                </div>
                <div>
                  <label class="block text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Estado General</label>
                  <p class="text-lg font-black text-slate-900">{{ auto.peritaje.frenos_estado_general || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <!-- Sistema de Suspensión -->
            <div v-if="auto.peritaje.suspension_delantera_izquierda !== null" class="border-t border-slate-200 pt-8">
              <h3 class="text-xl font-black text-slate-800 mb-6">Sistema de Suspensión</h3>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <label class="block text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Delantera Izquierda</label>
                  <p class="text-lg font-black text-slate-900">{{ auto.peritaje.suspension_delantera_izquierda }}</p>
                </div>
                <div>
                  <label class="block text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Delantera Derecha</label>
                  <p class="text-lg font-black text-slate-900">{{ auto.peritaje.suspension_delantera_derecha }}</p>
                </div>
                <div>
                  <label class="block text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Estado General</label>
                  <p class="text-lg font-black text-slate-900">{{ auto.peritaje.suspension_estado_general || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <!-- Observaciones -->
            <div v-if="auto.peritaje.observaciones_generales" class="border-t border-slate-200 pt-8">
              <h3 class="text-xl font-black text-slate-800 mb-6">Observaciones Generales</h3>
              <div class="p-6 bg-slate-50 rounded-xl">
                <p class="text-slate-900 whitespace-pre-wrap font-medium">{{ auto.peritaje.observaciones_generales }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sin Peritaje -->
        <div v-else class="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="bg-yellow-100 p-3 rounded-xl">
                <AlertCircle :size="32" class="text-yellow-600" />
              </div>
              <div>
                <h3 class="text-xl font-black text-yellow-900 mb-1">Sin Peritaje</h3>
                <p class="text-sm text-yellow-700 font-medium">Este vehículo no tiene un peritaje asociado.</p>
              </div>
            </div>
            <button
              v-if="auto && !auto.peritaje && (auto.estado === 'pendiente' || auto.estado === 'en_revision' || auto.estado === 'aprobado')"
              @click="navigateTo(`/admin/autos-peritaje?autoId=${auto.id}`)"
              class="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center space-x-2 font-semibold"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>Hacer Revisión (Peritaje)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, navigateTo } from 'nuxt/app'
import { ArrowLeft, AlertCircle } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'
import { useImageUrl } from '~/composables/useImageUrl'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['admin', 'superadmin', 'perito']
})

const route = useRoute()
const { getAuthHeaders, user } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const auto = ref(null)
const loading = ref(false)
const error = ref(null)

// Verificar si el usuario puede editar el peritaje (admin o perito)
const canEditPeritaje = computed(() => {
  if (!user.value) return false
  const userRole = user.value.rol
  return userRole === 'admin' || userRole === 'superadmin' || userRole === 'perito'
})

const formatStatus = (estado) => {
  const status = {
    pendiente: 'Pendiente',
    en_revision: 'En Revisión',
    aprobado: 'Aprobado',
    rechazado: 'Rechazado',
    disponible: 'Disponible',
    en_remate: 'En Remate',
    vendido: 'Vendido',
    cancelado: 'Cancelado'
  }
  return status[estado] || estado
}

const getStatusBadgeClass = (estado) => {
  const classes = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    en_revision: 'bg-blue-100 text-blue-800',
    aprobado: 'bg-green-100 text-green-800',
    rechazado: 'bg-red-100 text-red-800',
    disponible: 'bg-green-100 text-green-800',
    en_remate: 'bg-purple-100 text-purple-800',
    vendido: 'bg-gray-100 text-gray-800',
    cancelado: 'bg-gray-100 text-gray-800'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800'
}

const getPeritajeEstadoClass = (estado) => {
  const classes = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800',
    EN_PROCESO: 'bg-blue-100 text-blue-800',
    FINALIZADO: 'bg-green-100 text-green-800'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800'
}

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('es-CL').format(price)
}

const formatNumber = (num) => {
  if (!num) return '0'
  return new Intl.NumberFormat('es-CL').format(num)
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const { getImageUrl: getImageUrlHelper } = useImageUrl()

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  return getImageUrlHelper(imagePath)
}

const loadAuto = async () => {
  loading.value = true
  error.value = null
  try {
    const autoId = route.query.id || route.params.id
    if (!autoId) {
      error.value = 'ID de auto no proporcionado'
      loading.value = false
      return
    }
    const response = await $fetch(`${API_BASE}/autos/${autoId}`, {
      headers: getAuthHeaders()
    })
    auto.value = response
  } catch (err) {
    console.error('Error cargando auto:', err)
    error.value = err.data?.message || 'Error al cargar el auto'
  } finally {
    loading.value = false
  }
}

const approveAuto = async () => {
  if (!auto.value) return
  try {
    await $fetch(`${API_BASE}/autos/${auto.value.id}/estado`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: { estado: 'aprobado' }
    })
    await loadAuto()
  } catch (err) {
    console.error('Error aprobando auto:', err)
    alert(err.data?.message || 'Error al aprobar auto')
  }
}

const rejectAuto = async () => {
  if (!auto.value) return
  if (!confirm('¿Estás seguro de rechazar este auto?')) return
  
  try {
    await $fetch(`${API_BASE}/autos/${auto.value.id}/estado`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: { estado: 'rechazado' }
    })
    await loadAuto()
  } catch (err) {
    console.error('Error rechazando auto:', err)
    alert(err.data?.message || 'Error al rechazar auto')
  }
}

onMounted(() => {
  loadAuto()
})
</script>
