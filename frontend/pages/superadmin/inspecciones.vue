<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Inspecciones</h1>
      <p class="text-gray-600 mt-2">Gestiona todas las inspecciones de vehículos</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 mb-6">
      <p class="text-gray-500">Cargando inspecciones...</p>
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
            <p class="text-sm text-gray-600">Pendientes</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.pendientes }}</p>
          </div>
          <Clock :size="32" class="text-yellow-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Aprobadas</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.aprobadas }}</p>
          </div>
          <CheckCircle :size="32" class="text-green-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Rechazadas</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.rechazadas }}</p>
          </div>
          <XCircle :size="32" class="text-red-500" />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Este Mes</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.esteMes }}</p>
          </div>
          <Calendar :size="32" class="text-blue-500" />
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Auto, inspector..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            v-model="filterStatus"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Todos</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN_PROCESO">En Proceso</option>
            <option value="FINALIZADO">Finalizado</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input
            type="date"
            v-model="filterDate"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
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

    <!-- Tabla de Inspecciones -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehículo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inspector
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Calificación
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="inspeccion in filteredInspecciones" :key="inspeccion.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    <Car v-if="!getFirstImage(inspeccion.auto)" :size="24" class="text-gray-400" />
                    <img
                      v-else
                      :src="getImageUrl(getFirstImage(inspeccion.auto))"
                      :alt="inspeccion.auto.marca + ' ' + inspeccion.auto.modelo"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ inspeccion.auto.marca || 'N/A' }} {{ inspeccion.auto.modelo || '' }} {{ inspeccion.auto.anio || '' }}
                    </div>
                    <div class="text-sm text-gray-500">{{ inspeccion.auto.patente || 'Sin patente' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ inspeccion.inspector }}</div>
                <div class="text-sm text-gray-500">{{ inspeccion.inspectorEmail }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(inspeccion.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-semibold rounded-full',
                    getStatusBadgeClass(inspeccion.estado)
                  ]"
                >
                  {{ formatStatus(inspeccion.estado) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-sm font-medium text-gray-900">{{ inspeccion.calificacion }}/10</span>
                  <div class="ml-2 w-20 bg-gray-200 rounded-full h-2">
                    <div
                      :class="[
                        'h-2 rounded-full',
                        inspeccion.calificacion >= 7 ? 'bg-green-500' : inspeccion.calificacion >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                      ]"
                      :style="{ width: (inspeccion.calificacion / 10) * 100 + '%' }"
                    ></div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="viewInspeccion(inspeccion)"
                    class="text-orange-600 hover:text-orange-900"
                    title="Ver Detalles"
                  >
                    <Eye :size="18" />
                  </button>
                  <button
                    v-if="inspeccion.estado === 'PENDIENTE' || inspeccion.estado === 'EN_PROCESO'"
                    @click="approveInspeccion(inspeccion)"
                    class="text-green-600 hover:text-green-900"
                    title="Aprobar"
                  >
                    <CheckCircle :size="18" />
                  </button>
                  <button
                    v-if="inspeccion.estado === 'PENDIENTE' || inspeccion.estado === 'EN_PROCESO'"
                    @click="rejectInspeccion(inspeccion)"
                    class="text-red-600 hover:text-red-900"
                    title="Rechazar"
                  >
                    <XCircle :size="18" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Anterior
          </button>
          <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Siguiente
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Mostrando <span class="font-medium">1</span> a <span class="font-medium">10</span> de
              <span class="font-medium">{{ filteredInspecciones.length }}</span> resultados
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Clock, CheckCircle, XCircle, Calendar, Car, Eye } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'
import { useImageUrl } from '~/composables/useImageUrl'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['superadmin']
})

const { getAuthHeaders } = useAuth()
const { getImageUrl: getImageUrlHelper } = useImageUrl()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const searchQuery = ref('')
const filterStatus = ref('')
const filterDate = ref('')
const inspecciones = ref([])
const loading = ref(false)
const error = ref(null)
const stats = ref({
  pendientes: 0,
  aprobadas: 0,
  rechazadas: 0,
  esteMes: 0
})

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  return getImageUrlHelper(imagePath)
}

const getFirstImage = (auto) => {
  if (!auto || !auto.imagenes) return null
  let imagenes = []
  if (Array.isArray(auto.imagenes)) {
    imagenes = auto.imagenes
  } else if (typeof auto.imagenes === 'string') {
    try {
      imagenes = JSON.parse(auto.imagenes)
    } catch (e) {
      imagenes = [auto.imagenes]
    }
  }
  return imagenes.length > 0 ? imagenes[0] : null
}

