<template>
  <!-- Desktop Sidebar (Vertical izquierdo) -->
  <aside
    v-if="user && !mobile"
    :class="[
      'hidden lg:flex fixed left-0 top-0 h-full bg-white/90 backdrop-blur-lg border-r border-slate-200 transition-all duration-300 z-40 shadow-xl flex-col',
      isCollapsed ? 'w-20' : 'w-64'
    ]"
  >
    <!-- Logo/Header -->
    <div class="h-16 flex items-center justify-between px-4 border-b border-slate-200">
      <div v-if="!isCollapsed" class="flex items-center gap-2">
        <div class="bg-blue-600 p-2 rounded-xl">
          <Car :size="20" class="text-white" />
        </div>
        <span class="text-xl font-black text-slate-900 tracking-tighter">
          AutoBid<span class="text-blue-600">PRO</span>
        </span>
      </div>
      <div v-else class="flex justify-center w-full">
        <div class="bg-blue-600 p-2 rounded-xl">
          <Car :size="20" class="text-white" />
        </div>
      </div>
      
      <button
        @click="toggleCollapse"
        class="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700"
        :title="isCollapsed ? 'Expandir' : 'Colapsar'"
      >
        <ChevronLeft
          :size="18"
          class="transition-transform"
          :class="{ 'rotate-180': isCollapsed }"
        />
      </button>
    </div>

    <!-- User Info -->
    <div v-if="user" class="px-4 py-4 border-b border-slate-200">
      <div v-if="!isCollapsed" class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-sm border-2 border-white">
          <span class="text-white font-bold text-sm">
            {{ user.nombre?.charAt(0).toUpperCase() }}
          </span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-slate-900 truncate">{{ user.nombre }}</p>
          <p class="text-xs text-slate-500 capitalize">{{ user.rol }}</p>
        </div>
      </div>
      <div v-else class="flex justify-center">
        <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-sm border-2 border-white">
          <span class="text-white font-bold text-sm">
            {{ user.nombre?.charAt(0).toUpperCase() }}
          </span>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4">
      <ul class="space-y-1 px-2">
        <li 
          v-for="(item, index) in menuItems" 
          :key="index"
          class="relative"
          @mouseenter="isCollapsed ? hoveredItem = index : null"
          @mouseleave="hoveredItem = null"
        >
          <NuxtLink
            :to="item.path"
            :class="[
              'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 relative',
              isActive(item.path)
                ? 'bg-blue-50 text-blue-600 font-bold border-l-2 border-blue-600 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            ]"
          >
            <component
              :is="getIconComponent(item.icon)"
              :size="20"
              class="flex-shrink-0"
              :class="isActive(item.path) ? 'text-blue-600' : 'text-slate-500'"
            />
            <span v-if="!isCollapsed" class="flex-1 text-sm font-semibold">{{ item.title }}</span>
            <span
              v-if="item.badge && !isCollapsed"
              class="ml-auto bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-sm"
            >
              {{ item.badge }}
            </span>
          </NuxtLink>
          
          <!-- Tooltip cuando está colapsado -->
          <div
            v-if="isCollapsed && hoveredItem === index"
            class="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg shadow-xl z-50 whitespace-nowrap pointer-events-none tooltip-arrow"
          >
            {{ item.title }}
            <span
              v-if="item.badge"
              class="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold"
            >
              {{ item.badge }}
            </span>
          </div>
        </li>
      </ul>
    </nav>

    <!-- Logout -->
    <div 
      class="p-4 border-t border-slate-200 relative"
      @mouseenter="isCollapsed ? hoveredItem = 'logout' : null"
      @mouseleave="hoveredItem = null"
    >
      <button
        @click="handleLogout"
        :class="[
          'w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors border border-transparent hover:border-red-200 relative',
          isCollapsed && 'justify-center'
        ]"
      >
        <LogOut :size="20" />
        <span v-if="!isCollapsed" class="text-sm font-semibold">Cerrar Sesión</span>
      </button>
      
      <!-- Tooltip para logout cuando está colapsado -->
      <div
        v-if="isCollapsed && hoveredItem === 'logout'"
        class="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg shadow-xl z-50 whitespace-nowrap pointer-events-none tooltip-arrow"
      >
        Cerrar Sesión
      </div>
    </div>
  </aside>

  <!-- Mobile Bottom Navigation (Horizontal) -->
  <nav
    v-if="user && mobile"
    class="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-2xl z-50 safe-area-inset-bottom"
  >
    <div class="h-full flex items-center justify-start px-2 overflow-x-auto scrollbar-hide">
      <NuxtLink
        v-for="(item, index) in menuItems"
        :key="index"
        :to="item.path"
        :class="[
          'flex flex-col items-center justify-center min-w-[70px] px-2 py-1 rounded-lg transition-all duration-200 relative group flex-shrink-0',
          isActive(item.path)
            ? 'text-blue-600'
            : 'text-slate-500'
        ]"
      >
        <component
          :is="getIconComponent(item.icon)"
          :size="20"
          class="flex-shrink-0"
          :class="isActive(item.path) ? 'text-blue-600' : 'text-slate-500'"
        />
        <span class="text-[10px] font-semibold mt-0.5 text-center leading-tight">{{ item.title }}</span>
        <span
          v-if="item.badge"
          class="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
        >
          {{ item.badge }}
        </span>
        <div
          v-if="isActive(item.path)"
          class="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-b"
        ></div>
      </NuxtLink>
      
      <!-- Logout button al final -->
      <button
        @click="handleLogout"
        class="flex flex-col items-center justify-center min-w-[70px] px-2 py-1 rounded-lg transition-all duration-200 text-red-500 flex-shrink-0"
      >
        <LogOut :size="20" />
        <span class="text-[10px] font-semibold mt-0.5">Salir</span>
      </button>
    </div>
  </nav>

