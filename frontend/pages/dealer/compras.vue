<template>
  <div class="min-h-screen pb-20 bg-slate-50">
    <!-- Main Content -->
    <main>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header class="mb-6">
          <div>
            <h2 class="text-3xl font-black text-slate-900 mb-1">Mis Compras</h2>
            <p class="text-sm text-slate-500">
              Historial de todas tus compras
            </p>
          </div>
        </header>

        <div v-if="loading" class="text-center py-12">
          <p class="text-slate-400 font-medium text-xs">Cargando compras...</p>
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
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1">Total Compras</p>
                  <p class="text-2xl font-black text-slate-900">{{ stats.autosGanados }}</p>
                </div>
                <div class="bg-blue-50 p-2 rounded-lg">
                  <ShoppingCart :size="20" class="text-blue-600" />
                </div>
              </div>
            </div>
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1">Total Invertido</p>
                  <p class="text-2xl font-black text-slate-900">${{ formatPrice(totalInvertido) }}</p>
                </div>
                <div class="bg-green-50 p-2 rounded-lg">
                  <DollarSign :size="20" class="text-green-600" />
                </div>
              </div>
            </div>
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1">Este Año</p>
                  <p class="text-2xl font-black text-slate-900">{{ autosEsteAnio }}</p>
                </div>
                <div class="bg-purple-50 p-2 rounded-lg">
                  <Calendar :size="20" class="text-purple-600" />
                </div>
              </div>
            </div>
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1">Promedio Compra</p>
                  <p class="text-2xl font-black text-slate-900">${{ formatPrice(promedioCompra) }}</p>
                </div>
                <div class="bg-orange-50 p-2 rounded-lg">
                  <TrendingUp :size="20" class="text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          <!-- Lista de Compras -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Vehículo
                    </th>
                    <th class="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Fecha Compra
                    </th>
                    <th class="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Precio Final
                    </th>
                    <th class="px-4 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-slate-200">
                  <tr v-for="compra in compras" :key="compra.id" class="hover:bg-slate-50 transition-colors">
                    <td class="px-4 py-3 whitespace-nowrap">
                      <div class="flex items-center gap-3">
                        <div class="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          <Car :size="20" class="text-slate-400" />
                        </div>
                        <div>
                          <div class="text-xs font-black text-slate-900">
                            {{ compra.auto.marca }} {{ compra.auto.modelo }} {{ compra.auto.anio }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-xs text-slate-600 font-semibold">
                      {{ formatDate(compra.fechaGanado) }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <div class="text-xs font-black text-green-600">${{ formatPrice(compra.precioFinal) }}</div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-right text-xs font-semibold">
                      <div class="flex justify-end gap-2">
                        <button
                          @click="viewCompra(compra)"
                          class="text-blue-600 hover:text-blue-700 transition-colors font-bold"
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-if="compras.length === 0" class="text-center py-12">
            <p class="text-slate-400 font-medium text-xs">No tienes compras registradas</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ShoppingCart, DollarSign, Calendar, TrendingUp, Car } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'
import { navigateTo } from 'nuxt/app'

const { getAuthHeaders } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const loading = ref(false)
const error = ref(null)
const stats = ref({
  autosGanados: 0,
  autosGanadosRecientes: []
})
const compras = ref([])

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['dealer']
})

const totalInvertido = computed(() => {
  return compras.value.reduce((sum, compra) => sum + parseFloat(compra.precioFinal || 0), 0)
})

const autosEsteAnio = computed(() => {
  const ahora = new Date()
  const inicioAnio = new Date(ahora.getFullYear(), 0, 1)
  return compras.value.filter(compra => {
    const fechaGanado = new Date(compra.fechaGanado)
    return fechaGanado >= inicioAnio
  }).length
})

const promedioCompra = computed(() => {
  if (compras.value.length === 0) return 0
  return totalInvertido.value / compras.value.length
})

const loadCompras = async () => {
  loading.value = true
  error.value = null
  try {
    const statsResponse = await $fetch(`${API_BASE}/stats/dealer`, {
      headers: getAuthHeaders()
    })
    stats.value = statsResponse
    compras.value = statsResponse.autosGanadosRecientes || []
  } catch (err) {
    console.error('Error cargando compras:', err)
    error.value = err.data?.message || 'Error al cargar las compras'
  } finally {
    loading.value = false
  }
}

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('es-CL').format(price)
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const viewCompra = (compra) => {
  navigateTo(`/dealer/remates-live-${compra.auto.id}`)
}

onMounted(() => {
  loadCompras()
})
</script>
