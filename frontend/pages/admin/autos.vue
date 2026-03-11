<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="mb-10 flex justify-between items-center">
        <div>
          <h1 class="text-4xl font-black text-slate-900 mb-2">Autos Pendientes</h1>
          <p class="text-slate-500">Revisa y aprueba los autos en espera de publicación</p>
        </div>
        <button
          @click="navigateTo('/admin/autos-nuevo')"
          class="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center space-x-2 font-semibold"
        >
          <PlusCircle :size="20" />
          <span>Nuevo Auto</span>
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Pendientes</p>
              <p class="text-3xl font-black text-slate-900">{{ stats.pendientes }}</p>
            </div>
            <div class="bg-yellow-50 p-3 rounded-xl">
              <Clock :size="24" class="text-yellow-600" />
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Aprobados Hoy</p>
              <p class="text-3xl font-black text-slate-900">{{ stats.aprobadosHoy }}</p>
            </div>
            <div class="bg-green-50 p-3 rounded-xl">
              <CheckCircle :size="24" class="text-green-600" />
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Rechazados Hoy</p>
              <p class="text-3xl font-black text-slate-900">{{ stats.rechazadosHoy }}</p>
            </div>
            <div class="bg-red-50 p-3 rounded-xl">
              <XCircle :size="24" class="text-red-600" />
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">En Revisión</p>
              <p class="text-3xl font-black text-slate-900">{{ stats.enRevision }}</p>
            </div>
            <div class="bg-blue-50 p-3 rounded-xl">
              <Eye :size="24" class="text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-xs text-slate-400 font-bold uppercase tracking-wide mb-2">Buscar</label>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Marca, modelo, vendedor..."
              class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none transition-colors text-slate-900 font-medium"
            />
          </div>
          <div>
            <label class="block text-xs text-slate-400 font-bold uppercase tracking-wide mb-2">Estado</label>
            <select
              v-model="filterStatus"
              class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none transition-colors text-slate-900 font-medium"
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_revision">En Revisión</option>
              <option value="aprobado">Aprobado</option>
              <option value="rechazado">Rechazado</option>
              <option value="disponible">Disponible</option>
              <option value="vendido">Vendido</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-slate-400 font-bold uppercase tracking-wide mb-2">Marca</label>
            <input
              type="text"
              v-model="filterBrand"
              placeholder="Filtrar por marca..."
              class="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none transition-colors text-slate-900 font-medium"
            />
          </div>
          <div class="flex items-end">
            <button
              @click="resetFilters"
              class="w-full px-4 py-2.5 border-2 border-slate-200 text-slate-600 rounded-xl hover:border-slate-300 transition-all active:scale-95 font-semibold"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      <!-- Mensaje de Error -->
      <div v-if="error" class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
        {{ error }}
      </div>

      <!-- Lista de Autos Pendientes -->
      <div v-if="loading" class="text-center py-20">
        <p class="text-slate-400 font-medium">Cargando autos...</p>
      </div>
      <div v-else-if="filteredAutos.length === 0" class="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
        <p class="text-slate-400 font-medium">No se encontraron autos</p>
      </div>
      <div v-else class="space-y-6">
        <div
          v-for="auto in filteredAutos"
          :key="auto.id"
          class="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow overflow-hidden"
        >
          <div class="flex items-start gap-6 p-6">
            <!-- Imagen -->
            <div class="w-48 h-32 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                v-if="auto.imagenes && auto.imagenes.length > 0"
                :src="getImageUrl(auto.imagenes[0])"
                :alt="auto.marca + ' ' + auto.modelo"
                class="w-full h-full object-cover"
                @error="handleImageError($event, auto)"
                @load="handleImageLoad($event, auto)"
              />
              <Car v-else :size="48" class="text-slate-400" />
            </div>

            <!-- Información -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-xl font-black text-slate-900">
                      {{ auto.marca }} {{ auto.modelo }} {{ auto.anio }}
                    </h3>
                    <span
                      :class="[
                        'px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide',
                        getStatusBadgeClass(auto.estado)
                      ]"
                    >
                      {{ formatStatus(auto.estado) }}
                    </span>
                  </div>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p class="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Kilometraje</p>
                      <p class="text-sm font-semibold text-slate-900">{{ formatNumber(auto.kilometraje) }} km</p>
                    </div>
                    <div>
                      <p class="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Precio Base</p>
                      <p class="text-sm font-semibold text-slate-900">${{ formatPrice(auto.precioBase) }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Vendedor</p>
                      <p class="text-sm font-semibold text-slate-900">{{ auto.creador?.nombre || 'N/A' }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Fecha Solicitud</p>
                      <p class="text-sm font-semibold text-slate-900">{{ formatDate(auto.createdAt) }}</p>
                    </div>
                  </div>
                  <div v-if="auto.peritaje" class="mt-3">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 uppercase tracking-wide">
                      <ClipboardCheck :size="14" class="mr-1.5" />
                      Tiene Peritaje
                    </span>
                  </div>
                  <div v-else class="mt-3">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-600 uppercase tracking-wide">
                      <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Sin Peritaje
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="flex flex-col gap-2 min-w-[140px]">
              <button
                @click="viewAuto(auto.id)"
                class="px-4 py-2.5 bg-slate-50 text-slate-700 rounded-xl hover:bg-slate-100 transition-all active:scale-95 text-sm font-semibold border border-slate-200"
              >
                Ver Detalles
              </button>
              <button
                v-if="!auto.peritaje && (auto.estado === 'pendiente' || auto.estado === 'en_revision' || auto.estado === 'aprobado')"
                @click="startReview(auto.id)"
                class="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all active:scale-95 text-sm font-semibold shadow-lg flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Hacer Revisión
              </button>
              <button
                v-if="auto.estado === 'pendiente' || auto.estado === 'en_revision'"
                @click="approveAuto(auto.id)"
                class="px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all active:scale-95 text-sm font-semibold shadow-lg"
              >
                Aprobar
              </button>
              <button
                v-if="auto.estado === 'pendiente' || auto.estado === 'en_revision'"
                @click="rejectAuto(auto.id)"
                class="px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all active:scale-95 text-sm font-semibold shadow-lg"
              >
                Rechazar
              </button>
              <button
                v-if="auto.estado === 'aprobado' || auto.estado === 'disponible'"
                @click="sendToAuction(auto.id)"
                class="px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all active:scale-95 text-sm font-semibold shadow-lg"
              >
                Enviar a Subasta
              </button>
              <button
                v-if="auto.estado === 'vendido'"
                @click="resendToAuction(auto.id)"
                class="px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all active:scale-95 text-sm font-semibold shadow-lg"
              >
                Reenviar a Subasta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { navigateTo } from 'nuxt/app'
import { Clock, CheckCircle, XCircle, Eye, Car, PlusCircle, ClipboardCheck } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'
import { useImageUrl } from '~/composables/useImageUrl'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['admin']
})

