export default defineNuxtRouteMiddleware((to, from) => {
  // Solo verificar en el cliente
  if (process.client) {
    const { user } = useAuth()
    
    // Si hay un usuario en el estado, redirigir al dashboard según su rol
    if (user.value) {
      const rol = user.value.rol
      switch (rol) {
        case 'superadmin':
          return navigateTo('/superadmin/dashboard')
        case 'admin':
          return navigateTo('/admin/dashboard')
        case 'vendedor':
          return navigateTo('/vendedor/dashboard')
        case 'dealer':
          return navigateTo('/dealer/dashboard')
        case 'perito':
          return navigateTo('/perito/dashboard')
        default:
          return navigateTo('/')
      }
    }
  }
})

