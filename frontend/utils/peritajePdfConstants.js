/**
 * Rutas de imágenes estáticas usadas en el PDF de peritaje (deben existir en public/)
 */
export const IMAGENES_PDF = {
  carroceria: '/carroceria_peritaje.png',
  chasis: '/chasis_peritaje.webp',
  frenos: '/frenos_peritaje.webp',
  suspension: '/suspension_peritaje.webp',
  neumaticos: '/neumaticos_peritaje.webp'
}

/**
 * Layout del PDF (A4 portrait): márgenes y tamaños máximos para diagramas
 */
export const PDF_LAYOUT = {
  margin: 15,
  /** Alto máximo (mm) para diagramas de carrocería/chasis/frenos/etc. */
  maxHeightDiagrama: 50,
  /** Alto máximo para grids de fotos (mm) por imagen */
  maxHeightFotoGrid: 35,
  /** Punto Y a partir del cual conviene nueva página (mm) */
  newPageThreshold: 250,
  /** Ancho de contenido (se calcula en generatePDF como pageWidth - 2*margin) */
  getContentWidth (pageWidth) {
    return pageWidth - (this.margin * 2)
  }
}
