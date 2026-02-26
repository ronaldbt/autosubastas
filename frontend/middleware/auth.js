export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    console.log('[Auth Middleware] to.path=', to.path, 'to.meta.auth=', to.meta.auth)
  }
  // Páginas con auth: false son públicas (ej. detalle de remate /remates/[id])
  if (to.meta.auth === false) {
    if (process.client) console.log('[Auth Middleware] Página pública (auth: false), skip')
    return
  }

  const { user, checkAuth } = useAuth()

  if (process.client) {
    const isAuthenticated = checkAuth()
    if (!isAuthenticated && !user.value) {
      console.log('[Auth Middleware] No autenticado, redirigiendo a /login')
      return navigateTo('/login')
    }
    console.log('[Auth Middleware] Autenticado, user=', user.value?.email)
  }
})











