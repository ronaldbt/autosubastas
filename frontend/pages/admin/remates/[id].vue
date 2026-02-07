<template>
  <div>
    <div class="mb-6 flex items-center space-x-4">
      <button
        @click="navigateTo('/admin/remates')"
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ArrowLeft :size="24" class="text-gray-600" />
      </button>
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Remate en Vivo</h1>
        <p class="text-gray-600 mt-2">Sigue el remate en tiempo real</p>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Cargando información del remate...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
      {{ error }}
    </div>

    <div v-else-if="auto" class="space-y-6">
      <!-- Información del Ganador si el remate terminó -->
      <div
        v-if="auto.estado === 'vendido' && auto.pujaGanadora"
        class="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg shadow-lg p-6"
      >
        <div class="flex items-center space-x-4 mb-4">
          <div class="text-4xl">🏆</div>
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Remate Finalizado</h3>
            <p class="text-gray-600">Auto adjudicado exitosamente</p>
          </div>
        </div>
        <div class="bg-white rounded-lg p-4 border border-green-200">
          <p class="text-sm text-gray-600 mb-2">Ganador:</p>
          <p class="text-xl font-bold text-gray-900 mb-1">{{ auto.pujaGanadora.pujador?.nombre || 'N/A' }}</p>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <div>
              <p class="text-xs text-gray-500">Email</p>
              <p class="text-sm font-medium text-gray-900">{{ auto.pujaGanadora.pujador?.email || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Teléfono</p>
              <p class="text-sm font-medium text-gray-900">{{ auto.pujaGanadora.pujador?.telefono || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Monto Adjudicado</p>
              <p class="text-lg font-bold text-green-600">${{ formatPrice(auto.pujaGanadora.monto) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Información del Auto y Contador -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-start justify-between mb-6">
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              {{ auto.marca }} {{ auto.modelo }} {{ auto.anio }}
            </h2>
            <div class="flex items-center space-x-4">
              <span
                :class="[
                  'px-3 py-1 text-sm font-semibold rounded-full',
                  getStatusBadgeClass(auto.estado)
                ]"
              >
                {{ formatStatus(auto.estado) }}
              </span>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500 mb-1">Tiempo Restante</p>
            <div
              :class="[
                'text-4xl font-bold',
                getTimeRemainingClass(auto.fechaFinRemate)
              ]"
            >
              {{ getTimeRemaining(auto.fechaFinRemate) }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
            <p class="text-sm text-gray-600 mb-1">Puja Actual</p>
            <p class="text-3xl font-bold text-orange-600">${{ formatPrice(auto.precioActual) }}</p>
          </div>
          <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
            <p class="text-sm text-gray-600 mb-1">Precio Base</p>
            <p class="text-2xl font-bold text-blue-600">${{ formatPrice(auto.precioBase) }}</p>
          </div>
          <div class="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
            <p class="text-sm text-gray-600 mb-1">Total de Pujas</p>
            <p class="text-3xl font-bold text-green-600">{{ pujas.length }}</p>
          </div>
        </div>

        <!-- Imagen del Auto -->
        <div v-if="auto.imagenes && auto.imagenes.length > 0" class="mt-6">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="(imagen, index) in auto.imagenes.slice(0, 4)"
              :key="index"
              class="relative aspect-video rounded-lg overflow-hidden shadow-md"
            >
              <img
                :src="getImageUrl(imagen)"
                :alt="`Imagen ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Sección de Pujas -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Formulario de Puja -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow p-6 sticky top-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Realizar Puja</h3>
            
            <div class="mb-4">
              <p class="text-sm text-gray-600 mb-2">Puja Mínima</p>
              <p class="text-2xl font-bold text-orange-600">
                ${{ formatPrice(getMinBid()) }}
              </p>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Monto de la Puja ($)
                </label>
                <input
                  v-model.number="nuevaPuja"
                  type="number"
                  :min="getMinBid()"
                  :step="10000"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                  placeholder="Ingrese el monto"
                />
                <p class="text-xs text-gray-500 mt-1">
                  Mínimo: ${{ formatPrice(getMinBid()) }}
                </p>
              </div>

              <button
                @click="realizarPuja"
                :disabled="!puedePujar || isLoadingPuja || isFinished"
                class="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {{ isLoadingPuja ? 'Enviando...' : isFinished ? 'Remate Finalizado' : 'Realizar Puja' }}
              </button>

              <div v-if="!puedePujar && !isFinished" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p class="text-sm text-yellow-800">
                  Debes iniciar sesión como dealer para realizar pujas
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Historial de Pujas -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Historial de Pujas</h3>
            
            <div v-if="pujas.length === 0" class="text-center py-8">
              <HandCoins :size="48" class="text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500">Aún no hay pujas</p>
              <p class="text-gray-400 text-sm mt-2">Sé el primero en pujar!</p>
            </div>

            <div v-else class="space-y-3 max-h-96 overflow-y-auto">
              <div
                v-for="(puja, index) in pujas"
                :key="puja.id"
                :class="[
                  'flex items-center justify-between p-4 rounded-lg border-2',
                  index === 0 ? 'bg-orange-50 border-orange-300' : 'bg-gray-50 border-gray-200'
                ]"
              >
                <div class="flex items-center space-x-4">
                  <div
                    :class="[
                      'w-10 h-10 rounded-full flex items-center justify-center font-bold text-white',
                      index === 0 ? 'bg-orange-500' : 'bg-gray-400'
                    ]"
                  >
                    {{ index + 1 }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">
                      {{ puja.pujador?.nombre || 'Usuario' }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ formatDateTime(puja.fechaPuja) }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p
                    :class="[
                      'text-xl font-bold',
                      index === 0 ? 'text-orange-600' : 'text-gray-700'
                    ]"
                  >
                    ${{ formatPrice(puja.monto) }}
                  </p>
                  <p
                    v-if="index === 0"
                    class="text-xs text-orange-600 font-semibold"
                  >
                    Puja Actual
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Información del Peritaje (si existe) -->
      <div v-if="auto.peritaje" class="bg-white rounded-lg shadow p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Información del Peritaje</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p class="text-sm text-gray-600">Valor Avalúo</p>
            <p class="font-medium">${{ formatPrice(auto.peritaje.valorAvaluo) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Precio Sugerido</p>
            <p class="font-medium">${{ formatPrice(auto.peritaje.precio) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Estado</p>
            <p class="font-medium">{{ auto.peritaje.estado }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, navigateTo } from 'nuxt/app'
import { ArrowLeft, HandCoins } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'
import { useImageUrl } from '~/composables/useImageUrl'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['admin', 'superadmin', 'dealer']
})

// Esta página también es accesible para dealers desde /dealer/remates/[id]

const route = useRoute()
const { getAuthHeaders, user } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const auto = ref(null)
const pujas = ref([])
const nuevaPuja = ref(null)
const loading = ref(false)
const isLoadingPuja = ref(false)
const error = ref(null)
let updateInterval = null
let countdownInterval = null

const isFinished = computed(() => {
  if (!auto.value) return false
  // El remate terminó si el estado es vendido o si la fecha pasó
  if (auto.value.estado === 'vendido') return true
  if (!auto.value.fechaFinRemate) return false
  const ahora = new Date()
  const fin = new Date(auto.value.fechaFinRemate)
  return fin <= ahora
})

const puedePujar = computed(() => {
  return user.value && (user.value.rol === 'dealer' || user.value.rol === 'admin' || user.value.rol === 'superadmin')
})

const getMinBid = () => {
  if (!auto.value) return 0
  const precioActual = parseFloat(auto.value.precioActual || auto.value.precioBase || 0)
  return precioActual + 10000 // Incremento mínimo de $10,000
}

const formatStatus = (estado) => {
  const status = {
    en_remate: 'En Remate',
    vendido: 'Vendido'
  }
  return status[estado] || estado
}

const getStatusBadgeClass = (estado) => {
  const classes = {
    en_remate: 'bg-purple-100 text-purple-800',
    vendido: 'bg-gray-100 text-gray-800'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800'
}

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('es-CL').format(price)
}

const { getImageUrl: getImageUrlHelper } = useImageUrl()

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  return getImageUrlHelper(imagePath)
}

const getTimeRemaining = (fechaFin) => {
  if (!fechaFin) return '00:00'
  const ahora = new Date()
  const fin = new Date(fechaFin)
  const diff = fin - ahora
  
  if (diff <= 0) return '00:00'
  
  const minutos = Math.floor(diff / 60000)
  const segundos = Math.floor((diff % 60000) / 1000)
  
  return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`
}

const getTimeRemainingClass = (fechaFin) => {
  if (!fechaFin) return 'text-gray-700'
  const ahora = new Date()
  const fin = new Date(fechaFin)
  const diff = fin - ahora
  const minutos = Math.floor(diff / 60000)
  
  if (diff <= 0) return 'text-red-600'
  if (minutos < 5) return 'text-red-600 animate-pulse'
  if (minutos < 10) return 'text-orange-600'
  return 'text-green-600'
}

const formatDateTime = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const loadAuto = async () => {
  loading.value = true
  error.value = null
  try {
    const autoId = route.params.id
    const response = await $fetch(`${API_BASE}/autos/${autoId}`, {
      headers: getAuthHeaders()
    })
    auto.value = response
    await loadPujas()
  } catch (err) {
    console.error('Error cargando auto:', err)
    error.value = err.data?.message || 'Error al cargar el auto'
  } finally {
    loading.value = false
  }
}

const loadPujas = async () => {
  if (!auto.value) return
  
  try {
    const response = await $fetch(`${API_BASE}/remates?autoId=${auto.value.id}`, {
      headers: getAuthHeaders()
    })
    // Ordenar por monto descendente y luego por fecha descendente
    pujas.value = response.sort((a, b) => {
      const montoDiff = parseFloat(b.monto) - parseFloat(a.monto)
      if (montoDiff !== 0) return montoDiff
      return new Date(b.fechaPuja) - new Date(a.fechaPuja)
    })
    
    // Actualizar precio actual del auto con la puja más alta
    if (pujas.value.length > 0) {
      const pujaMasAlta = pujas.value[0]
      auto.value.precioActual = parseFloat(pujaMasAlta.monto)
    }
  } catch (err) {
    console.error('Error cargando pujas:', err)
  }
}

const realizarPuja = async () => {
  if (!nuevaPuja.value || nuevaPuja.value < getMinBid()) {
    alert(`El monto debe ser al menos $${formatPrice(getMinBid())}`)
    return
  }

  isLoadingPuja.value = true
  try {
    await $fetch(`${API_BASE}/remates`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: {
        autoId: auto.value.id,
        monto: nuevaPuja.value
      }
    })
    
    nuevaPuja.value = null
    await loadPujas()
    await loadAuto() // Recargar auto para actualizar precio actual
  } catch (err) {
    console.error('Error realizando puja:', err)
    alert(err.data?.message || 'Error al realizar la puja')
  } finally {
    isLoadingPuja.value = false
  }
}

onMounted(() => {
  loadAuto()
  
  // Actualizar pujas cada 2 segundos solo si el remate está activo
  updateInterval = setInterval(() => {
    if (auto.value && auto.value.estado === 'en_remate' && !isFinished.value) {
      loadPujas()
    } else {
      // Si el remate terminó, detener actualizaciones
      if (updateInterval) {
        clearInterval(updateInterval)
        updateInterval = null
      }
    }
  }, 2000)
  
  // Actualizar contador cada segundo solo si el remate está activo
  countdownInterval = setInterval(() => {
    if (auto.value && auto.value.fechaFinRemate && auto.value.estado === 'en_remate') {
      const ahora = new Date()
      const fin = new Date(auto.value.fechaFinRemate)
      if (fin <= ahora) {
        // El remate terminó, recargar una vez para ver estado actualizado y luego detener
        loadAuto().then(() => {
          if (countdownInterval) {
            clearInterval(countdownInterval)
            countdownInterval = null
          }
        })
      }
    } else if (auto.value && auto.value.estado === 'vendido') {
      // Si ya está vendido, detener actualizaciones
      if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
      }
    }
  }, 1000)
})

onUnmounted(() => {
  if (updateInterval) clearInterval(updateInterval)
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>

