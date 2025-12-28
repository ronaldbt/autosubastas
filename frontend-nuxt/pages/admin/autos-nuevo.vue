<template>
  <div>
    <div class="mb-6 flex items-center space-x-4">
      <button
        @click="navigateTo('/admin/autos')"
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ArrowLeft :size="24" class="text-gray-600" />
      </button>
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Nuevo Auto</h1>
        <p class="text-gray-600 mt-2">Agrega un nuevo vehículo al sistema</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow p-6 space-y-6">
      <!-- Datos del Auto -->
      <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Datos del Vehículo</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Patente</label>
            <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
              <input
                v-model="form.patente"
                type="text"
                maxlength="8"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 uppercase"
                placeholder="Ej: ABCD12"
              />
              <button
                type="button"
                @click="buscarPorPatente"
                :disabled="isSearchingPatente || !form.patente"
                class="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center space-x-2"
              >
                <span v-if="isSearchingPatente">Buscando...</span>
                <span v-else>Buscar por patente</span>
              </button>
            </div>
            <p class="mt-1 text-xs text-gray-500">
              Intentará rellenar marca, modelo, año y color usando un servicio externo por patente (Chile).
            </p>
            <div v-if="patenteInfo" class="mt-3 border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h4 class="font-semibold text-blue-900">Información encontrada para {{ patenteInfo.patente }}</h4>
                </div>
                <span class="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full">{{ patenteInfo.fuente }}</span>
              </div>
              
              <div v-if="patenteInfo.auto" class="mb-3">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-900 mb-2">🚗 Datos del vehículo:</p>
                    <div class="grid grid-cols-2 gap-2 text-sm">
                      <div><span class="text-gray-600">Marca:</span> <span class="font-medium">{{ patenteInfo.auto.marca }}</span></div>
                      <div><span class="text-gray-600">Modelo:</span> <span class="font-medium">{{ patenteInfo.auto.modelo }}</span></div>
                      <div><span class="text-gray-600">Año:</span> <span class="font-medium">{{ patenteInfo.auto.anio }}</span></div>
                      <div><span class="text-gray-600">Color:</span> <span class="font-medium">{{ patenteInfo.auto.color }}</span></div>
                    </div>
                  </div>
                  <button
                    @click="aplicarDatosPatente"
                    class="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                    title="Aplicar datos al formulario"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Aplicar</span>
                  </button>
                </div>
              </div>
              
              <div v-if="patenteInfo.propietario" class="text-sm border-t pt-2 border-blue-200">
                <p class="font-medium text-gray-900 mb-1">👤 Propietario registrado (referencial):</p>
                <div class="text-gray-700">
                  <span class="font-medium">{{ patenteInfo.propietario.nombre }}</span>
                  <span class="mx-1">•</span>
                  <span>{{ patenteInfo.propietario.rut }}</span>
                  <span v-if="patenteInfo.propietario.direccion" class="mx-1">•</span>
                  <span v-if="patenteInfo.propietario.direccion">{{ patenteInfo.propietario.direccion }}</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
            <input
              v-model="form.marca"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ej: Toyota"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Modelo *</label>
            <input
              v-model="form.modelo"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ej: Corolla"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Año *</label>
            <input
              v-model.number="form.anio"
              type="number"
              required
              min="1900"
              :max="new Date().getFullYear() + 1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ej: 2020"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kilometraje *</label>
            <input
              v-model.number="form.kilometraje"
              type="number"
              required
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ej: 45000"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input
              v-model="form.color"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ej: Blanco"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio Base *</label>
            <input
              v-model.number="form.precioBase"
              type="number"
              required
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ej: 8500000"
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

      <!-- Imágenes -->
      <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Imágenes del Vehículo</h2>
        <div class="space-y-4">
          <input
            type="file"
            ref="fileInput"
            @change="handleFileSelect"
            accept="image/*"
            multiple
            class="hidden"
          />
          <button
            type="button"
            @click="$refs.fileInput.click()"
            class="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 transition-colors text-gray-600"
          >
            + Agregar Imágenes (máximo 70)
          </button>
          
          <div v-if="selectedImages.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="(image, index) in selectedImages"
              :key="index"
              class="relative aspect-video bg-gray-200 rounded-lg overflow-hidden group"
            >
              <img
                :src="image.preview"
                :alt="`Imagen ${index + 1}`"
                class="w-full h-full object-cover"
              />
              <button
                type="button"
                @click="removeImage(index)"
                class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X :size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado (solo para admin) -->
      <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Estado</h2>
        <select
          v-model="form.estado"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="aprobado">Aprobado</option>
          <option value="pendiente">Pendiente</option>
          <option value="disponible">Disponible</option>
        </select>
      </div>

      <!-- Botones -->
      <div class="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          @click="navigateTo('/admin/autos')"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="isLoading"
          class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <span v-if="isLoading">Guardando...</span>
          <span v-else>Guardar Auto</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowLeft, X } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['admin']
})

