/**
 * Calcula el texto de cuenta regresiva hasta fechaFinRemate
 * @param {Date|string|null} fechaFinRemate
 * @returns {{ text: string, expired: boolean }}
 */
export function useRemateCountdown(fechaFinRemate) {
  if (!fechaFinRemate) return { text: '', expired: true }
  const fin = new Date(fechaFinRemate)
  const ahora = new Date()
  if (fin <= ahora) return { text: 'Finalizado', expired: true }

  const diffMs = fin - ahora
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000))
  const diffHours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))

  if (diffDays > 0) {
    return { text: `${diffDays} día${diffDays !== 1 ? 's' : ''} restante${diffDays !== 1 ? 's' : ''}`, expired: false }
  }
  if (diffHours > 0) {
    return { text: `${diffHours} hora${diffHours !== 1 ? 's' : ''} restante${diffHours !== 1 ? 's' : ''}`, expired: false }
  }
  const diffMins = Math.floor(diffMs / (60 * 1000))
  return { text: `${diffMins} min restantes`, expired: false }
}
