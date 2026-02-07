<template>
  <div
    @click="handleClick"
    :class="[
      'group cursor-pointer bg-white rounded-3xl shadow-sm border-2 overflow-hidden hover:shadow-2xl transition-all duration-500',
      getBorderColor()
    ]"
  >
    <div class="relative h-56 overflow-hidden">
      <img
        :src="getImageUrl(auction.imagenes?.[0])"
        :alt="`${auction.marca} ${auction.modelo}`"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div class="absolute top-4 left-4 z-10">
        <AuctionTimer
          :end-time="new Date(auction.fechaFinRemate)"
          @urgency-change="setUrgency"
        />
      </div>
      
      <!-- Overlay dinámico según urgencia -->
      <div
        v-if="urgency === UrgencyLevel.FINAL_CALL"
        class="absolute inset-0 bg-red-600/10 pointer-events-none animate-pulse"
      ></div>

      <div class="absolute bottom-4 left-4 flex gap-2">
        <span class="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
          {{ auction.color || 'N/A' }}
        </span>
        <span class="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
          {{ auction.anio }}
        </span>
      </div>
    </div>

    <div class="p-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-xl font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
            {{ auction.marca }} {{ auction.modelo }}
          </h3>
          <p class="text-sm font-medium text-slate-400">
            {{ formatNumber(auction.kilometraje) }} km
          </p>
        </div>
      </div>

      <div
        :class="[
          'p-4 rounded-2xl transition-colors duration-500',
          urgency === UrgencyLevel.FINAL_CALL ? 'bg-red-50' : 'bg-slate-50'
        ]"
      >
        <div class="flex justify-between items-center">
          <div>
            <div class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Oferta actual</div>
            <div
              :class="[
                'text-2xl font-black transition-colors',
                urgency === UrgencyLevel.FINAL_CALL ? 'text-red-600' : 'text-slate-900'
              ]"
            >
              ${{ formatPrice(auction.precioActual || auction.precioBase) }}
            </div>
          </div>
          <div class="text-right">
            <div class="flex items-center gap-1 text-slate-400 text-xs font-bold justify-end">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
              {{ auction.views || Math.floor(Math.random() * 50) + 10 }} VIENDO
            </div>
            <div class="text-xs font-bold text-blue-600 mt-1">{{ auction.totalPujas || 0 }} PUJAS</div>
          </div>
        </div>
      </div>

      <button
        @click.stop="handleClick"
        :class="[
          'w-full mt-4 py-3 rounded-xl font-black text-sm transition-all shadow-lg active:scale-95',
          urgency === UrgencyLevel.FINAL_CALL
            ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-100'
            : 'bg-slate-900 text-white hover:bg-blue-600'
        ]"
      >
        {{ urgency === UrgencyLevel.FINAL_CALL ? '¡PUJAR YA MISMO!' : 'PARTICIPAR' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AuctionTimer from './AuctionTimer.vue'
import { UrgencyLevel } from '~/utils/auctionConstants'

const props = defineProps({
  auction: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const urgency = ref(UrgencyLevel.STABLE)

const handleClick = () => {
  console.log('[AuctionCard] Click en tarjeta, auction.id:', props.auction.id)
  console.log('[AuctionCard] Auction completo:', props.auction)
  emit('click', props.auction.id)
}

const setUrgency = (level) => {
  urgency.value = level
}

const getBorderColor = () => {
  if (urgency.value === UrgencyLevel.FINAL_CALL) return 'border-red-500 shadow-red-100'
  if (urgency.value === UrgencyLevel.CRITICAL) return 'border-red-300'
  if (urgency.value === UrgencyLevel.WARNING) return 'border-amber-300'
  return 'border-slate-200'
}

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('es-CL').format(price)
}

const formatNumber = (num) => {
  if (!num) return '0'
  return new Intl.NumberFormat('es-CL').format(num)
}

const { getImageUrl: getImageUrlHelper } = useImageUrl()

const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/400x300?text=Sin+Imagen'
  return getImageUrlHelper(imagePath)
}
</script>

