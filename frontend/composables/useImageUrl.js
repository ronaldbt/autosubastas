export const useImageUrl = () => {
  const config = useRuntimeConfig()
  const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

  const getImageUrl = (imagePath) => {
    console.log('[useImageUrl] getImageUrl llamado con:', imagePath)
    
    if (!imagePath) {
      console.log('[useImageUrl] imagePath está vacío')
      return ''
    }
    
    // Si es una URL de R2, usar el proxy del backend para evitar CORS
    if (imagePath.startsWith('http')) {
      if (imagePath.includes('r2.dev') || imagePath.includes('r2.cloudflarestorage.com')) {
        try {
          // Extraer el path después del dominio de R2
          const url = new URL(imagePath)
          const r2Path = url.pathname.substring(1) // Remover el / inicial
          const proxyUrl = `${API_BASE}/images/${r2Path}`
          console.log('[useImageUrl] URL de R2 detectada, usando proxy:', {
            original: imagePath,
            r2Path: r2Path,
            proxyUrl: proxyUrl
          })
          return proxyUrl
        } catch (e) {
          console.error('[useImageUrl] Error parseando URL de R2:', e)
          return imagePath
        }
      }
      console.log('[useImageUrl] URL HTTP pero no es R2, devolviendo tal cual:', imagePath)
      return imagePath
    }
    
    // Si es una ruta relativa, construir la URL completa
    const localUrl = `${API_BASE.replace('/api', '')}/${imagePath}`
    console.log('[useImageUrl] Ruta relativa, construyendo URL:', localUrl)
    return localUrl
  }

  return { getImageUrl }
}

