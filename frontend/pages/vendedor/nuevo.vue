<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Subastar un Auto</h1>
      <p class="text-gray-600 mt-2">Ingresa los datos de tu auto para publicarlo en remate</p>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <form class="space-y-6">
        <!-- Datos del Auto -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Datos del Vehículo</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Patente <span class="text-red-500">*</span></label>
              <input
                v-model="form.patente"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ej: ABCD12"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Marca</label>
              <input
                v-model="form.marca"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ej: Toyota"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
              <input
                v-model="form.modelo"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ej: Corolla"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Año</label>
              <input
                v-model="form.anio"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ej: 2020"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kilometraje</label>
              <input
                v-model="form.kilometraje"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ej: 45000"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Transmisión</label>
              <select
                v-model="form.transmision"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Selecciona</option>
                <option value="Manual">Manual</option>
                <option value="Automático">Automático</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Combustible</label>
              <select
                v-model="form.combustible"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Selecciona</option>
                <option value="Bencina">Bencina</option>
                <option value="Diésel">Diésel</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Eléctrico">Eléctrico</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Detalles del Remate -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Detalles del Remate</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Precio Base</label>
              <input
                v-model="form.precioBase"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ej: 8500000"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Precio Esperado</label>
              <input
                v-model="form.precioEsperado"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ej: 9500000"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
              <input
                v-model="form.fechaInicio"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Término</label>
              <input
                v-model="form.fechaFin"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        <!-- Descripción -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Descripción</h2>
          <textarea
            v-model="form.descripcion"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Describe el estado del auto, mantenciones, historial, etc."
          ></textarea>
        </div>

        <!-- Botones -->
        <div class="flex justify-end space-x-3">
          <NuxtLink
            to="/vendedor/autos"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </NuxtLink>
          <button
            type="button"
            class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            @click="submitForm"
          >
            Publicar Auto
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { navigateTo } from 'nuxt/app'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['vendedor']
})

const { getAuthHeaders } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const loading = ref(false)
const error = ref(null)

const form = ref({
  patente: '',
  marca: '',
  modelo: '',
  anio: '',
  kilometraje: '',
  transmision: '',
  combustible: '',
  precioBase: '',
  precioEsperado: '',
  fechaInicio: '',
  fechaFin: '',
  descripcion: ''
})

const submitForm = async () => {
  if (!form.value.patente) {
    alert('La patente es requerida')
    return
  }

  loading.value = true
  error.value = null

  try {
    // Preparar datos para enviar
    const autoData = {
      patente: form.value.patente.toUpperCase().trim(),
      marca: form.value.marca,
      modelo: form.value.modelo,
      anio: form.value.anio ? parseInt(form.value.anio) : null,
      kilometraje: form.value.kilometraje ? parseInt(form.value.kilometraje) : null,
      transmision: form.value.transmision,
      combustible: form.value.combustible,
      precioBase: form.value.precioBase ? parseFloat(form.value.precioBase) : null,
      precioEsperado: form.value.precioEsperado ? parseFloat(form.value.precioEsperado) : null,
      fechaInicioRemate: form.value.fechaInicio || null,
      fechaFinRemate: form.value.fechaFin || null,
      descripcion: form.value.descripcion,
      estado: 'pendiente' // El auto se crea como pendiente para que el admin lo apruebe
    }

    const response = await $fetch(`${API_BASE}/autos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: autoData
    })

    alert('Auto creado exitosamente. Estará pendiente de aprobación por el administrador.')
    navigateTo('/vendedor/autos')
  } catch (err) {
    console.error('Error creando auto:', err)
    error.value = err.data?.message || 'Error al crear el auto'
    alert(error.value)
  } finally {
    loading.value = false
  }
}
</script>