const filteredInspecciones = computed(() => {
  return inspecciones.value.filter(inspeccion => {
    const matchesSearch = !searchQuery.value ||
      `${inspeccion.auto?.marca || ''} ${inspeccion.auto?.modelo || ''}`.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      inspeccion.perito?.nombre?.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = !filterStatus.value || inspeccion.estado === filterStatus.value
    
    const matchesDate = !filterDate.value || 
      new Date(inspeccion.createdAt).toISOString().split('T')[0] === filterDate.value
    
    return matchesSearch && matchesStatus && matchesDate
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  filterDate.value = ''
}

const formatStatus = (estado) => {
  const status = {
    PENDIENTE: 'Pendiente',
    EN_PROCESO: 'En Proceso',
    FINALIZADO: 'Finalizado',
    aprobada: 'Aprobada',
    rechazada: 'Rechazada'
  }
  return status[estado] || estado
}

const getStatusBadgeClass = (estado) => {
  const classes = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800',
    EN_PROCESO: 'bg-blue-100 text-blue-800',
    FINALIZADO: 'bg-green-100 text-green-800',
    aprobada: 'bg-green-100 text-green-800',
    rechazada: 'bg-red-100 text-red-800'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const loadInspecciones = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE}/peritajes`, {
      headers: getAuthHeaders()
    })
    
    // Obtener información del auto para cada peritaje
    const inspeccionesConAuto = await Promise.all(
      (response || []).map(async (peritaje) => {
        try {
          const auto = await $fetch(`${API_BASE}/autos/${peritaje.autoId}`, {
            headers: getAuthHeaders()
          })
          return {
            id: peritaje.id,
            auto: auto || {},
            perito: peritaje.perito || {},
            inspector: peritaje.perito?.nombre || 'N/A',
            inspectorEmail: peritaje.perito?.email || 'N/A',
            fecha: peritaje.createdAt,
            createdAt: peritaje.createdAt,
            estado: peritaje.estado || 'PENDIENTE',
            calificacion: peritaje.calificacion || 0
          }
        } catch (err) {
          console.warn(`Error cargando auto para peritaje ${peritaje.id}:`, err)
          return {
            id: peritaje.id,
            auto: {},
            perito: peritaje.perito || {},
            inspector: peritaje.perito?.nombre || 'N/A',
            inspectorEmail: peritaje.perito?.email || 'N/A',
            fecha: peritaje.createdAt,
            createdAt: peritaje.createdAt,
            estado: peritaje.estado || 'PENDIENTE',
            calificacion: peritaje.calificacion || 0
          }
        }
      })
    )
    
    inspecciones.value = inspeccionesConAuto
    
    // Calcular estadísticas
    const ahora = new Date()
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
    
    stats.value = {
      pendientes: inspecciones.value.filter(i => i.estado === 'PENDIENTE').length,
      aprobadas: inspecciones.value.filter(i => i.estado === 'FINALIZADO').length,
      rechazadas: inspecciones.value.filter(i => i.estado === 'rechazada').length,
      esteMes: inspecciones.value.filter(i => {
        const fecha = new Date(i.createdAt)
        return fecha >= inicioMes
      }).length
    }
  } catch (err) {
    console.error('Error cargando inspecciones:', err)
    error.value = err.data?.message || 'Error al cargar las inspecciones'
  } finally {
    loading.value = false
  }
}

const viewInspeccion = (inspeccion) => {
  console.log('Ver inspección:', inspeccion)
  // TODO: Navegar a página de detalles
}

const approveInspeccion = async (inspeccion) => {
  try {
    await $fetch(`${API_BASE}/peritajes/${inspeccion.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: { estado: 'FINALIZADO' }
    })
    await loadInspecciones()
  } catch (err) {
    console.error('Error aprobando inspección:', err)
    alert(err.data?.message || 'Error al aprobar la inspección')
  }
}

const rejectInspeccion = async (inspeccion) => {
  if (!confirm('¿Estás seguro de rechazar esta inspección?')) return
  try {
    await $fetch(`${API_BASE}/peritajes/${inspeccion.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: { estado: 'rechazada' }
    })
    await loadInspecciones()
  } catch (err) {
    console.error('Error rechazando inspección:', err)
    alert(err.data?.message || 'Error al rechazar la inspección')
  }
}

onMounted(() => {
  loadInspecciones()
})
</script>










