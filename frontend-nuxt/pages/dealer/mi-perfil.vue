<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Main Content -->
    <main>
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <header class="mb-4">
          <button
            @click="navigateTo('/dealer/remates-live')"
            class="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-3 group text-xs font-semibold"
          >
            <svg
              class="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            VOLVER
          </button>
          <div>
            <h2 class="text-xl font-black text-slate-900 mb-0.5">Mi Perfil</h2>
            <p class="text-xs text-slate-500">
              Gestiona tu información personal y datos de contacto
            </p>
          </div>
        </header>

        <div v-if="loading" class="text-center py-8">
          <p class="text-slate-400 font-medium text-xs">Cargando información...</p>
        </div>

        <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-3 text-xs">
          {{ error }}
        </div>

        <div v-else class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Nombre -->
            <div class="space-y-1.5">
              <label class="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                Nombre Completo
              </label>
              <input
                v-model="formData.nombre"
                type="text"
                required
                class="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 focus:border-blue-600 focus:outline-none transition-colors text-slate-900 font-medium text-xs"
                placeholder="Ingresa tu nombre completo"
              />
            </div>

            <!-- Email -->
            <div class="space-y-1.5">
              <label class="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                Email
              </label>
              <input
                v-model="formData.email"
                type="email"
                required
                disabled
                class="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 bg-slate-50 text-slate-500 font-medium text-xs cursor-not-allowed"
                placeholder="tu@email.com"
              />
              <p class="text-[10px] text-slate-400">El email no se puede modificar</p>
            </div>

            <!-- Teléfono -->
            <div class="space-y-1.5">
              <label class="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                Teléfono
              </label>
              <input
                v-model="formData.telefono"
                type="tel"
                class="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 focus:border-blue-600 focus:outline-none transition-colors text-slate-900 font-medium text-xs"
                placeholder="+56 9 1234 5678"
              />
            </div>

            <!-- WhatsApp -->
            <div class="space-y-1.5">
              <label class="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                WhatsApp
              </label>
              <div class="flex items-center gap-2">
                <div class="flex-1">
                  <input
                    v-model="formData.whatsapp"
                    type="tel"
                    class="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 focus:border-blue-600 focus:outline-none transition-colors text-slate-900 font-medium text-xs"
                    placeholder="+56 9 1234 5678"
                  />
                </div>
                <a
                  v-if="formData.whatsapp"
                  :href="`https://wa.me/${formData.whatsapp.replace(/[^0-9]/g, '')}`"
                  target="_blank"
                  class="px-3 py-2.5 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-1.5 text-xs whitespace-nowrap"
                >
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Abrir Chat
                </a>
              </div>
            </div>

            <!-- RUT -->
            <div class="space-y-1.5">
              <label class="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                RUT
              </label>
              <input
                v-model="formData.rut"
                type="text"
                class="w-full px-3 py-2.5 rounded-lg border-2 border-slate-200 focus:border-blue-600 focus:outline-none transition-colors text-slate-900 font-medium text-xs"
                placeholder="12.345.678-9"
              />
            </div>

            <!-- Botones de acción -->
            <div class="flex gap-2 pt-3">
              <button
                type="submit"
                :disabled="isSaving"
                class="flex-1 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold text-xs shadow-lg hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <svg v-if="isSaving" class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
              <button
                type="button"
                @click="resetForm"
                class="px-5 py-2.5 rounded-lg font-semibold text-xs border-2 border-slate-200 text-slate-600 hover:border-slate-300 transition-all active:scale-95"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        <!-- Mensaje de éxito -->
        <Transition name="bounce">
          <div
            v-if="successMessage"
            class="fixed top-16 right-4 z-[100] animate-bounce"
          >
            <div class="bg-green-600 text-white px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-[10px] font-semibold">{{ successMessage }}</span>
            </div>
          </div>
        </Transition>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { navigateTo } from 'nuxt/app'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['dealer']
})

const { getAuthHeaders, user } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const loading = ref(false)
const isSaving = ref(false)
const error = ref(null)
const successMessage = ref(null)

const formData = ref({
  nombre: '',
  email: '',
  telefono: '',
  whatsapp: '',
  rut: ''
})

const originalData = ref({})

const loadProfile = async () => {
  loading.value = true
  error.value = null
  try {
    // Cargar datos del usuario actual
    const response = await $fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    })
    
    formData.value = {
      nombre: response.nombre || '',
      email: response.email || '',
      telefono: response.telefono || '',
      whatsapp: response.whatsapp || response.telefono || '', // Usar teléfono como fallback
      rut: response.rut || ''
    }
    
    // Guardar datos originales para reset
    originalData.value = { ...formData.value }
  } catch (err) {
    console.error('Error cargando perfil:', err)
    error.value = err.data?.message || 'Error al cargar el perfil'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  isSaving.value = true
  error.value = null
  successMessage.value = null
  
  try {
    await $fetch(`${API_BASE}/usuarios/${user.value.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: {
        nombre: formData.value.nombre,
        telefono: formData.value.telefono,
        whatsapp: formData.value.whatsapp,
        rut: formData.value.rut
      }
    })
    
    successMessage.value = 'Perfil actualizado correctamente'
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
    
    // Recargar perfil para obtener datos actualizados
    await loadProfile()
  } catch (err) {
    console.error('Error actualizando perfil:', err)
    error.value = err.data?.message || 'Error al actualizar el perfil'
  } finally {
    isSaving.value = false
  }
}

const resetForm = () => {
  formData.value = { ...originalData.value }
  error.value = null
  successMessage.value = null
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.glass-effect {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>

