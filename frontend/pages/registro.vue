<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">AutoRemates</h1>
        <p class="text-gray-600">Crea tu cuenta</p>
      </div>

      <!-- Card de Registro -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Registro</h2>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Nombre -->
          <div>
            <label for="nombre" class="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <input
              id="nombre"
              v-model="form.nombre"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              placeholder="Juan Pérez"
            />
          </div>

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

          <!-- Teléfono -->
          <div>
            <label for="telefono" class="block text-sm font-medium text-gray-700 mb-2">
              Teléfono (Opcional)
            </label>
            <input
              id="telefono"
              v-model="form.telefono"
              type="tel"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              placeholder="+56912345678"
            />
          </div>

          <!-- Rol -->
          <div>
            <label for="rol" class="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Usuario
            </label>
            <select
              id="rol"
              v-model="form.rol"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
            >
              <option value="vendedor">Vendedor (Quiero subastar mi auto)</option>
              <option value="dealer">Dealer (Quiero comprar autos)</option>
            </select>
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
              minlength="6"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="passwordConfirm" class="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <input
              id="passwordConfirm"
              v-model="form.passwordConfirm"
              type="password"
              required
              minlength="6"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              placeholder="Repite tu contraseña"
            />
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <!-- Success Message -->
          <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {{ success }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">Crear Cuenta</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando cuenta...
            </span>
          </button>
        </form>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            ¿Ya tienes cuenta?
            <NuxtLink to="/login" class="text-orange-500 hover:text-orange-600 font-semibold">
              Inicia sesión aquí
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

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl || 'https://autoremates.cl'
const route = useRoute()

// SEO Meta Tags
useSeoMeta({
  title: 'Registro - Crea tu Cuenta en AutoRemates Chile',
  description: 'Regístrate en AutoRemates Chile para vender o comprar autos en remate. Crea tu cuenta gratis y participa en nuestros remates online con inspección profesional incluida.',
  keywords: 'registro autoremates, crear cuenta remate autos, registrarse vender auto chile, cuenta gratis remate autos',
  ogTitle: 'Registro - Crea tu Cuenta en AutoRemates Chile',
  ogDescription: 'Regístrate en AutoRemates Chile para vender o comprar autos en remate. Crea tu cuenta gratis.',
  ogImage: siteUrl + '/subasta.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'Registro - AutoRemates Chile',
  ogUrl: siteUrl + route.path,
  ogType: 'website'
})

useHead({
  link: [
    { rel: 'canonical', href: siteUrl + route.path }
  ]
})

const { register, checkAuth, user } = useAuth()
const router = useRouter()

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
            default:
              router.push('/')
          }
        }
      } catch (e) {
        // Si hay error parseando, continuar con el registro
        console.error('Error parsing user:', e)
      }
    }
  }
})

const form = ref({
  nombre: '',
  email: '',
  telefono: '',
  rol: 'vendedor',
  password: '',
  passwordConfirm: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  // Validar contraseñas
  if (form.value.password !== form.value.passwordConfirm) {
    error.value = 'Las contraseñas no coinciden'
    loading.value = false
    return
  }

  if (form.value.password.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres'
    loading.value = false
    return
  }

  const result = await register({
    nombre: form.value.nombre,
    email: form.value.email,
    telefono: form.value.telefono,
    rol: form.value.rol,
    password: form.value.password
  })

  if (result.success) {
    success.value = 'Cuenta creada exitosamente. Redirigiendo...'
    
    // Redirigir según el rol
    setTimeout(() => {
      const rol = result.usuario.rol
      if (rol === 'vendedor') {
        router.push('/vendedor/dashboard')
      } else if (rol === 'dealer') {
        router.push('/dealer/dashboard')
      } else {
        router.push('/')
      }
    }, 1500)
  } else {
    error.value = result.message || 'Error al crear la cuenta'
  }

  loading.value = false
}
</script>

