<template>
  <section id="remates" class="py-24 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="text-center max-w-3xl mx-auto mb-12">
        <AnimatedSection>
          <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Próximo Remate: {{ nextFridayText }}
          </h2>
          <div class="w-24 h-1 bg-brand-orange mx-auto mb-6"></div>
        </AnimatedSection>
        
        <AnimatedSection :delay="200">
          <CountdownTimer />
        </AnimatedSection>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatedSection 
          v-for="(car, index) in FEATURED_CARS" 
          :key="car.id" 
          :delay="index * 150" 
          class="h-full"
        >
          <div class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col group">
            <div class="relative h-56 overflow-hidden">
              <div class="absolute top-4 left-4 z-10 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
                INSPECCIONADO
              </div>
              <img 
                :src="car.imageUrl" 
                :alt="car.title" 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <button class="w-full bg-white text-gray-900 font-bold py-2 rounded shadow hover:bg-brand-orange hover:text-white transition-colors">
                  Ver Detalles
                </button>
              </div>
            </div>

            <div class="p-6 flex-1 flex flex-col">
              <h3 class="text-xl font-bold text-gray-900 mb-1">{{ car.title }}</h3>
              <p class="text-gray-500 text-sm mb-4">{{ car.year }}</p>

              <div class="grid grid-cols-3 gap-2 mb-6 text-sm text-gray-600">
                <div class="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded">
                  <Gauge :size="16" class="text-brand-orange" />
                  <span>{{ car.km / 1000 }}k km</span>
                </div>
                <div class="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded">
                  <Cog :size="16" class="text-brand-orange" />
                  <span class="truncate w-full text-center">{{ car.transmission }}</span>
                </div>
                <div class="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded">
                  <Fuel :size="16" class="text-brand-orange" />
                  <span>{{ car.fuel }}</span>
                </div>
              </div>

              <div class="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <div class="flex flex-col">
                  <span class="text-xs text-gray-500 uppercase font-semibold">Precio Reserva</span>
                  <span class="text-xl font-bold text-gray-900">
                    ${{ (car.reservePrice / 1000000).toFixed(1) }}M
                  </span>
                </div>
                <div class="text-right">
                  <span class="text-xs text-green-600 font-semibold bg-green-100 px-2 py-1 rounded">Ofertas Abiertas</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      <div class="mt-12 text-center">
        <AnimatedSection :delay="600">
          <div class="inline-flex gap-4">
            <NuxtLink
              to="/login"
              class="px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition shadow-lg"
            >
              Ver Todos los Autos (15)
            </NuxtLink>
            <NuxtLink
              to="/registro"
              class="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Registrarme para Comprar
            </NuxtLink>
          </div>
        </AnimatedSection>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { Gauge, Fuel, Cog } from 'lucide-vue-next'
import { FEATURED_CARS } from '~/utils/constants'
import AnimatedSection from './AnimatedSection.vue'
import CountdownTimer from './CountdownTimer.vue'

// Función para obtener el próximo viernes
const getNextFridayDate = () => {
  const now = new Date()
  
  // Obtener fecha actual en Santiago
  const santiagoParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(now)
  
  const year = parseInt(santiagoParts.find(p => p.type === 'year').value)
  const month = parseInt(santiagoParts.find(p => p.type === 'month').value)
  const day = parseInt(santiagoParts.find(p => p.type === 'day').value)
  const hour = parseInt(santiagoParts.find(p => p.type === 'hour').value)
  
  const tempDate = new Date(year, month - 1, day)
  const currentDayOfWeek = tempDate.getDay()
  
  let daysToAdd = (5 - currentDayOfWeek + 7) % 7
  
  if (currentDayOfWeek === 5 && hour >= 15) {
    daysToAdd = 7
  }
  
  // JavaScript Date maneja automáticamente el overflow de mes/año
  return new Date(year, month - 1, day + daysToAdd)
}

// Formatear la fecha del próximo viernes
const nextFridayText = computed(() => {
  const nextFriday = getNextFridayDate()
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  
  const day = nextFriday.getDate()
  const month = months[nextFriday.getMonth()]
  
  return `Viernes ${day} ${month}`
})
</script>