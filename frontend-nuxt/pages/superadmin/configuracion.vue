<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Configuración</h1>
      <p class="text-gray-600 mt-2">Ajustes generales del sistema</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Menú lateral -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow">
          <nav class="p-2">
            <button
              v-for="section in sections"
              :key="section.id"
              @click="activeSection = section.id"
              :class="[
                'w-full text-left px-4 py-3 rounded-lg transition-colors mb-1',
                activeSection === section.id
                  ? 'bg-orange-50 text-orange-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              ]"
            >
              <div class="flex items-center space-x-3">
                <component :is="section.icon" :size="20" />
                <span>{{ section.title }}</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      <!-- Contenido -->
      <div class="lg:col-span-2">
        <!-- General -->
        <div v-if="activeSection === 'general'" class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Configuración General</h2>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del Sistema</label>
              <input
                type="text"
                v-model="config.nombreSistema"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email de Contacto</label>
              <input
                type="email"
                v-model="config.emailContacto"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono de Contacto</label>
              <input
                type="tel"
                v-model="config.telefonoContacto"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Zona Horaria</label>
              <select
                v-model="config.zonaHoraria"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="America/Santiago">America/Santiago (Chile)</option>
                <option value="America/Lima">America/Lima (Perú)</option>
                <option value="America/Mexico_City">America/Mexico_City (México)</option>
              </select>
            </div>
            <div class="flex justify-end">
              <button
                @click="saveConfig"
                class="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>

        <!-- Remates -->
        <div v-if="activeSection === 'remates'" class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Configuración de Remates</h2>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Duración Mínima (días)</label>
              <input
                type="number"
                v-model="config.duracionMinima"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Duración Máxima (días)</label>
              <input
                type="number"
                v-model="config.duracionMaxima"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Incremento Mínimo de Puja (%)</label>
              <input
                type="number"
                v-model="config.incrementoMinimo"
                step="0.1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                v-model="config.extenderAutomaticamente"
                class="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-700">Extender automáticamente si hay pujas al finalizar</label>
            </div>
            <div class="flex justify-end">
              <button
                @click="saveConfig"
                class="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>

        <!-- Comisiones -->
        <div v-if="activeSection === 'comisiones'" class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Configuración de Comisiones</h2>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Comisión Vendedor (%)</label>
              <input
                type="number"
                v-model="config.comisionVendedor"
                step="0.1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Comisión Plataforma (%)</label>
              <input
                type="number"
                v-model="config.comisionPlataforma"
                step="0.1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Costo de Inspección</label>
              <input
                type="number"
                v-model="config.costoInspeccion"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div class="flex justify-end">
              <button
                @click="saveConfig"
                class="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>

        <!-- Notificaciones -->
        <div v-if="activeSection === 'notificaciones'" class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Configuración de Notificaciones</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p class="font-medium text-gray-900">Email de Notificaciones</p>
                <p class="text-sm text-gray-500">Enviar notificaciones por correo electrónico</p>
              </div>
              <input
                type="checkbox"
                v-model="config.notificacionesEmail"
                class="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
            </div>
            <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p class="font-medium text-gray-900">Notificaciones Push</p>
                <p class="text-sm text-gray-500">Enviar notificaciones push al navegador</p>
              </div>
              <input
                type="checkbox"
                v-model="config.notificacionesPush"
                class="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
            </div>
            <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p class="font-medium text-gray-900">Recordatorios de Remates</p>
                <p class="text-sm text-gray-500">Enviar recordatorios antes de que finalicen los remates</p>
              </div>
              <input
                type="checkbox"
                v-model="config.recordatoriosRemates"
                class="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
            </div>
            <div class="flex justify-end">
              <button
                @click="saveConfig"
                class="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Settings, Gavel, DollarSign, Bell } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['superadmin']
})

const activeSection = ref('general')

const sections = [
  { id: 'general', title: 'General', icon: Settings },
  { id: 'remates', title: 'Remates', icon: Gavel },
  { id: 'comisiones', title: 'Comisiones', icon: DollarSign },
  { id: 'notificaciones', title: 'Notificaciones', icon: Bell }
]

const config = ref({
  nombreSistema: 'Autoventas',
  emailContacto: 'contacto@autoventas.com',
  telefonoContacto: '+56912345678',
  zonaHoraria: 'America/Santiago',
  duracionMinima: 7,
  duracionMaxima: 30,
  incrementoMinimo: 5,
  extenderAutomaticamente: true,
  comisionVendedor: 5,
  comisionPlataforma: 3,
  costoInspeccion: 50000,
  notificacionesEmail: true,
 notificacionesPush: true,
  recordatoriosRemates: true
})

const saveConfig = () => {
  console.log('Guardar configuración:', config.value)
  // Implementar guardado en API
}
</script>










