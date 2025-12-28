<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Mis Peritajes</h1>
        <p class="text-gray-600 mt-2">Gestiona todos tus peritajes de revisión precompra</p>
      </div>
      <button
        @click="handleNuevoPeritaje"
        class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
      >
        <PlusCircle :size="20" />
        <span>Nuevo Peritaje</span>
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Patente, marca, modelo..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            v-model="filterEstado"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Todos</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN_PROCESO">En Proceso</option>
            <option value="FINALIZADO">Finalizado</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Mensaje de Error -->
    <div v-if="error" class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <!-- Lista de Peritajes -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Cargando peritajes...</p>
    </div>
    <div v-else-if="filteredPeritajes.length === 0" class="text-center py-12">
      <p class="text-gray-500 mb-4">No se encontraron peritajes</p>
      <button
        @click="handleNuevoPeritaje"
        class="inline-block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
      >
        Crear Primer Peritaje
      </button>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PeritajeCard
        v-for="peritaje in filteredPeritajes"
        :key="peritaje.id"
        :peritaje="peritaje"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { PlusCircle } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'
import PeritajeCard from '~/components/PeritajeCard.vue'

const { getAuthHeaders, user } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const searchQuery = ref('')
const filterEstado = ref('')
const peritajes = ref([])
const loading = ref(false)
const error = ref(null)

const filteredPeritajes = computed(() => {
  return peritajes.value.filter(peritaje => {
    const matchesSearch = !searchQuery.value || 
      peritaje.patente?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      peritaje.marca?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      peritaje.modelo?.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesEstado = !filterEstado.value || peritaje.estado === filterEstado.value
    
    return matchesSearch && matchesEstado
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  filterEstado.value = ''
}

const handleNuevoPeritaje = () => {
  navigateTo('/perito/peritajes/nuevo')
}

const loadPeritajes = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE}/peritajes`, {
      headers: getAuthHeaders()
    })
    peritajes.value = response
  } catch (err) {
    console.error('Error cargando peritajes:', err)
    error.value = err.data?.message || 'Error al cargar peritajes'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPeritajes()
})

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['perito']
})
</script>

