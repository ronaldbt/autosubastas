/**
 * Utilidades para cargar imágenes y convertirlas a data URL para jsPDF.
 * Usan URL absoluta para que el PDF funcione en producción (mismo origen).
 */

/**
 * Carga una imagen desde URL (absoluta en browser para evitar fallos en PDF).
 * @param {string} url - Ruta relativa (ej: '/carroceria_peritaje.png') o URL absoluta
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImageFromUrl (url) {
  const fullUrl = url.startsWith('http')
    ? url
    : (typeof window !== 'undefined' ? window.location.origin + (url.startsWith('/') ? url : '/' + url) : url)
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => {
      const fallback = url.startsWith('http') ? `/api/images/${url.split('/').slice(3).join('/')}` : url
      const img2 = new Image()
      img2.crossOrigin = 'anonymous'
      img2.onload = () => resolve(img2)
      img2.onerror = () => reject(new Error('No se pudo cargar la imagen'))
      img2.src = fallback
    }
    img.src = fullUrl
  })
}

/**
 * Convierte un elemento Image a data URL vía canvas (jsPDF es más estable con data URL).
 * @param {HTMLImageElement} img
 * @param {string} mime - 'image/png' | 'image/jpeg'
 * @param {number} quality - 0-1 para JPEG
 * @returns {string}
 */
export function imageToDataUrl (img, mime = 'image/jpeg', quality = 0.92) {
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth || img.width
  canvas.height = img.naturalHeight || img.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0)
  return canvas.toDataURL(mime, quality)
}
