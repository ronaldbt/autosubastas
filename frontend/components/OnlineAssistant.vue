<template>
  <button
    @click="openWhatsApp"
    class="fixed z-[9999] bg-green-500 hover:bg-green-600 text-white shadow-2xl flex items-center justify-center font-bold animate-float transition-colors group
      bottom-[5.5rem] right-4 h-12 w-12 rounded-full p-0 md:bottom-24 md:right-6 md:h-auto md:w-auto md:rounded-full md:px-6 md:py-3 md:gap-3"
    aria-label="Asistente en línea - Contactar por WhatsApp"
  >
    <MessageCircle :size="24" class="group-hover:rotate-12 transition-transform flex-shrink-0" />
    <span class="hidden md:inline text-sm md:text-base">Asistente en línea</span>
    <span class="relative hidden md:flex h-3 w-3 flex-shrink-0">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-200 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
    </span>
    <span class="absolute top-1 right-1 md:hidden h-2 w-2 rounded-full bg-white ring-2 ring-green-600" aria-hidden="true" />
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
