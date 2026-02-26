<template>
  <header :class="[
    'fixed w-full z-50 transition-all duration-300',
    isScrolled ? 'glass-nav py-3 shadow-sm' : 'bg-white/95 backdrop-blur-sm py-5 shadow-sm'
  ]">
    <div class="container mx-auto px-4 md:px-6">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div class="p-2 rounded-lg bg-brand-orange text-white transition-colors group-hover:bg-orange-600">
            <Car :size="24" :stroke-width="2.5" />
          </div>
          <span class="text-2xl font-bold tracking-tight text-gray-900">
            Auto<span class="text-brand-orange">Remates</span>
          </span>
        </NuxtLink>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-8">
          <ul class="flex gap-6 font-medium text-gray-700">
            <li><NuxtLink to="/" class="hover:text-brand-orange transition-colors">Inicio</NuxtLink></li>
            <li><NuxtLink to="/remates" class="hover:text-brand-orange transition-colors">Remates Activos</NuxtLink></li>
            <li><a href="#como-funciona" class="hover:text-brand-orange transition-colors">Cómo Funciona</a></li>
            <li><NuxtLink to="/blog" class="hover:text-brand-orange transition-colors">Blog</NuxtLink></li>
            <li><a href="#faq" class="hover:text-brand-orange transition-colors">Preguntas Frecuentes</a></li>
            <li><a href="#contacto" class="hover:text-brand-orange transition-colors">Contacto</a></li>
          </ul>
          <div class="flex gap-4">
            <NuxtLink
              to="/login"
              class="px-4 py-2 rounded-lg font-semibold transition-all text-brand-orange border border-brand-orange hover:bg-brand-orange hover:text-white"
            >
              Iniciar Sesión
            </NuxtLink>
            <NuxtLink to="/registro" class="bg-brand-orange hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 inline-block">
              Rematar mi Auto
            </NuxtLink>
          </div>
        </nav>

        <!-- Mobile Toggle -->
        <button 
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="md:hidden p-2 rounded-lg text-gray-900"
        >
          <X v-if="isMobileMenuOpen" :size="28" />
          <Menu v-else :size="28" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div :class="[
      'md:hidden absolute top-full left-0 w-full bg-white border-b shadow-xl transition-all duration-300 overflow-hidden',
      isMobileMenuOpen ? 'max-h-96' : 'max-h-0'
    ]">
      <ul class="flex flex-col p-4 gap-4 text-gray-800 font-medium">
        <li><NuxtLink to="/" class="block p-2 hover:bg-gray-50 rounded" @click="isMobileMenuOpen = false">Inicio</NuxtLink></li>
        <li><NuxtLink to="/remates" class="block p-2 hover:bg-gray-50 rounded" @click="isMobileMenuOpen = false">Remates Activos</NuxtLink></li>
        <li><a href="#como-funciona" class="block p-2 hover:bg-gray-50 rounded" @click="isMobileMenuOpen = false">Cómo Funciona</a></li>
        <li><NuxtLink to="/blog" class="block p-2 hover:bg-gray-50 rounded" @click="isMobileMenuOpen = false">Blog</NuxtLink></li>
        <li><a href="#faq" class="block p-2 hover:bg-gray-50 rounded" @click="isMobileMenuOpen = false">Preguntas Frecuentes</a></li>
        <li><a href="#contacto" class="block p-2 hover:bg-gray-50 rounded" @click="isMobileMenuOpen = false">Contacto</a></li>
        <li class="pt-2 border-t flex flex-col gap-3">
          <NuxtLink
            to="/login"
            class="w-full text-brand-orange border border-brand-orange py-2 rounded-lg font-semibold text-center"
            @click="isMobileMenuOpen = false"
          >
            Iniciar Sesión
          </NuxtLink>
          <NuxtLink to="/registro" class="w-full bg-brand-orange text-white py-2 rounded-lg font-semibold shadow text-center block" @click="isMobileMenuOpen = false">Rematar mi Auto</NuxtLink>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Menu, X, Car } from 'lucide-vue-next'

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>