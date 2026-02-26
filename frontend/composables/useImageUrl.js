export const useImageUrl = () => {
  const config = useRuntimeConfig()
  const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

  const getImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') return ''

    const s = imagePath.trim()

    // Si es URL (http) que apunta a R2 o a nuestra estructura autos/, usar proxy para evitar CORS
    if (s.startsWith('http')) {
      try {
        const url = new URL(s)
        const pathname = url.pathname.replace(/^\/+/, '')
        const isR2 = s.includes('r2.dev') || s.includes('r2.cloudflarestorage.com') || pathname.startsWith('autos/')
        if (isR2 && pathname) {
          return `${API_BASE}/images/${pathname}`
        }
      } catch (e) {
        return s
      }
      return s
    }

    // Ruta relativa tipo "autos/123/1.webp" -> proxy del backend
    if (s.startsWith('autos/')) {
      return `${API_BASE}/images/${s}`
    }

    return `${API_BASE.replace('/api', '')}/${s}`
  }

  return { getImageUrl }
}

