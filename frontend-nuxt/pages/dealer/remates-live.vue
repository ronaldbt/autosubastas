<template>
  <div class="min-h-screen pb-20 bg-slate-50">
    <!-- Navbar -->
    <nav class="glass-effect sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center gap-2 cursor-pointer" @click="navigateTo('/dealer/remates-live')">
            <div class="bg-blue-600 p-2 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" stroke-width="2"/>
                <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0 2 2 0 00-4 0zM15 17a2 2 0 104 0 2 2 0 00-4 0z" stroke-width="2"/>
              </svg>
            </div>
            <span class="text-2xl font-black text-slate-900 tracking-tighter">
              AutoBid<span class="text-blue-600">PRO</span>
            </span>
          </div>

          <div class="hidden md:flex items-center gap-8">
            <a href="#" class="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">SUBASTAS ACTIVAS</a>
            <a href="#" @click.prevent="navigateTo('/dealer/pujas')" class="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">MIS PUJAS</a>
            <a href="#" class="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">AYUDA</a>
          </div>

          <div class="flex items-center gap-4">
            <div class="hidden sm:flex flex-col items-end">
              <span class="text-[10px] text-slate-400 font-bold uppercase">Balance Disponible</span>
              <span class="text-sm font-black text-slate-900">${{ formatPrice(stats.totalPujado) }}</span>
            </div>
            <div class="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
              <img v-if="user?.avatar" :src="user.avatar" alt="Avatar" />
              <div v-else class="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {{ user?.nombre?.charAt(0)?.toUpperCase() || 'U' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 class="text-4xl font-black text-slate-900 mb-2">Subastas en Vivo</h2>
            <p class="text-slate-500 max-w-lg">
              Remates de 20 minutos con certificación técnica avanzada. ¡No pierdas la oportunidad!
            </p>
          </div>
          <div class="flex gap-2">
            <button class="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 shadow-sm flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" stroke-width="2"/>
              </svg>
              Filtrar
            </button>
            <select
              v-model="sortBy"
              class="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 shadow-sm outline-none"
            >
              <option value="recientes">Recientes</option>
              <option value="por-terminar">Por terminar</option>
              <option value="mayor-precio">Mayor precio</option>
            </select>
          </div>
        </header>

        <div v-if="loading" class="text-center py-20">
          <p class="text-slate-400 font-medium">Cargando subastas...</p>
        </div>

        <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {{ error }}
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AuctionCard 
                v-for="auction in sortedAuctions" 
                :key="auction.id" 
                :auction="auction" 
                @click="(id) => viewAuction(id)"
              />
        </div>

        <div v-if="!loading && !error && auctions.length === 0" class="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <p class="text-slate-400 font-medium">No hay subastas activas en este momento.</p>
        </div>
      </div>
    </main>

    <!-- Floating Action Button for Mobile / Stats -->
    <div class="fixed bottom-6 left-1/2 -translate-x-1/2 glass-effect px-6 py-3 rounded-2xl shadow-2xl border border-white/50 flex items-center gap-6 z-40 bg-white/90 backdrop-blur-lg">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
        <span class="text-xs font-bold text-slate-700">{{ stats.activos }} Subastas hoy</span>
      </div>
      <div class="h-4 w-px bg-slate-300"></div>
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
        </svg>
        <span class="text-xs font-bold text-slate-700">${{ formatPrice(stats.valorTotal) }} transaccionados</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { navigateTo } from 'nuxt/app'
import AuctionCard from '~/components/AuctionCard.vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['dealer']
})

const { getAuthHeaders, user } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const auctions = ref([])
const loading = ref(false)
const error = ref(null)
const sortBy = ref('recientes')
let updateInterval = null

const stats = computed(() => {
  const activos = auctions.value.filter(a => a.estado === 'en_remate').length
  const totalPujado = auctions.value.reduce((sum, a) => sum + (a.miPuja || 0), 0)
  const valorTotal = auctions.value.reduce((sum, a) => sum + parseFloat(a.precioActual || a.precioBase || 0), 0)
  
  return {
    activos,
    totalPujado,
    valorTotal
  }
})

const sortedAuctions = computed(() => {
  const sorted = [...auctions.value]
  
  switch (sortBy.value) {
    case 'por-terminar':
      return sorted.sort((a, b) => {
        const aTime = new Date(a.fechaFinRemate).getTime()
        const bTime = new Date(b.fechaFinRemate).getTime()
        return aTime - bTime
      })
    case 'mayor-precio':
      return sorted.sort((a, b) => {
        const aPrice = parseFloat(a.precioActual || a.precioBase || 0)
        const bPrice = parseFloat(b.precioActual || b.precioBase || 0)
        return bPrice - aPrice
      })
    default: // recientes
      return sorted.sort((a, b) => {
        const aTime = new Date(a.fechaInicioRemate || a.createdAt).getTime()
        const bTime = new Date(b.fechaInicioRemate || b.createdAt).getTime()
        return bTime - aTime
      })
  }
})

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('es-CL').format(price)
}

const loadAuctions = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE}/autos?estado=en_remate`, {
      headers: getAuthHeaders()
    })
    
    // Obtener pujas para cada auto
    for (const auto of response) {
      try {
        const pujas = await $fetch(`${API_BASE}/remates?autoId=${auto.id}`, {
          headers: getAuthHeaders()
        })
        auto.totalPujas = pujas.length
        
        if (pujas.length > 0) {
          const pujaMasAlta = pujas.reduce((max, p) => parseFloat(p.monto) > parseFloat(max.monto) ? p : max, pujas[0])
          auto.precioActual = parseFloat(pujaMasAlta.monto)
          
          const miPuja = pujas.find(p => p.pujadorId === user.value?.id)
          auto.miPuja = miPuja ? parseFloat(miPuja.monto) : null
        } else {
          auto.precioActual = parseFloat(auto.precioBase || 0)
          auto.miPuja = null
        }
      } catch (err) {
        console.warn(`Error cargando pujas para auto ${auto.id}:`, err)
        auto.totalPujas = 0
        auto.miPuja = null
      }
    }
    
    auctions.value = response
  } catch (err) {
    console.error('Error cargando subastas:', err)
    error.value = err.data?.message || 'Error al cargar subastas'
  } finally {
    loading.value = false
  }
}

const viewAuction = (id) => {
  console.log('[remates-live] viewAuction llamado con ID:', id)
  console.log('[remates-live] Navegando a:', `/dealer/remates-live-${id}`)
  navigateTo(`/dealer/remates-live-${id}`)
}

onMounted(() => {
  loadAuctions()
  // Actualizar cada 3 segundos solo si hay remates activos
  updateInterval = setInterval(() => {
    const hayRematesActivos = auctions.value.some(a => {
      // Verificar que esté en remate y que no haya terminado el tiempo
      if (a.estado !== 'en_remate') return false
      if (a.fechaFinRemate) {
        const ahora = new Date()
        const fin = new Date(a.fechaFinRemate)
        return fin > ahora // Solo activo si aún no ha terminado
      }
      return true
    })
    if (hayRematesActivos) {
      loadAuctions()
    } else {
      // Si no hay remates activos, detener actualizaciones
      if (updateInterval) {
        clearInterval(updateInterval)
        updateInterval = null
      }
    }
  }, 3000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
.glass-effect {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}
</style>

