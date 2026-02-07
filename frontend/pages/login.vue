<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Autoventas</h1>
        <p class="text-gray-600">Sistema de Remates de Autos</p>
      </div>

      <!-- Card de Login -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Iniciar Sesión</h2>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              placeholder="tu@email.com"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">Iniciar Sesión</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Iniciando sesión...
            </span>
          </button>
        </form>

        <!-- Register Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            ¿No tienes cuenta?
            <NuxtLink to="/registro" class="text-orange-500 hover:text-orange-600 font-semibold">
              Regístrate aquí
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: false
})

const { login, checkAuth, user } = useAuth()
const router = useRouter()

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

// Verificar si ya está autenticado al cargar la página
onMounted(() => {
  if (process.client) {
    // Solo verificar localStorage sin hacer llamada al API
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        if (parsedUser && parsedUser.rol) {
          const rol = parsedUser.rol
          switch (rol) {
            case 'superadmin':
              router.push('/superadmin/dashboard')
              break
            case 'admin':
              router.push('/admin/dashboard')
              break
            case 'vendedor':
              router.push('/vendedor/dashboard')
              break
            case 'dealer':
              router.push('/dealer/dashboard')
              break
            case 'perito':
              router.push('/perito/dashboard')
              break
            default:
              router.push('/')
          }
        }
      } catch (e) {
        // Si hay error parseando, continuar con el login
        console.error('Error parsing user:', e)
      }
    }
  }
})

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  const result = await login(form.value.email, form.value.password)

  if (result.success) {
    // Redirigir según el rol
    const rol = result.usuario.rol
    switch (rol) {
      case 'superadmin':
        router.push('/superadmin/dashboard')
        break
      case 'admin':
        router.push('/admin/dashboard')
        break
      case 'vendedor':
        router.push('/vendedor/dashboard')
        break
      case 'dealer':
        router.push('/dealer/dashboard')
        break
      case 'perito':
        router.push('/perito/dashboard')
        break
      default:
        router.push('/')
    }
  } else {
    error.value = result.message || 'Credenciales inválidas'
  }

  loading.value = false
}
</script>

