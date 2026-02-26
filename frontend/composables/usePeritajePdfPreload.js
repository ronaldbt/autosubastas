import { ref, onMounted } from 'vue'
import { IMAGENES_PDF } from '~/utils/peritajePdfConstants'
import { loadImageFromUrl, imageToDataUrl } from '~/utils/peritajePdfUtils'

/**
 * Precarga las imágenes estáticas del PDF de peritaje para generación más rápida y estable.
 * Usar en la página de peritaje: onMounted(() => preload.load())
 * En generatePDF, usar preload.carroceriaDataUrl.value etc. si están definidos; si no, cargar on the fly.
 */
export function usePeritajePdfPreload () {
  const carroceriaDataUrl = ref(null)
  const chasisDataUrl = ref(null)
  const frenosDataUrl = ref(null)
  const suspensionDataUrl = ref(null)
  const neumaticosDataUrl = ref(null)
  const preloadError = ref(null)
  const isPreloading = ref(false)

  const load = async () => {
    if (typeof window === 'undefined') return
    isPreloading.value = true
    preloadError.value = null
    try {
      const [imgCarroceria, imgChasis, imgFrenos, imgSuspension, imgNeumaticos] = await Promise.all([
        loadImageFromUrl(IMAGENES_PDF.carroceria),
        loadImageFromUrl(IMAGENES_PDF.chasis),
        loadImageFromUrl(IMAGENES_PDF.frenos),
        loadImageFromUrl(IMAGENES_PDF.suspension),
        loadImageFromUrl(IMAGENES_PDF.neumaticos)
      ])
      carroceriaDataUrl.value = imageToDataUrl(imgCarroceria, 'image/png')
      chasisDataUrl.value = imageToDataUrl(imgChasis, 'image/jpeg', 0.9)
      frenosDataUrl.value = imageToDataUrl(imgFrenos, 'image/jpeg', 0.9)
      suspensionDataUrl.value = imageToDataUrl(imgSuspension, 'image/jpeg', 0.9)
      neumaticosDataUrl.value = imageToDataUrl(imgNeumaticos, 'image/jpeg', 0.9)
    } catch (e) {
      preloadError.value = e?.message || 'Error al precargar imágenes del PDF'
      console.warn('[usePeritajePdfPreload]', preloadError.value)
    } finally {
      isPreloading.value = false
    }
  }

  return {
    carroceriaDataUrl,
    chasisDataUrl,
    frenosDataUrl,
    suspensionDataUrl,
    neumaticosDataUrl,
    preloadError,
    isPreloading,
    load
  }
}
