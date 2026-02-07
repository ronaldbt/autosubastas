export default defineNuxtRouteMiddleware((to, from) => {
  const { user, checkAuth } = useAuth()
  
  // Verificar autenticación
  if (process.client) {
    const isAuthenticated = checkAuth()
    
    if (!isAuthenticated && !user.value) {
      return navigateTo('/login')
    }
  }
})











