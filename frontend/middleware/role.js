export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, checkAuth } = useAuth()
  
  // En servidor, saltar verificación (se hace en cliente)
  if (process.server) {
    return
  }
  
  // En cliente, verificar autenticación y roles
  await checkAuth()
  
  if (!user.value) {
    return navigateTo('/login')
  }
  
  // Obtener roles permitidos de la meta de la ruta
  const allowedRoles = to.meta.allowedRoles || []
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.value.rol)) {
    // Redirigir al dashboard según su rol
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
})