</template>

<style scoped>
.tooltip-arrow::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 6px solid rgb(15, 23, 42); /* slate-900 */
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { getSidebarConfig } from '~/utils/sidebarConfig'
import {
  Car,
  ChevronLeft,
  LogOut,
  LayoutDashboard,
  Users,
  User,
  UserCheck,
  Settings,
  BarChart3,
  Gavel,
  PlusCircle,
  DollarSign,
  Search,
  Trophy,
  Heart,
  ClipboardCheck,
  FileCheck,
  Calendar,
  History,
  HandCoins,
  ShoppingCart,
  Clock
} from 'lucide-vue-next'

const props = defineProps({
  mobile: {
    type: Boolean,
    default: false
  }
})

const { user, logout, checkAuth } = useAuth()
const route = useRoute()
const router = useRouter()

const isCollapsed = ref(true) // Siempre comenzar cerrado
const isMobile = ref(false)
const hoveredItem = ref(null)

const menuItems = computed(() => {
  if (!user.value) {
    return []
  }
  const config = getSidebarConfig(user.value.rol)
  return config
})

    watch(user, (newUser) => {
      // Usuario cambió, el computed menuItems se actualizará automáticamente
    }, { immediate: true })

const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  hoveredItem.value = null // Limpiar tooltip al cambiar estado
  if (process.client) {
    // Guardar preferencia del usuario (pero siempre comenzar cerrado)
    localStorage.setItem('sidebarCollapsed', isCollapsed.value.toString())
    // Disparar evento personalizado para que otros componentes se actualicen
    window.dispatchEvent(new Event('sidebar-toggle'))
  }
}

const handleLogout = () => {
  logout()
}

const getIconComponent = (iconName) => {
  const icons = {
    LayoutDashboard,
    Users,
    User,
    UserCheck,
    Settings,
    BarChart3,
    Car,
    Gavel,
    PlusCircle,
    DollarSign,
    Search,
    Trophy,
    Heart,
    ClipboardCheck,
    FileCheck,
    Calendar,
    History,
    HandCoins,
    ShoppingCart,
    Clock
  }
  return icons[iconName] || Car
}

onMounted(async () => {
  if (process.client) {
    // Verificar autenticación al montar
    await checkAuth()
    
    // Verificar si está en mobile
    isMobile.value = window.innerWidth < 1024
    
    // Leer estado inicial del localStorage, pero si no existe, usar true (colapsado)
    const stored = localStorage.getItem('sidebarCollapsed')
    isCollapsed.value = stored !== null ? stored === 'true' : true
    
    // Asegurar que localStorage tenga el valor correcto
    if (stored === null) {
      localStorage.setItem('sidebarCollapsed', 'true')
    }
    
    // En mobile, siempre colapsado
    if (isMobile.value) {
      isCollapsed.value = true
      localStorage.setItem('sidebarCollapsed', 'true')
    }
    
    // Disparar evento para sincronizar con el layout
    window.dispatchEvent(new Event('sidebar-toggle'))
  }
})
</script>

