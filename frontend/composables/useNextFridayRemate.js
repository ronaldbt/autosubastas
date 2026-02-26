/**
 * Texto del próximo remate: viernes 15:00 America/Santiago.
 * Para la cuenta regresiva visual usar el componente CountdownTimer.
 */
import { computed } from 'vue'

function getNextFridayDate () {
  const now = new Date()
  const santiagoParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(now)

  const year = parseInt(santiagoParts.find(p => p.type === 'year').value)
  const month = parseInt(santiagoParts.find(p => p.type === 'month').value)
  const day = parseInt(santiagoParts.find(p => p.type === 'day').value)
  const hour = parseInt(santiagoParts.find(p => p.type === 'hour').value)

  const tempDate = new Date(year, month - 1, day)
  const currentDayOfWeek = tempDate.getDay()
  let daysToAdd = (5 - currentDayOfWeek + 7) % 7
  if (currentDayOfWeek === 5 && hour >= 15) daysToAdd = 7

  return new Date(year, month - 1, day + daysToAdd)
}

export function useNextFridayRemate () {
  const nextFridayText = computed(() => {
    const date = getNextFridayDate()
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    return `Viernes ${date.getDate()} ${months[date.getMonth()]}`
  })
  return { nextFridayText, getNextFridayDate }
}
