<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Mis Remates</h1>
      <p class="text-gray-600 mt-2">Revisa el estado de los remates de tus autos</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Cargando remates...</p>
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
            <p class="text-sm text-gray-600">Activos</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.activos }}</p>
          </div>
          <Gavel :size="32" class="text-orange-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Finalizados</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.finalizados }}</p>
          </div>
          <CheckCircle :size="32" class="text-green-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Pujas Totales</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.totalPujas }}</p>
          </div>
          <HandCoins :size="32" class="text-blue-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Monto Ofertado</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">${{ formatPrice(stats.montoOfertado) }}</p>
          </div>
          <DollarSign :size="32" class="text-green-500" />
        </div>
      </div>
    </div>

    <!-- Lista de Remates -->
    <div v-if="!loading && !error" class="space-y-4">
      <div
        v-for="remate in remates"
        :key="remate.id"
        class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <h3 class="text-lg font-bold text-gray-900">
                {{ remate.marca }} {{ remate.modelo }} {{ remate.anio }}
              </h3>
              <span
                :class="[
                  'px-2 py-1 text-xs font-semibold rounded-full',
                  getStatusBadgeClass(remate.estado)
                ]"
              >
                {{ formatStatus(remate.estado) }}
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-2">
              {{ remate.kilometraje ? `${formatNumber(remate.kilometraje)} km` : '' }} 
              {{ remate.transmision ? `• ${remate.transmision}` : '' }}
            </p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <div>
                <p class="text-xs text-gray-500">Precio Base</p>
                <p class="text-sm font-medium text-gray-900">${{ formatPrice(remate.precioBase) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Puja Actual</p>
                <p class="text-sm font-medium text-orange-600">${{ formatPrice(remate.pujaActual) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Pujas</p>
                <p class="text-sm font-medium text-gray-900">{{ remate.totalPujas }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Finaliza</p>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(remate.fechaFin) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="remates.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
        <Gavel :size="48" class="text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 text-lg">No tienes remates registrados</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Gavel, CheckCircle, HandCoins, DollarSign } from 'lucide-vue-next'
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
const remates = ref([])

const stats = computed(() => {
  const ahora = new Date()
  const activos = remates.value.filter(r => {
    if (r.estado !== 'en_remate') return false
    if (r.fechaFin && new Date(r.fechaFin) > ahora) return true
    return false
  })
  const finalizados = remates.value.filter(r => r.estado === 'vendido' || (r.fechaFin && new Date(r.fechaFin) <= ahora))
  const totalPujas = remates.value.reduce((sum, r) => sum + (r.totalPujas || 0), 0)
  const montoOfertado = remates.value.reduce((sum, r) => sum + parseFloat(r.pujaActual || r.precioBase || 0), 0)
  
  return {
    activos: activos.length,
    finalizados: finalizados.length,
    totalPujas,
    montoOfertado
  }
})

const formatStatus = (estado) => {
  const status = {
    en_remate: 'Activo',
    pendiente: 'Pendiente',
    vendido: 'Finalizado',
    finalizado: 'Finalizado',
    cancelado: 'Cancelado'
  }
  return status[estado] || estado
}

const getStatusBadgeClass = (estado) => {
  const classes = {
    en_remate: 'bg-green-100 text-green-800',
    pendiente: 'bg-yellow-100 text-yellow-800',
    vendido: 'bg-gray-100 text-gray-800',
    finalizado: 'bg-gray-100 text-gray-800',
    cancelado: 'bg-red-100 text-red-800'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800'
}

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('es-CL').format(Math.round(price))
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
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadRemates = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE}/autos`, {
      headers: getAuthHeaders()
    })
    
    // Filtrar solo autos que hayan estado o estén en remate
    const autosConRemate = (response || []).filter(a => 
      a.estado === 'en_remate' || a.estado === 'vendido' || a.fechaInicioRemate
    )
    
    // Obtener pujas para cada auto
    for (const auto of autosConRemate) {
      try {
        const pujas = await $fetch(`${API_BASE}/remates?autoId=${auto.id}`, {
          headers: getAuthHeaders()
        })
        auto.totalPujas = pujas.length
        if (pujas.length > 0) {
          const pujaMasAlta = pujas.reduce((max, p) => parseFloat(p.monto) > parseFloat(max.monto) ? p : max, pujas[0])
          auto.pujaActual = parseFloat(pujaMasAlta.monto)
        } else {
          auto.pujaActual = parseFloat(auto.precioBase || 0)
        }
      } catch (err) {
        console.warn(`Error cargando pujas para auto ${auto.id}:`, err)
        auto.totalPujas = 0
        auto.pujaActual = parseFloat(auto.precioBase || 0)
      }
    }
    
    remates.value = autosConRemate.map(auto => ({
      id: auto.id,
      marca: auto.marca || 'Sin marca',
      modelo: auto.modelo || 'Sin modelo',
      anio: auto.anio || 'N/A',
      kilometraje: auto.kilometraje,
      transmision: auto.transmision,
      precioBase: parseFloat(auto.precioBase || 0),
      pujaActual: auto.pujaActual || parseFloat(auto.precioBase || 0),
      totalPujas: auto.totalPujas || 0,
      estado: auto.estado,
      fechaFin: auto.fechaFinRemate
    })).sort((a, b) => {
      // Ordenar: activos primero, luego por fecha
      if (a.estado === 'en_remate' && b.estado !== 'en_remate') return -1
      if (a.estado !== 'en_remate' && b.estado === 'en_remate') return 1
      return new Date(b.fechaFin || 0) - new Date(a.fechaFin || 0)
    })
  } catch (err) {
    console.error('Error cargando remates:', err)
    error.value = err.data?.message || 'Error al cargar los remates'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRemates()
})
</script>