const { getAuthHeaders } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const searchQuery = ref('')
const filterStatus = ref('')
const filterBrand = ref('')
const autos = ref([])
const loading = ref(false)
const error = ref(null)

const stats = computed(() => {
  const hoy = new Date().toDateString()
  return {
    pendientes: autos.value.filter(a => a.estado === 'pendiente').length,
    aprobadosHoy: autos.value.filter(a => 
      a.estado === 'aprobado' && new Date(a.updatedAt).toDateString() === hoy
    ).length,
    rechazadosHoy: autos.value.filter(a => 
      a.estado === 'rechazado' && new Date(a.updatedAt).toDateString() === hoy
    ).length,
    enRevision: autos.value.filter(a => a.estado === 'en_revision').length
  }
})

const filteredAutos = computed(() => {
  return autos.value.filter(auto => {
    const matchesSearch = !searchQuery.value ||
      `${auto.marca} ${auto.modelo}`.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      auto.creador?.nombre?.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = !filterStatus.value || auto.estado === filterStatus.value
    const matchesBrand = !filterBrand.value || 
      auto.marca.toLowerCase().includes(filterBrand.value.toLowerCase())
    
    return matchesSearch && matchesStatus && matchesBrand
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  filterBrand.value = ''
}

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
  console.log('[autos.vue] getImageUrl llamado con:', imagePath)
  return getImageUrlHelper(imagePath)
}

const handleImageError = (event, auto) => {
  console.error('[autos.vue] Error cargando imagen:', {
    autoId: auto.id,
    autoMarca: auto.marca,
    autoModelo: auto.modelo,
    imagenes: auto.imagenes,
    src: event.target.src,
    error: event,
    errorType: event.type,
    errorMessage: event.message
  })
  
  // Intentar cargar placeholder
  if (event.target.src && !event.target.src.includes('placeholder')) {
    event.target.src = 'https://via.placeholder.com/400x300?text=Error+al+cargar+imagen'
  }
}

const handleImageLoad = (event, auto) => {
  console.log('[autos.vue] Imagen cargada exitosamente:', {
    autoId: auto.id,
    src: event.target.src
  })
}

const loadAutos = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE}/autos`, {
      headers: getAuthHeaders()
    })
    console.log('[autos.vue] Autos cargados:', response)
    console.log('[autos.vue] Primer auto imágenes:', response[0]?.imagenes)
    autos.value = response
  } catch (err) {
    console.error('[autos.vue] Error cargando autos:', err)
    error.value = err.data?.message || 'Error al cargar autos'
  } finally {
    loading.value = false
  }
}

const viewAuto = (id) => {
  navigateTo(`/admin/autos-detalle?id=${id}`)
}

const approveAuto = async (id) => {
  try {
    const response = await $fetch(`${API_BASE}/autos/${id}/estado`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: { estado: 'aprobado' }
    })
    await loadAutos()
    alert('Auto aprobado exitosamente!')
  } catch (err) {
    console.error('Error aprobando auto:', err)
    const errorMessage = err.data?.message || err.data?.errors?.[0]?.msg || 'Error al aprobar auto'
    error.value = errorMessage
    alert(errorMessage)
  }
}

const rejectAuto = async (id) => {
  if (!confirm('¿Estás seguro de rechazar este auto?')) return
  
  try {
    const response = await $fetch(`${API_BASE}/autos/${id}/estado`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: { estado: 'rechazado' }
    })
    await loadAutos()
    alert('Auto rechazado exitosamente!')
  } catch (err) {
    console.error('Error rechazando auto:', err)
    const errorMessage = err.data?.message || err.data?.errors?.[0]?.msg || 'Error al rechazar auto'
    error.value = errorMessage
    alert(errorMessage)
  }
}

const startReview = async (id) => {
  // Navegar a la página de peritaje para este auto
  navigateTo(`/admin/autos-peritaje?autoId=${id}`)
}

const sendToAuction = async (id) => {
  const diasInput = window.prompt('¿Cuántos días de duración tendrá el remate?', '4')
  if (diasInput == null) return
  const dias = Math.max(1, Math.min(90, parseInt(diasInput, 10) || 4))

  if (!confirm(`¿Enviar este auto a subasta? El remate durará ${dias} día${dias !== 1 ? 's' : ''}.`)) return

  try {
    await $fetch(`${API_BASE}/autos/${id}/iniciar-remate`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: { dias }
    })

    alert('Auto enviado a subasta exitosamente.')
    await loadAutos()
    navigateTo('/admin/remates')
  } catch (err) {
    console.error('Error enviando a subasta:', err)
    error.value = err.data?.message || 'Error al enviar auto a subasta'
    alert(error.value)
  }
}

const resendToAuction = async (id) => {
  if (!confirm('¿Reenviar este auto a subasta? (Se pondrá de nuevo en remate. Úsalo si la venta no se concretó.)')) return

  const diasInput = window.prompt('¿Cuántos días de duración tendrá el remate?', '4')
  if (diasInput == null) return
  const dias = Math.max(1, Math.min(90, parseInt(diasInput, 10) || 4))

  try {
    await $fetch(`${API_BASE}/autos/${id}/estado`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: { estado: 'aprobado' }
    })
    await $fetch(`${API_BASE}/autos/${id}/iniciar-remate`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: { dias }
    })
    alert('Auto reenviado a subasta exitosamente.')
    await loadAutos()
    navigateTo('/admin/remates')
  } catch (err) {
    console.error('Error reenviando a subasta:', err)
    error.value = err.data?.message || 'Error al reenviar auto a subasta'
    alert(error.value)
  }
}

onMounted(() => {
  loadAutos()
})
</script>
