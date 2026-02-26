/**
 * Formato chileno: miles con punto, sin decimales para precios en pesos.
 * Ej: 11500000 → "11.500.000"
 */
export function formatPriceChile (value) {
  if (value == null || value === '' || Number.isNaN(Number(value))) return '—'
  const n = Math.round(Number(value))
  return n.toLocaleString('es-CL', { maximumFractionDigits: 0, minimumFractionDigits: 0 })
}

/**
 * Kilometraje en formato chileno. Ej: 45000 → "45.000 km"
 */
export function formatKilometrajeChile (value) {
  if (value == null || value === '' || Number.isNaN(Number(value))) return null
  const n = Math.round(Number(value))
  return n.toLocaleString('es-CL', { maximumFractionDigits: 0, minimumFractionDigits: 0 }) + ' km'
}
