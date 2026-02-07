<template>
  <div class="min-h-screen pb-20 bg-slate-50">
    <!-- Main Content -->
    <main>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header class="mb-6">
          <div>
            <h2 class="text-3xl font-black text-slate-900 mb-1">Mi Dashboard</h2>
            <p class="text-sm text-slate-500">
              Bienvenido, <span v-if="user" class="font-semibold text-slate-900">{{ user.nombre }}</span><span v-else>Cargando...</span>
            </p>
          </div>
        </header>

        <div v-if="loading" class="text-center py-12">
          <p class="text-slate-400 font-medium text-sm">Cargando estadísticas...</p>
        </div>

        <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl mb-4 text-sm">
          {{ error }}
        </div>

        <div v-else>
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1">Pujas Activas</p>
                  <p class="text-2xl font-black text-slate-900">{{ stats.pujasActivas }}</p>
                </div>
                <div class="bg-blue-50 p-2 rounded-lg">
                  <Gavel :size="20" class="text-blue-600" />
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1">Autos Ganados</p>
                  <p class="text-2xl font-black text-slate-900">{{ stats.autosGanados }}</p>
                </div>
                <div class="bg-yellow-50 p-2 rounded-lg">
                  <Trophy :size="20" class="text-yellow-600" />
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1">Total Invertido</p>
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
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1">Liderando</p>
                  <p class="text-2xl font-black text-slate-900">{{ stats.pujasLiderando }}</p>
                </div>
                <div class="bg-purple-50 p-2 rounded-lg">
                  <CheckCircle :size="20" class="text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-black text-slate-900">Pujas Activas</h3>
                <NuxtLink
                  to="/dealer/pujas"
                  class="text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wide"
                >
                  Ver todos →
                </NuxtLink>
              </div>
              <div class="space-y-2">
                <div
                  v-for="puja in stats.pujasActivasRecientes"
                  :key="puja.id"
                  class="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div class="flex-1">
                    <p class="font-bold text-slate-900 text-sm mb-0.5">
                      {{ puja.auto.marca }} {{ puja.auto.modelo }} {{ puja.auto.anio }}
                    </p>
                    <p class="text-xs text-slate-500">Mi puja: ${{ formatPrice(puja.monto) }}</p>
                  </div>
                  <span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">
                    Activa
                  </span>
                </div>
                <div v-if="stats.pujasActivasRecientes.length === 0" class="text-center py-4 text-slate-400 text-sm">
                  No tienes pujas activas
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 class="text-lg font-black text-slate-900 mb-4">Autos Ganados</h3>
              <div class="space-y-2">
                <div
                  v-for="auto in stats.autosGanadosRecientes"
                  :key="auto.id"
                  class="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200"
                >
                  <p class="font-bold text-slate-900 text-sm mb-0.5">
                    {{ auto.auto.marca }} {{ auto.auto.modelo }} {{ auto.auto.anio }}
                  </p>
                  <p class="text-xs text-slate-600 mb-1">Precio final: ${{ formatPrice(auto.precioFinal) }}</p>
                  <div class="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <CheckCircle :size="12" class="text-green-600" />
                    <span>Ganado {{ formatDate(auto.fechaGanado) }}</span>
                  </div>
                </div>
                <div v-if="stats.autosGanadosRecientes.length === 0" class="text-center py-4 text-slate-400 text-sm">
                  Aún no has ganado ningún auto
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Gavel, Trophy, DollarSign, CheckCircle } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

const { user, checkAuth, getAuthHeaders } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const loading = ref(false)
const error = ref(null)
const stats = ref({
  pujasActivas: 0,
  autosGanados: 0,
  totalInvertido: 0,
  pujasLiderando: 0,
  pujasActivasRecientes: [],
  autosGanadosRecientes: []
})

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['dealer']
})

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('es-CL').format(price)
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  const fecha = new Date(date)
  const ahora = new Date()
  const diffTime = Math.abs(ahora - fecha)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'hoy'
  if (diffDays === 2) return 'ayer'
  if (diffDays <= 7) return `hace ${diffDays - 1} días`
  
  return fecha.toLocaleDateString('es-CL', {
    month: 'short',
    day: 'numeric'
  })
}

const loadStats = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE}/stats/dealer`, {
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

onMounted(async () => {
  if (process.client) {
    console.log('📄 Dashboard dealer montado')
    await checkAuth()
    console.log('👤 Usuario en dashboard:', user.value)
    await loadStats()
  }
})
</script>