const { getAuthHeaders } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const form = ref({
  patente: '',
  marca: '',
  modelo: '',
  anio: '',
  kilometraje: '',
  color: '',
  precioBase: '',
  descripcion: '',
  estado: 'aprobado'
})

const selectedImages = ref([])
const isLoading = ref(false)
const fileInput = ref(null)
const isSearchingPatente = ref(false)
const patenteInfo = ref(null)

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  const remainingSlots = 70 - selectedImages.value.length
  
  files.slice(0, remainingSlots).forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        selectedImages.value.push({
          file: file,
          preview: e.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  })
  
  // Limpiar input para permitir seleccionar el mismo archivo de nuevo
  event.target.value = ''
}

const removeImage = (index) => {
  selectedImages.value.splice(index, 1)
}

const handleSubmit = async () => {
  isLoading.value = true
  try {
    console.log('[autos-nuevo] Formulario a enviar:', form.value)
    console.log('[autos-nuevo] Imágenes seleccionadas:', selectedImages.value.length)
    
    const formData = new FormData()
    
    // Agregar campos del formulario (asegurarse de que los requeridos estén presentes)
    if (form.value.patente) {
      formData.append('patente', (form.value.patente || '').toUpperCase().trim())
    }
    formData.append('marca', form.value.marca || '')
    formData.append('modelo', form.value.modelo || '')
    formData.append('anio', form.value.anio || '')
    formData.append('kilometraje', form.value.kilometraje || '')
    formData.append('precioBase', form.value.precioBase || '')
    
    // Campos opcionales
    if (form.value.color) {
      formData.append('color', form.value.color)
    }
    if (form.value.descripcion) {
      formData.append('descripcion', form.value.descripcion)
    }
    if (form.value.estado) {
      formData.append('estado', form.value.estado)
    }

    // Agregar imágenes
    selectedImages.value.forEach((image) => {
      formData.append('imagenes', image.file)
    })

    console.log('[autos-nuevo] Enviando FormData con:', {
      marca: form.value.marca,
      modelo: form.value.modelo,
      anio: form.value.anio,
      kilometraje: form.value.kilometraje,
      precioBase: form.value.precioBase,
      imagenes: selectedImages.value.length
    })

    // Usar fetch nativo para FormData
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/autos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    const data = await response.json()
    console.log('[autos-nuevo] Respuesta del servidor:', data)

    if (!response.ok) {
      // Si hay errores de validación, mostrarlos
      if (data.errors && Array.isArray(data.errors)) {
        const errorMessages = data.errors.map(e => `${e.field}: ${e.message}`).join('\n')
        throw new Error(`Errores de validación:\n${errorMessages}`)
      }
      throw new Error(data.message || 'Error al crear el auto')
    }

    await navigateTo('/admin/autos')
  } catch (error) {
    console.error('[autos-nuevo] Error creando auto:', error)
    alert(error.message || 'Error al crear el auto')
  } finally {
    isLoading.value = false
  }
}

const buscarPorPatente = async () => {
  try {
    if (!form.value.patente) {
      alert('Ingresa una patente para buscar.');
      return;
    }

    isSearchingPatente.value = true;
    patenteInfo.value = null;

    const token = localStorage.getItem('token');
    const url = new URL(`${API_BASE}/autos/patente-info`);
    url.searchParams.set('patente', form.value.patente);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[autos-nuevo] Error en patente-info:', data);
      alert(data.message || 'No se pudo obtener información por patente. Verifica que el servicio esté configurado.');
      return;
    }

    patenteInfo.value = data;
  } catch (error) {
    console.error('[autos-nuevo] Error buscando por patente:', error);
    alert('Ocurrió un error al buscar información por patente.');
  } finally {
    isSearchingPatente.value = false;
  }
}

const aplicarDatosPatente = () => {
  if (!patenteInfo.value || !patenteInfo.value.auto) {
    return;
  }

  const auto = patenteInfo.value.auto;
  
  // Solo aplicar si el campo está vacío, para no sobrescribir datos ya ingresados
  if (auto.marca && !form.value.marca) {
    form.value.marca = auto.marca;
  }
  if (auto.modelo && !form.value.modelo) {
    form.value.modelo = auto.modelo;
  }
  if (auto.anio && !form.value.anio) {
    form.value.anio = auto.anio;
  }
  if (auto.color && !form.value.color) {
    form.value.color = auto.color;
  }

  // Mostrar mensaje de confirmación
  alert('Datos aplicados al formulario. Revisa los campos antes de guardar.');
}
</script>

