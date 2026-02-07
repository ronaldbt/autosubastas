<template>
  <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
    <div class="flex items-center justify-between relative">
      <!-- Línea conectora -->
      <div 
        v-if="!fallido"
        class="absolute top-6 left-0 right-0 h-0.5 z-0"
        :class="etapaActual >= 5 ? 'bg-gray-500' : etapaActual > 0 ? 'bg-gray-300' : 'bg-gray-200'"
        :style="{ left: '24px', right: '24px' }"
      ></div>
      <div 
        v-else
        class="absolute top-6 left-0 h-0.5 bg-gray-500 z-0"
        :style="{ left: '24px', width: 'calc(83.33% - 48px)' }"
      ></div>
      
      <!-- Etapa 1: Reunión designada -->
      <div class="flex flex-col items-center relative z-10" style="flex: 1">
        <div 
          :class="[
            'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all',
            getEtapaClass(1)
          ]"
        >
          <Check v-if="etapaActual >= 1" :size="20" class="text-white" />
          <span v-else class="text-gray-400 text-xs font-bold">1</span>
        </div>
        <p class="text-xs text-gray-600 mt-2 text-center font-medium">Reunión designada</p>
      </div>

      <!-- Etapa 2: Inspección del coche -->
      <div class="flex flex-col items-center relative z-10" style="flex: 1">
        <div 
          :class="[
            'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all',
            getEtapaClass(2)
          ]"
        >
          <Check v-if="etapaActual >= 2" :size="20" class="text-white" />
          <span v-else class="text-gray-400 text-xs font-bold">2</span>
        </div>
        <p class="text-xs text-gray-600 mt-2 text-center font-medium">Inspección del coche</p>
      </div>

      <!-- Etapa 3: Lanzamiento de la subasta -->
      <div class="flex flex-col items-center relative z-10" style="flex: 1">
        <div 
          :class="[
            'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all',
            getEtapaClass(3)
          ]"
        >
          <Check v-if="etapaActual >= 3" :size="20" class="text-white" />
          <span v-else class="text-gray-400 text-xs font-bold">3</span>
        </div>
        <p class="text-xs text-gray-600 mt-2 text-center font-medium">Lanzamiento de la subasta</p>
      </div>

      <!-- Etapa 4: ¡Pujando! -->
      <div class="flex flex-col items-center relative z-10" style="flex: 1">
        <div 
          :class="[
            'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all',
            getEtapaClass(4)
          ]"
        >
          <Check v-if="etapaActual >= 4" :size="20" class="text-white" />
          <span v-else class="text-gray-400 text-xs font-bold">4</span>
        </div>
        <p class="text-xs text-gray-600 mt-2 text-center font-medium">¡Pujando!</p>
      </div>

      <!-- Etapa 5: Oferta de precio -->
      <div v-if="!fallido" class="flex flex-col items-center relative z-10" style="flex: 1">
        <div 
          :class="[
            'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all',
            getEtapaClass(5)
          ]"
        >
          <Check v-if="etapaActual >= 5" :size="20" class="text-white" />
          <span v-else class="text-gray-400 text-xs font-bold">5</span>
        </div>
        <p class="text-xs text-gray-600 mt-2 text-center font-medium">Oferta de precio</p>
      </div>

      <!-- Etapa 6: El coche no se vende (solo si falló) -->
      <div v-if="fallido" class="flex flex-col items-center relative z-10" style="flex: 1">
        <div class="w-12 h-12 rounded-full flex items-center justify-center bg-red-500 border-2 border-red-600">
          <X :size="20" class="text-white" />
        </div>
        <p class="text-xs text-red-600 mt-2 text-center font-medium">El coche no se vende</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Check, X } from 'lucide-vue-next'

const props = defineProps({
  auto: {
    type: Object,
    required: true
  },
  totalPujas: {
    type: Number,
    default: 0
  }
})

// Calcular la etapa actual basada en el estado del auto
const etapaActual = computed(() => {
  const auto = props.auto
  
  // Si está vendido, completó todas las etapas hasta la 5
  if (auto.estado === 'vendido') {
    return 5
  }
  
  // Si está en remate
  if (auto.estado === 'en_remate') {
    // Si tiene pujas, está en etapa 4 (pujando)
    if (props.totalPujas > 0) {
      return 4
    }
    // Si no tiene pujas pero está en remate, etapa 3 (lanzamiento)
    return 3
  }
  
  // Si está aprobado y tiene peritaje, etapa 3
  if (auto.estado === 'aprobado' || auto.estado === 'disponible') {
    if (auto.peritaje || auto.peritajeId) {
      return 3
    }
    // Si está aprobado pero sin peritaje, etapa 2
    return 2
  }
  
  // Si está pendiente o en revisión, etapa 1
  if (auto.estado === 'pendiente' || auto.estado === 'en_revision') {
    return 1
  }
  
  return 0
})

// Verificar si el proceso falló (remate finalizado sin venta)
const fallido = computed(() => {
  const auto = props.auto
  
  // Si está en remate pero la fecha de fin ya pasó y no está vendido
  if (auto.estado === 'en_remate' && auto.fechaFinRemate) {
    const ahora = new Date()
    const finRemate = new Date(auto.fechaFinRemate)
    if (finRemate <= ahora && props.totalPujas === 0) {
      // El remate terminó sin pujas
      return true
    }
  }
  
  // Si fue rechazado o cancelado
  if (auto.estado === 'rechazado' || auto.estado === 'cancelado') {
    return true
  }
  
  return false
})

const getEtapaClass = (etapa) => {
  const actual = etapaActual.value
  const esFallido = fallido.value
  
  // Si es fallido, todas las etapas anteriores completadas en gris
  if (esFallido && etapa <= 4) {
    return 'bg-gray-500 border-gray-600'
  }
  
  // Si la etapa ya pasó
  if (actual >= etapa) {
    return 'bg-gray-500 border-gray-600'
  }
  
  // Si es la etapa actual (la siguiente a completar)
  if (actual === etapa - 1) {
    return 'bg-orange-500 border-orange-600'
  }
  
  // Etapa futura
  return 'bg-gray-200 border-gray-300'
}
</script>


