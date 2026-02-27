<template>
  <header :class="[
    'fixed w-full z-50 transition-all duration-300 border-b border-slate-200',
    isScrolled ? 'py-3 shadow-sm bg-white/90 backdrop-blur-lg' : 'py-5 bg-white/80 backdrop-blur-lg'
  ]">
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16 md:h-20">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div class="p-2 rounded-xl bg-blue-600 text-white transition-colors group-hover:bg-blue-700">
            <Car :size="24" :stroke-width="2.5" />
          </div>
          <span class="text-2xl font-black tracking-tighter text-slate-900">
            Auto<span class="text-blue-600">Remates</span>
          </span>
        </NuxtLink>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-8">
          <ul class="flex gap-6 font-bold text-slate-700">
            <li><NuxtLink to="/" class="hover:text-blue-600 transition-colors">Inicio</NuxtLink></li>
            <li><NuxtLink to="/remates" class="hover:text-blue-600 transition-colors">Remates Activos</NuxtLink></li>
            <li><a href="#como-funciona" class="hover:text-blue-600 transition-colors">Cómo Funciona</a></li>
            <li><NuxtLink to="/blog" class="hover:text-blue-600 transition-colors">Blog</NuxtLink></li>
            <li><a href="#faq" class="hover:text-blue-600 transition-colors">Preguntas Frecuentes</a></li>
            <li><a href="#contacto" class="hover:text-blue-600 transition-colors">Contacto</a></li>
          </ul>
          <div class="flex gap-4">
            <NuxtLink
              to="/login"
              class="px-4 py-2.5 rounded-xl font-bold text-sm transition-all text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white"
            >
              Iniciar Sesión
            </NuxtLink>
            <NuxtLink to="/registro" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all inline-block">
              Rematar mi Auto
            </NuxtLink>
          </div>
        </nav>

        <!-- Mobile Toggle -->
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="md:hidden p-2 rounded-xl text-slate-900"
        >
          <X v-if="isMobileMenuOpen" :size="28" />
          <Menu v-else :size="28" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div :class="[
      'md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-xl transition-all duration-300 overflow-hidden',
      isMobileMenuOpen ? 'max-h-96' : 'max-h-0'
    ]">
      <ul class="flex flex-col p-4 gap-2 text-slate-800 font-bold">
        <li><NuxtLink to="/" class="block p-3 hover:bg-slate-50 rounded-xl" @click="isMobileMenuOpen = false">Inicio</NuxtLink></li>
        <li><NuxtLink to="/remates" class="block p-3 hover:bg-slate-50 rounded-xl" @click="isMobileMenuOpen = false">Remates Activos</NuxtLink></li>
        <li><a href="#como-funciona" class="block p-3 hover:bg-slate-50 rounded-xl" @click="isMobileMenuOpen = false">Cómo Funciona</a></li>
        <li><NuxtLink to="/blog" class="block p-3 hover:bg-slate-50 rounded-xl" @click="isMobileMenuOpen = false">Blog</NuxtLink></li>
        <li><a href="#faq" class="block p-3 hover:bg-slate-50 rounded-xl" @click="isMobileMenuOpen = false">Preguntas Frecuentes</a></li>
        <li><a href="#contacto" class="block p-3 hover:bg-slate-50 rounded-xl" @click="isMobileMenuOpen = false">Contacto</a></li>
        <li class="pt-4 mt-2 border-t border-slate-200 flex flex-col gap-3">
          <NuxtLink
            to="/login"
            class="w-full text-blue-600 border-2 border-blue-600 py-3 rounded-xl font-bold text-center"
            @click="isMobileMenuOpen = false"
          >
            Iniciar Sesión
          </NuxtLink>
          <NuxtLink to="/registro" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow text-center block" @click="isMobileMenuOpen = false">Rematar mi Auto</NuxtLink>
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