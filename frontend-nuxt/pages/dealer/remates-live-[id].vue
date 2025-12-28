<template>
  <div
    :class="[
      'min-h-screen transition-colors duration-1000',
      urgency === UrgencyLevel.FINAL_CALL ? 'bg-red-50/50' : 'bg-slate-50'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- Notificación flotante -->
      <Transition name="bounce">
        <div
          v-if="notification"
          class="fixed top-24 right-6 z-[100] animate-bounce"
        >
          <div class="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <span class="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
            <span class="text-sm font-bold">{{ notification }}</span>
          </div>
        </div>
      </Transition>

      <button
        @click="navigateTo('/dealer/remates-live')"
        class="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 group font-bold"
      >
        <svg
          class="w-5 h-5 group-hover:-translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        VOLVER AL PANEL
      </button>

      <div v-if="loading" class="text-center py-20">
        <p class="text-slate-500">Cargando información del remate...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
        {{ error }}
      </div>

      <div v-else-if="auction" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Columna Izquierda: Galería e Info -->
        <div class="lg:col-span-8 space-y-8">
          <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-3 relative">
            <div class="aspect-video rounded-[2rem] overflow-hidden relative bg-slate-100 group">
              <img
                :src="getImageUrl(allImages[activeImage])"
                alt="Car"
                class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div class="absolute top-6 left-6 flex flex-col gap-3">
                <AuctionTimer
                  :end-time="new Date(auction.fechaFinRemate)"
                  @urgency-change="setUrgency"
                />
                <div class="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
                  <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  <span class="text-xs font-black text-slate-800">{{ viewsCount }} PERSONAS VIENDO</span>
                </div>
              </div>
            </div>
            <div class="flex gap-3 mt-4 p-2 overflow-x-auto no-scrollbar">
              <button
                v-for="(img, idx) in allImages.slice(0, 10)"
                :key="idx"
                @click="activeImage = idx"
                :class="[
                  'flex-shrink-0 w-32 h-20 rounded-2xl overflow-hidden border-4 transition-all',
                  activeImage === idx
                    ? 'border-blue-600 scale-105 shadow-lg'
                    : 'border-transparent opacity-60 hover:opacity-100'
                ]"
              >
                <img :src="getImageUrl(img)" class="w-full h-full object-cover" alt="thumbnail" />
              </button>
            </div>
          </div>

          <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-10">
            <div class="flex justify-between items-start mb-10">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <span class="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-black uppercase">
                    LOTE #{{ String(auction.id).padStart(4, '0') }}
                  </span>
                  <span class="text-slate-400 font-bold text-xs uppercase tracking-widest">SUBASTA ACTIVA</span>
                </div>
                <h1 class="text-4xl font-black text-slate-900 tracking-tighter">
                  {{ auction.marca }} {{ auction.modelo }}
                  <span class="text-blue-600">{{ auction.anio }}</span>
                </h1>
              </div>
              <div class="text-right" v-if="auction.peritaje">
                <div class="text-xs text-slate-400 font-bold uppercase mb-1">Puntuación Técnica</div>
                <div class="text-4xl font-black text-blue-600">
                  {{ Math.round((auction.peritaje.precio / auction.precioBase) * 10) / 10 }}
                  <span class="text-xl text-slate-300">/10</span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 p-8 bg-slate-50 rounded-3xl">
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span class="text-[10px] font-black uppercase tracking-widest">Kilometraje</span>
                </div>
                <p class="text-lg font-black text-slate-700">{{ formatNumber(auction.kilometraje) }} km</p>
              </div>
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span class="text-[10px] font-black uppercase tracking-widest">Motorización</span>
                </div>
                <p class="text-lg font-black text-slate-700">{{ getEngineInfo() }}</p>
              </div>
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span class="text-[10px] font-black uppercase tracking-widest">Transmisión</span>
                </div>
                <p class="text-lg font-black text-slate-700">{{ getTransmissionInfo() }}</p>
              </div>
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.628.288a2 2 0 01-1.117.21 2 2 0 01-1.183-.55l-1.293-1.293a2 2 0 00-2.828 0 2 2 0 000 2.828l1.293 1.293a2 2 0 001.83.518l.628-.288a6 6 0 013.86-.517l2.387.477a2 2 0 011.022.547l2.387 2.387a2 2 0 102.828-2.828l-2.387-2.387z"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span class="text-[10px] font-black uppercase tracking-widest">Combustible</span>
                </div>
                <p class="text-lg font-black text-slate-700">{{ getFuelInfo() }}</p>
              </div>
            </div>

            <!-- Información del Peritaje -->
            <div v-if="auction.peritaje" class="space-y-6">
              <div class="p-8 bg-blue-600 rounded-3xl text-white relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <h3 class="flex items-center gap-2 font-black mb-4 uppercase text-xs tracking-[0.2em]">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM14.586 11H13.5a1 1 0 110-2h1.086l.707-.707a1 1 0 011.414 1.414l-.707.707zM3.636 15.657a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414z"
                    />
                  </svg>
                  Información del Peritaje
                </h3>
                <p class="text-blue-50 leading-relaxed font-medium">
                  Precio sugerido: ${{ formatPrice(auction.peritaje.precio) }} • 
                  Valor avalúo: ${{ formatPrice(auction.peritaje.valorAvaluo) }}
                </p>
              </div>

              <!-- Diagrama de Carrocería con Números -->
              <div v-if="auction.peritaje.carroceriaImagenNumeros && auction.peritaje.carroceriaImagenNumeros.length > 0" class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-6">
                <h3 class="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Diagrama de Carrocería
                </h3>
                <div class="relative bg-slate-100 rounded-2xl p-4 border-2 border-slate-200">
                  <div class="relative mx-auto">
                    <img
                      src="/carroceria_peritaje.png"
                      alt="Diagrama de Carrocería"
                      class="max-w-full h-auto rounded-lg shadow-lg"
                    />
                    <!-- Números superpuestos -->
                    <div
                      v-for="(num, index) in auction.peritaje.carroceriaImagenNumeros"
                      :key="index"
                      :style="{
                        position: 'absolute',
                        left: `${num.x}%`,
                        top: `${num.y}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10
                      }"
                    >
                      <div
                        :style="{
                          backgroundColor: getEstadoColorForRemate(num.numero),
                          color: 'white',
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                          border: '3px solid white'
                        }"
                      >
                        {{ num.numero }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Leyenda de Estados -->
                <div class="mt-4 p-4 bg-slate-50 rounded-xl">
                  <h4 class="text-sm font-bold text-slate-700 mb-2">Leyenda de Estados</h4>
                  <div class="grid grid-cols-3 gap-2">
                    <div
                      v-for="(estado, index) in estadosCarroceria"
                      :key="index"
                      class="flex items-center gap-2 text-xs"
                    >
                      <div
                        class="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs"
                        :style="{ backgroundColor: estado.color }"
                      >
                        {{ index + 1 }}
                      </div>
                      <span class="text-slate-600 font-medium">{{ estado.label }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Pujas y Martillo -->
        <div class="lg:col-span-4">
          <div class="sticky top-28 space-y-6">
            <div
              :class="[
                'bg-white rounded-[2.5rem] shadow-2xl border-4 p-8 transition-all duration-500',
                urgency === UrgencyLevel.FINAL_CALL ? 'border-red-500 animate-pulse' : 'border-slate-100'
              ]"
            >
              <div class="relative text-center mb-8">
                <!-- Martillo Animado -->
                <div
                  :class="[
                    'absolute -top-12 -right-4 text-4xl transition-all duration-300 transform',
                    hammerActive ? 'rotate-[45deg] scale-125' : 'rotate-[-20deg] opacity-20'
                  ]"
                >
                  🔨
                </div>

                <span class="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em]">OFERTA MÁXIMA ACTUAL</span>
                <div
                  :class="[
                    'text-5xl font-black mt-2 tracking-tighter transition-all duration-300',
                    hammerActive ? 'scale-110 text-blue-600' : 'text-slate-900'
                  ]"
                >
                  ${{ formatPrice(currentPrice) }}
                </div>
                <div class="flex items-center justify-center gap-2 mt-2">
                  <span class="text-xs font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full uppercase">
                    Pujas: {{ bids.length }}
                  </span>
                </div>
              </div>

              <div class="space-y-3 mb-6">
                <div class="grid grid-cols-2 gap-3">
                  <button
                    @click="handleUserBid(500)"
                    :disabled="isPlacingBid || isFinished"
                    class="bg-slate-50 border-2 border-slate-100 py-4 rounded-2xl font-black text-slate-700 hover:border-blue-600 hover:text-blue-600 transition-all active:scale-90 disabled:opacity-50"
                  >
                    +$500
                  </button>
                  <button
                    @click="handleUserBid(1000)"
                    :disabled="isPlacingBid || isFinished"
                    class="bg-slate-50 border-2 border-slate-100 py-4 rounded-2xl font-black text-slate-700 hover:border-blue-600 hover:text-blue-600 transition-all active:scale-90 disabled:opacity-50"
                  >
                    +$1,000
                  </button>
                </div>
                <button
                  @click="handleUserBid(2500)"
                  :disabled="isPlacingBid || isFinished"
                  :class="[
                    'w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50',
                    urgency === UrgencyLevel.FINAL_CALL
                      ? 'bg-red-600 text-white shadow-red-200'
                      : 'bg-blue-600 text-white shadow-blue-200'
                  ]"
                >
                  PUJAR $2,500
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <p class="text-[10px] text-center text-slate-400 font-bold uppercase leading-tight">
                ⚠️ Cada puja en el último minuto añade 10s extra de tiempo al reloj.
              </p>
            </div>

            <!-- Historial de Actividad -->
            <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
              <div class="bg-slate-50 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
                <h3 class="font-black text-slate-800 uppercase text-xs tracking-widest">Actividad en Vivo</h3>
                <div class="flex gap-1">
                  <div class="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></div>
                  <div class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                </div>
              </div>
              <div class="max-h-[400px] overflow-y-auto p-2 space-y-2">
                <div
                  v-for="(bid, i) in sortedBids"
                  :key="bid.id"
                  :class="[
                    'px-6 py-4 rounded-2xl flex justify-between items-center transition-all animate-slide-in',
                    i === 0 ? 'bg-blue-50 ring-2 ring-blue-100' : 'bg-white'
                  ]"
                >
                  <div class="flex items-center gap-3">
                    <div
                      :class="[
                        'w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black',
                        i === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                      ]"
                    >
                      {{ getInitials(bid.pujador?.nombre || 'Usuario') }}
                    </div>
                    <div>
                      <p class="text-sm font-black text-slate-800 leading-none mb-1">
                        {{ bid.pujador?.nombre || 'Usuario' }}
                        <span v-if="bid.pujadorId === user?.id" class="text-blue-600 text-xs ml-2">(Tú)</span>
                      </p>
                      <p class="text-[10px] text-slate-400 font-bold">
                        {{ formatTimeOnly(bid.fechaPuja) }}
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p :class="['text-sm font-black', i === 0 ? 'text-blue-600' : 'text-slate-900']">
                      ${{ formatPrice(bid.monto) }}
                    </p>
                    <span v-if="i === 0" class="text-[8px] font-black text-blue-400 uppercase tracking-tighter">
                      Oferta Líder
                    </span>
                  </div>
                </div>
                <div v-if="bids.length === 0" class="text-center py-8 text-slate-400 text-sm">
                  Aún no hay pujas. ¡Sé el primero!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, navigateTo } from 'nuxt/app'
import AuctionTimer from '~/components/AuctionTimer.vue'
import { UrgencyLevel } from '~/utils/auctionConstants'
import { useAuth } from '~/composables/useAuth'
import { useImageUrl } from '~/composables/useImageUrl'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['dealer']
})

const route = useRoute()
const { getAuthHeaders, user } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const auction = ref(null)
const bids = ref([])
const activeImage = ref(0)
const urgency = ref(UrgencyLevel.STABLE)
const hammerActive = ref(false)
const notification = ref(null)
const loading = ref(false)
const error = ref(null)
const isPlacingBid = ref(false)
const viewsCount = ref(15 + Math.floor(Math.random() * 20))
let updateInterval = null
let hammerTimeout = null

// Obtener el ID del parámetro de ruta (ahora desde route.params.id)
const autoId = computed(() => {
  const id = route.params.id
  console.log('[remates-live-[id]] Auto ID obtenido del route.params:', id)
  console.log('[remates-live-[id]] Route completo:', route)
  return id
})

const currentPrice = computed(() => {
  if (bids.value.length > 0) {
    const highestBid = bids.value.reduce((max, b) => parseFloat(b.monto) > parseFloat(max.monto) ? b : max, bids.value[0])
    return parseFloat(highestBid.monto)
  }
  return parseFloat(auction.value?.precioActual || auction.value?.precioBase || 0)
})

// Combinar todas las imágenes del auto y del peritaje
const allImages = computed(() => {
  const images = []
  
  // Agregar imágenes del auto
  if (auction.value?.imagenes && Array.isArray(auction.value.imagenes)) {
    images.push(...auction.value.imagenes)
  }
  
  // Agregar imágenes del peritaje (todas las secciones)
  if (auction.value?.peritaje?.imagenesPorSeccion) {
    const peritajeImagenes = auction.value.peritaje.imagenesPorSeccion
    Object.keys(peritajeImagenes).forEach(seccion => {
      if (Array.isArray(peritajeImagenes[seccion])) {
        images.push(...peritajeImagenes[seccion])
      }
    })
  }
  
  // Agregar imágenes generales del peritaje
  if (auction.value?.peritaje?.imagenes && Array.isArray(auction.value.peritaje.imagenes)) {
    images.push(...auction.value.peritaje.imagenes)
  }
  
  return images.filter(img => img && img.trim() !== '')
})

// Asegurar que activeImage esté dentro del rango válido
watch(allImages, (newImages) => {
  if (newImages.length > 0 && activeImage.value >= newImages.length) {
    activeImage.value = 0
  }
}, { immediate: true })

const sortedBids = computed(() => {
  return [...bids.value].sort((a, b) => {
    const montoDiff = parseFloat(b.monto) - parseFloat(a.monto)
    if (montoDiff !== 0) return montoDiff
    return new Date(b.fechaPuja) - new Date(a.fechaPuja)
  })
})

const isFinished = computed(() => {
  if (!auction.value) return false
  // Si el estado es 'vendido', definitivamente terminó
  if (auction.value.estado === 'vendido') return true
  // Si el estado no es 'en_remate', terminó
  if (auction.value.estado !== 'en_remate') return true
  // Si hay fechaFinRemate y ya pasó, terminó
  if (auction.value.fechaFinRemate) {
    const ahora = new Date()
    const fin = new Date(auction.value.fechaFinRemate)
    return fin <= ahora
  }
  return false
})

const setUrgency = (level) => {
  urgency.value = level
}

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('es-CL').format(price)
}

const formatNumber = (num) => {
  if (!num) return '0'
  return new Intl.NumberFormat('es-CL').format(num)
}

const formatStatus = (estado) => {
  const status = {
    en_remate: 'En Remate',
    vendido: 'Vendido',
    aprobado: 'Aprobado'
  }
  return status[estado] || estado
}

const formatDateTime = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const formatTimeOnly = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const getInitials = (name) => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const { getImageUrl: getImageUrlHelper } = useImageUrl()

const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/800x600?text=Sin+Imagen'
  return getImageUrlHelper(imagePath)
}

const getEngineInfo = () => {
  // Intentar obtener del peritaje primero, luego usar valores por defecto
  if (auction.value?.peritaje?.motor) {
    return auction.value.peritaje.motor
  }
  // Valores por defecto según marca común
  const defaultEngines = {
    'Toyota': '2.0L',
    'Honda': '1.8L',
    'BMW': '2.0 TwinPower Turbo',
    'Audi': '2.0 TFSI',
    'Volkswagen': '2.0 TSI',
    'Mercedes-Benz': '2.0L Turbo'
  }
  return defaultEngines[auction.value?.marca] || 'N/A'
}

const getTransmissionInfo = () => {
  if (auction.value?.peritaje?.transmision) {
    return auction.value.peritaje.transmision
  }
  return 'Automática' // Valor por defecto
}

const getFuelInfo = () => {
  if (auction.value?.peritaje?.combustible) {
    return auction.value.peritaje.combustible
  }
  return 'Gasolina' // Valor por defecto
}

// Estados de carrocería (24 estados) - mismo orden que en autos-peritaje.vue
const estadosCarroceria = [
  { value: 'BIEN', label: 'BIEN', color: '#10b981' },
  { value: 'BIEN REPA', label: 'BIEN REPA', color: '#3b82f6' },
  { value: 'BIEN REPAR POR REMOC', label: 'BIEN REPAR POR REMOC', color: '#6366f1' },
  { value: 'BUENO', label: 'BUENO', color: '#22c55e' },
  { value: 'CORROIDO', label: 'CORROIDO', color: '#f59e0b' },
  { value: 'CUARTEADO', label: 'CUARTEADO', color: '#ef4444' },
  { value: 'DESCUADRE', label: 'DESCUADRE', color: '#f97316' },
  { value: 'DESENGRAFE', label: 'DESENGRAFE', color: '#84cc16' },
  { value: 'FISURADO', label: 'FISURADO', color: '#eab308' },
  { value: 'GOLEVE', label: 'GOLEVE', color: '#14b8a6' },
  { value: 'GOLPEADO', label: 'GOLPEADO', color: '#f43f5e' },
  { value: 'MAL REPAR', label: 'MAL REPAR', color: '#dc2626' },
  { value: 'MAL REPINT', label: 'MAL REPINT', color: '#b91c1c' },
  { value: 'MALO', label: 'MALO', color: '#991b1b' },
  { value: 'NO REALIZADA', label: 'NO REALIZADA', color: '#6b7280' },
  { value: 'NO TIENE', label: 'NO TIENE', color: '#9ca3af' },
  { value: 'PINTURA MANC', label: 'PINTURA MANC', color: '#a855f7' },
  { value: 'RAYADO', label: 'RAYADO', color: '#ec4899' },
  { value: 'REGUL', label: 'REGUL', color: '#8b5cf6' },
  { value: 'REMOV', label: 'REMOV', color: '#64748b' },
  { value: 'REPINT', label: 'REPINT', color: '#06b6d4' },
  { value: 'REPINTADO PARCIAL', label: 'REPINTADO PARCIAL', color: '#0ea5e9' },
  { value: 'ROTO', label: 'ROTO', color: '#dc2626' },
  { value: 'SUMIDO', label: 'SUMIDO', color: '#f97316' }
]

const getEstadoColorForRemate = (numero) => {
  // Obtener el color del estado correspondiente al número
  if (numero >= 1 && numero <= estadosCarroceria.length) {
    return estadosCarroceria[numero - 1].color
  }
  return '#6b7280' // Color por defecto
}

const showNotification = (msg) => {
  notification.value = msg
  setTimeout(() => {
    notification.value = null
  }, 3000)
}

const activateHammer = () => {
  hammerActive.value = true
  if (hammerTimeout) clearTimeout(hammerTimeout)
  hammerTimeout = setTimeout(() => {
    hammerActive.value = false
  }, 600)
}

const loadAuction = async () => {
  if (!autoId.value) {
    console.error('[remates-live-[id]] No hay autoId disponible')
    error.value = 'ID de remate no proporcionado'
    loading.value = false
    return
  }

  loading.value = true
  error.value = null
  console.log('[remates-live-[id]] Cargando remate con ID:', autoId.value)
  
  try {
    const response = await $fetch(`${API_BASE}/autos/${autoId.value}`, {
      headers: getAuthHeaders()
    })
    console.log('[remates-live-[id]] Remate cargado exitosamente:', response)
    auction.value = response
    await loadBids()
  } catch (err) {
    console.error('[remates-live-[id]] Error cargando remate:', err)
    error.value = err.data?.message || 'Error al cargar el remate'
  } finally {
    loading.value = false
  }
}

const loadBids = async () => {
  if (!auction.value) {
    console.warn('[remates-live-[id]] No hay auction para cargar pujas')
    return
  }

  try {
    console.log('[remates-live-[id]] Cargando pujas para auto:', auction.value.id)
    const response = await $fetch(`${API_BASE}/remates?autoId=${auction.value.id}`, {
      headers: getAuthHeaders()
    })
    console.log('[remates-live-[id]] Pujas cargadas:', response)
    bids.value = response.sort((a, b) => {
      const montoDiff = parseFloat(b.monto) - parseFloat(a.monto)
      if (montoDiff !== 0) return montoDiff
      return new Date(b.fechaPuja) - new Date(a.fechaPuja)
    })
  } catch (err) {
    console.error('[remates-live-[id]] Error cargando pujas:', err)
  }
}

const handleUserBid = async (increase) => {
  console.log('[remates-live-[id]] handleUserBid llamado con increase:', increase)
  console.log('[remates-live-[id]] Estado actual - auction:', auction.value, 'isPlacingBid:', isPlacingBid.value, 'isFinished:', isFinished.value)
  
  if (!auction.value || isPlacingBid.value || isFinished.value) {
    console.warn('[remates-live-[id]] No se puede pujar - condiciones no cumplidas')
    return
  }

  const newAmount = currentPrice.value + increase
  console.log('[remates-live-[id]] Nueva puja calculada:', newAmount, 'Precio actual:', currentPrice.value)

  isPlacingBid.value = true
  try {
    console.log('[remates-live-[id]] Enviando puja al servidor...')
    await $fetch(`${API_BASE}/remates`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: {
        autoId: auction.value.id,
        monto: newAmount
      }
    })
    console.log('[remates-live-[id]] Puja enviada exitosamente')

    activateHammer()
    showNotification('¡Tu puja ha sido procesada!')
    await loadBids()
    await loadAuction()
  } catch (err) {
    console.error('[remates-live-[id]] Error realizando puja:', err)
    showNotification(err.data?.message || 'Error al realizar la puja')
  } finally {
    isPlacingBid.value = false
  }
}

// Watcher para detener actualizaciones cuando el remate termine
watch([isFinished, () => auction.value?.estado], ([finished, estado]) => {
  if (finished || estado === 'vendido') {
    console.log('[remates-live-[id]] Remate finalizado, deteniendo actualizaciones')
    if (updateInterval) {
      clearInterval(updateInterval)
      updateInterval = null
    }
  }
}, { immediate: true })

onMounted(() => {
  console.log('[remates-live-[id]] Componente montado, route completo:', route)
  loadAuction()

  // Actualizar pujas cada 2 segundos solo si el remate está activo y no ha terminado
  updateInterval = setInterval(() => {
    // Verificar si el remate terminó antes de actualizar
    if (!auction.value || isFinished.value || auction.value.estado !== 'en_remate') {
      console.log('[remates-live-[id]] Remate finalizado, deteniendo actualizaciones')
      if (updateInterval) {
        clearInterval(updateInterval)
        updateInterval = null
      }
      return
    }
    
    // Solo actualizar si el remate está activo
    loadBids()
    loadAuction()
  }, 2000)
})

onUnmounted(() => {
  console.log('[remates-live-[id]] Componente desmontado')
  if (updateInterval) clearInterval(updateInterval)
  if (hammerTimeout) clearTimeout(hammerTimeout)
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>



