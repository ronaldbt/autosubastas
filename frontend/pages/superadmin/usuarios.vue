<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Usuarios</h1>
        <p class="text-gray-600 mt-2">Gestiona todos los usuarios del sistema</p>
      </div>
      <button class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2">
        <PlusCircle :size="20" />
        <span>Nuevo Usuario</span>
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Nombre, email..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
          <select
            v-model="filterRole"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Todos</option>
            <option value="superadmin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="vendedor">Vendedor</option>
            <option value="dealer">Dealer</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            v-model="filterStatus"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Todos</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
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

    <!-- Tabla de Usuarios -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-12 text-center">
        <p class="text-gray-500">Cargando usuarios...</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Registro
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="filteredUsers.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                No se encontraron usuarios
              </td>
            </tr>
            <tr v-for="usuario in filteredUsers" :key="usuario.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span class="text-orange-600 font-semibold text-sm">
                      {{ usuario.nombre?.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ usuario.nombre }}</div>
                    <div class="text-sm text-gray-500">{{ usuario.telefono || 'Sin teléfono' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ usuario.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-semibold rounded-full',
                    getRoleBadgeClass(usuario.rol)
                  ]"
                >
                  {{ formatRole(usuario.rol) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-semibold rounded-full',
                    usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ usuario.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(usuario.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="editUser(usuario)"
                    class="text-orange-600 hover:text-orange-900"
                    title="Editar"
                  >
                    <Settings :size="18" />
                  </button>
                  <button
                    @click="toggleUserStatus(usuario)"
                    :class="usuario.activo ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                    :title="usuario.activo ? 'Desactivar' : 'Activar'"
                  >
                    <UserCheck :size="18" />
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
              <span class="font-medium">{{ filteredUsers.length }}</span> resultados
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { PlusCircle, Settings, UserCheck } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['superadmin']
})

const { user, getAuthHeaders } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const searchQuery = ref('')
const filterRole = ref('')
const filterStatus = ref('')
const usuarios = ref([])
const loading = ref(false)
const error = ref(null)

const filteredUsers = computed(() => {
  return usuarios.value.filter(usuario => {
    const matchesSearch = !searchQuery.value || 
      usuario.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesRole = !filterRole.value || usuario.rol === filterRole.value
    const matchesStatus = !filterStatus.value || 
      (filterStatus.value === 'activo' && usuario.activo) ||
      (filterStatus.value === 'inactivo' && !usuario.activo)
    
    return matchesSearch && matchesRole && matchesStatus
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  filterRole.value = ''
  filterStatus.value = ''
}

const formatRole = (rol) => {
  const roles = {
    superadmin: 'Super Admin',
    admin: 'Admin',
    vendedor: 'Vendedor',
    dealer: 'Dealer'
  }
  return roles[rol] || rol
}

const getRoleBadgeClass = (rol) => {
  const classes = {
    superadmin: 'bg-purple-100 text-purple-800',
    admin: 'bg-blue-100 text-blue-800',
    vendedor: 'bg-green-100 text-green-800',
    dealer: 'bg-orange-100 text-orange-800'
  }
  return classes[rol] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Cargar usuarios desde la API
const loadUsuarios = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE}/usuarios`, {
      headers: getAuthHeaders()
    })
    usuarios.value = response.map(u => ({
      ...u,
      createdAt: u.createdAt ? new Date(u.createdAt) : null
    }))
  } catch (err) {
    console.error('Error cargando usuarios:', err)
    error.value = err.data?.message || 'Error al cargar usuarios'
  } finally {
    loading.value = false
  }
}

const editUser = async (usuario) => {
  // Por ahora solo log, se puede implementar un modal después
  console.log('Editar usuario:', usuario)
  // TODO: Implementar modal de edición
}

const toggleUserStatus = async (usuario) => {
  try {
    const nuevoEstado = !usuario.activo
    const response = await $fetch(`${API_BASE}/usuarios/${usuario.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: {
        activo: nuevoEstado
      }
    })
    
    // Actualizar el usuario en la lista
    const index = usuarios.value.findIndex(u => u.id === usuario.id)
    if (index !== -1) {
      usuarios.value[index] = {
        ...usuarios.value[index],
        activo: response.activo
      }
    }
  } catch (err) {
    console.error('Error actualizando estado:', err)
    error.value = err.data?.message || 'Error al actualizar estado del usuario'
  }
}

onMounted(() => {
  loadUsuarios()
})
</script>

