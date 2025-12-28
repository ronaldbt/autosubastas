<template>
  <header :class="[
    'fixed w-full z-50 transition-all duration-300',
    isScrolled ? 'glass-nav py-3 shadow-sm' : 'bg-transparent py-5'
  ]">
    <div class="container mx-auto px-4 md:px-6">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <div class="flex items-center gap-2 cursor-pointer group">
          <div :class="[
            'p-2 rounded-lg transition-colors',
            isScrolled ? 'bg-brand-orange text-white' : 'bg-white text-brand-orange'
          ]">
            <Car :size="24" :stroke-width="2.5" />
          </div>
          <span :class="[
            'text-2xl font-bold tracking-tight',
            isScrolled ? 'text-gray-900' : 'text-white'
          ]">
            Remat<span :class="isScrolled ? 'text-brand-orange' : 'text-gray-200'">Auto</span>
          </span>
        </div>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-8">
          <ul :class="[
            'flex gap-6 font-medium',
            isScrolled ? 'text-gray-600' : 'text-gray-100'
          ]">
            <li><a href="#inicio" class="hover:text-brand-orange transition-colors">Inicio</a></li>
            <li><a href="#vende" class="hover:text-brand-orange transition-colors">Vender</a></li>
            <li><a href="#remates" class="hover:text-brand-orange transition-colors">Comprar</a></li>
            <li><a href="#inspeccion" class="hover:text-brand-orange transition-colors">Inspección</a></li>
          </ul>
          <div class="flex gap-4">
            <NuxtLink
              to="/login"
              :class="[
                'px-4 py-2 rounded-lg font-semibold transition-all',
                isScrolled 
                  ? 'text-brand-orange border border-brand-orange hover:bg-brand-orange hover:text-white' 
                  : 'text-white border border-white hover:bg-white hover:text-brand-orange'
              ]"
            >
              Iniciar Sesión
            </NuxtLink>
            <button class="bg-brand-orange hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
              Rematar mi Auto
            </button>
          </div>
        </nav>

        <!-- Mobile Toggle -->
        <button 
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          :class="[
            'md:hidden p-2 rounded-lg',
            isScrolled ? 'text-gray-900' : 'text-white'
          ]"
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
        <li><a href="#inicio" class="block p-2 hover:bg-gray-50 rounded" @click="isMobileMenuOpen = false">Inicio</a></li>
        <li><a href="#vende" class="block p-2 hover:bg-gray-50 rounded" @click="isMobileMenuOpen = false">Vender mi Auto</a></li>
        <li><a href="#remates" class="block p-2 hover:bg-gray-50 rounded" @click="isMobileMenuOpen = false">Próximos Remates</a></li>
        <li><a href="#inspeccion" class="block p-2 hover:bg-gray-50 rounded" @click="isMobileMenuOpen = false">Inspección Pre-Compra</a></li>
        <li class="pt-2 border-t flex flex-col gap-3">
          <NuxtLink
            to="/login"
            class="w-full text-brand-orange border border-brand-orange py-2 rounded-lg font-semibold text-center"
            @click="isMobileMenuOpen = false"
          >
            Iniciar Sesión
          </NuxtLink>
          <button class="w-full bg-brand-orange text-white py-2 rounded-lg font-semibold shadow">Rematar mi Auto</button>
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