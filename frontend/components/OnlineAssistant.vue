<template>
  <button
    @click="openWhatsApp"
    class="fixed bottom-24 right-6 z-[9999] bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold animate-float transition-colors group"
    aria-label="Asistente en línea - Contactar por WhatsApp"
  >
    <MessageCircle :size="24" class="group-hover:rotate-12 transition-transform flex-shrink-0" />
    <span class="text-sm md:text-base">Asistente en línea</span>
    <span class="relative flex h-3 w-3 flex-shrink-0">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-200 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
    </span>
  </button>
</template>

<script setup>
import { MessageCircle } from 'lucide-vue-next'

const openWhatsApp = () => {
  if (typeof window !== 'undefined') {
    window.open('https://wa.me/56979796841', '_blank')
  }
}
</script>
