<template>
  <div class="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
    <!-- Sidebar en desktop (lateral izquierdo) - solo visible en lg+ -->
    <Sidebar v-if="hasUser" :mobile="false" />
    
    <!-- Contenido principal -->
    <div :class="['flex-1 transition-all duration-300 flex flex-col', hasUser ? sidebarWidthDesktop : 'ml-0', 'pb-20 lg:pb-6']">
      <main class="p-6 flex-1">
        <slot />
      </main>
    </div>
    
    <!-- Sidebar en mobile (parte inferior horizontal) - solo visible en mobile -->
    <Sidebar v-if="hasUser" :mobile="true" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, onUnmounted } from 'vue'
import Sidebar from '~/components/Sidebar.vue'
import { useAuth } from '~/composables/useAuth'

const { user, checkAuth } = useAuth()
// Inicializar con true (colapsado) para que coincida con el estado inicial del Sidebar
const sidebarCollapsed = ref(true)
const hasUser = computed(() => !!user.value)

// Ancho del contenido según si el sidebar está colapsado (solo desktop)
const sidebarWidthDesktop = computed(() => {
  return sidebarCollapsed.value ? 'lg:ml-20' : 'lg:ml-64'
})

const updateCollapsed = () => {
  if (process.client) {
    // Leer del localStorage, pero si no existe, usar true (colapsado por defecto)
    const stored = localStorage.getItem('sidebarCollapsed')
    sidebarCollapsed.value = stored !== null ? stored === 'true' : true
  }
}

onMounted(async () => {
  if (process.client) {
    await checkAuth()
    
    // Inicializar estado correctamente desde el inicio
    // Asegurar que localStorage tenga el valor correcto si no existe
    if (localStorage.getItem('sidebarCollapsed') === null) {
      localStorage.setItem('sidebarCollapsed', 'true')
    }
    
    updateCollapsed()
    
    // Escuchar eventos de storage (cuando cambia en otra pestaña)
    window.addEventListener('storage', updateCollapsed)
    
    // Escuchar evento personalizado del sidebar
    window.addEventListener('sidebar-toggle', updateCollapsed)
    
    // Usar un observer más eficiente en lugar de polling
    const observer = new MutationObserver(() => {
      updateCollapsed()
    })
    
    // Observar cambios en el DOM del sidebar si es necesario
    // Pero mejor usar el evento personalizado
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('storage', updateCollapsed)
    window.removeEventListener('sidebar-toggle', updateCollapsed)
    if (window._sidebarInterval) {
      clearInterval(window._sidebarInterval)
    }
  }
})
</script>

