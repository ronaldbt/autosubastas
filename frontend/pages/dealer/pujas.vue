<template>
  <div class="min-h-screen pb-20 bg-slate-50">
    <!-- Main Content -->
    <main>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header class="mb-6">
          <div>
            <h2 class="text-3xl font-black text-slate-900 mb-1">Mis Pujas</h2>
            <p class="text-sm text-slate-500">
              Gestiona todas tus pujas activas
            </p>
          </div>
        </header>

        <div v-if="loading" class="text-center py-12">
          <p class="text-slate-400 font-medium text-xs">Cargando pujas...</p>
        </div>

        <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-xs">
          {{ error }}
        </div>

        <div v-else>
          <!-- Stats -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1">Pujas Activas</p>
                  <p class="text-2xl font-black text-slate-900">{{ stats.pujasActivas }}</p>
                </div>
                <div class="bg-blue-50 p-2 rounded-lg">
                  <HandCoins :size="20" class="text-blue-600" />
                </div>
              </div>
            </div>
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1">Liderando</p>
                  <p class="text-2xl font-black text-slate-900">{{ stats.pujasLiderando }}</p>
                </div>
                <div class="bg-yellow-50 p-2 rounded-lg">
                  <Trophy :size="20" class="text-yellow-600" />
                </div>
              </div>
            </div>
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1">Total Pujado</p>
                  <p class="text-2xl font-black text-slate-900">${{ formatPrice(stats.totalInvertido) }}</p>
                </div>
                <div class="bg-green-50 p-2 rounded-lg">
                  <DollarSign :size="20" class="text-green-600" />
                </div>
              </div>
            </div>
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1">Pujas Ganadas</p>
                  <p class="text-2xl font-black text-slate-900">{{ stats.autosGanados }}</p>
                </div>
                <div class="bg-green-50 p-2 rounded-lg">
                  <CheckCircle :size="20" class="text-green-600" />
                </div>
              </div>
            </div>
          </div>

          <!-- Lista de Pujas -->
          <div class="space-y-4">
            <div
              v-for="puja in pujasWithDetails"
              :key="puja.id"
              class="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all p-5"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <div class="flex items-center gap-4">
                    <div class="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      <Car :size="28" class="text-slate-400" />
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-2">
                        <h3 class="text-lg font-black text-slate-900">
                          {{ puja.auto.marca }} {{ puja.auto.modelo }} {{ puja.auto.anio }}
                        </h3>
                        <span
                          v-if="puja.esLider"
                          class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-100 text-green-700 uppercase tracking-wide"
                        >
                          Liderando
                        </span>
                        <span
                          v-else
                          class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-yellow-100 text-yellow-700 uppercase tracking-wide"
                        >
                          Superado
                        </span>
                      </div>
                      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div class="p-2.5 bg-slate-50 rounded-lg">
                          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-0.5">Mi Puja</p>
                          <p class="text-base font-black text-blue-600">${{ formatPrice(puja.miPuja) }}</p>
                        </div>
                        <div class="p-2.5 bg-slate-50 rounded-lg">
                          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-0.5">Puja Actual</p>
                          <p class="text-xs font-black text-slate-900">${{ formatPrice(puja.pujaActual) }}</p>
                        </div>
                        <div class="p-2.5 bg-slate-50 rounded-lg">
                          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-0.5">Diferencia</p>
                          <p class="text-xs font-black" :class="puja.diferencia >= 0 ? 'text-green-600' : 'text-red-600'">
                            {{ puja.diferencia >= 0 ? '+' : '' }}${{ formatPrice(Math.abs(puja.diferencia)) }}
                          </p>
                        </div>
                        <div class="p-2.5 bg-slate-50 rounded-lg">
                          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-0.5">Finaliza</p>
                          <p class="text-xs font-black text-slate-900">{{ formatDate(puja.fechaFin) }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <button
                    @click="viewRemate(puja)"
                    class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-bold whitespace-nowrap"
                  >
                    Ver Remate
                  </button>
                  <button
                    v-if="!puja.esLider"
                    @click="actualizarPuja(puja)"
                    class="px-5 py-2.5 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-xs font-bold whitespace-nowrap"
                  >
                    Pujar Más
                  </button>
                </div>
              </div>
            </div>
            <div v-if="pujasWithDetails.length === 0" class="text-center py-12">
              <p class="text-slate-400 font-medium text-xs">No tienes pujas activas</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { HandCoins, Trophy, DollarSign, CheckCircle, Car } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'
import { navigateTo } from 'nuxt/app'

const { getAuthHeaders, user } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const loading = ref(false)
const error = ref(null)
const stats = ref({
  pujasActivas: 0,
  autosGanados: 0,
  totalInvertido: 0,
  pujasLiderando: 0,
  pujasActivasRecientes: []
})
const pujas = ref([])

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['dealer']
})

const loadPujas = async () => {
  loading.value = true
  error.value = null
  try {
    // Cargar estadísticas
    const statsResponse = await $fetch(`${API_BASE}/stats/dealer`, {
      headers: getAuthHeaders()
    })
    stats.value = statsResponse
    
    // Cargar pujas activas con detalles del auto
    pujas.value = await Promise.all(
      statsResponse.pujasActivasRecientes.map(async (puja) => {
        // Obtener la puja más alta del auto para comparar
        const todasLasPujasAuto = await $fetch(`${API_BASE}/remates?autoId=${puja.auto.id}`, {
          headers: getAuthHeaders()
        })
        
        const pujaMasAlta = todasLasPujasAuto.length > 0 
          ? todasLasPujasAuto.reduce((max, p) => 
              parseFloat(p.monto || 0) > parseFloat(max.monto || 0) ? p : max
            )
          : { monto: 0 }
        
        return {
          id: puja.id,
          auto: puja.auto,
          miPuja: parseFloat(puja.monto || 0),
          pujaActual: parseFloat(pujaMasAlta?.monto || puja.monto || 0),
          fechaFin: puja.fechaFinRemate,
          esLider: parseFloat(puja.monto || 0) >= parseFloat(pujaMasAlta?.monto || 0)
        }
      })
    )
  } catch (err) {
    console.error('Error cargando pujas:', err)
    error.value = err.data?.message || 'Error al cargar las pujas'
  } finally {
    loading.value = false
  }
}

const pujasWithDetails = computed(() => {
  return pujas.value.map(puja => ({
    ...puja,
    diferencia: puja.pujaActual - puja.miPuja
  }))
})

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('es-CL').format(price)
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

const viewRemate = (puja) => {
  navigateTo(`/dealer/remates-live-${puja.auto.id}`)
}

const actualizarPuja = (puja) => {
  navigateTo(`/dealer/remates-live-${puja.auto.id}`)
}

onMounted(() => {
  loadPujas()
})
</script>
