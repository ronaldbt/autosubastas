export const useAuth = () => {
  const user = useState('user', () => {
    if (process.client) {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    }
    return null
  })
  
  const token = useState('token', () => {
    if (process.client) {
      return localStorage.getItem('token') || null
    }
    return null
  })
  
  const config = useRuntimeConfig()
  const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

  const login = async (email, password) => {
    try {
      const response = await $fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        body: {
          email,
          password
        }
      })

      if (response.token && response.usuario) {
        token.value = response.token
        user.value = response.usuario
        
        // Guardar en localStorage
        if (process.client) {
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.usuario))
        }

        return { success: true, usuario: response.usuario }
      }
    } catch (error) {
      console.error('Error en login:', error)
      return { 
        success: false, 
        message: error.data?.message || 'Error al iniciar sesión' 
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await $fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        body: userData
      })

      if (response.token && response.usuario) {
        token.value = response.token
        user.value = response.usuario
        
        if (process.client) {
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.usuario))
        }

        return { success: true, usuario: response.usuario }
      }
    } catch (error) {
      console.error('Error en registro:', error)
      return { 
        success: false, 
        message: error.data?.message || 'Error al registrar usuario' 
      }
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    
    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    
    navigateTo('/login')
  }

  const checkAuth = async () => {
    if (process.client) {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      
      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
        
        // Verificar que el token sigue siendo válido
        try {
          const response = await $fetch(`${API_BASE}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          })
          user.value = response
          if (process.client) {
            localStorage.setItem('user', JSON.stringify(response))
          }
          return true
        } catch (error) {
          // Token inválido, limpiar
          logout()
          return false
        }
      }
    }
    return !!user.value
  }

  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${token.value}`
    }
  }

  return {
    user: readonly(user),
    token: readonly(token),
    login,
    register,
    logout,
    checkAuth,
    getAuthHeaders
  }
}

