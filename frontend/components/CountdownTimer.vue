<template>
  <div class="flex justify-center gap-2 md:gap-4 my-8">
    <TimeUnit :val="timeLeft.days" label="Días" />
    <div class="text-3xl font-bold pt-2 text-gray-400">:</div>
    <TimeUnit :val="timeLeft.hours" label="Horas" />
    <div class="text-3xl font-bold pt-2 text-gray-400">:</div>
    <TimeUnit :val="timeLeft.mins" label="Min" />
    <div class="text-3xl font-bold pt-2 text-gray-400">:</div>
    <TimeUnit :val="timeLeft.secs" label="Seg" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TimeUnit from './TimeUnit.vue'

// Función para obtener el próximo viernes a las 15:00 hora de Santiago
const getNextFriday = () => {
  const now = new Date()
  
  // Obtener fecha y hora actual en Santiago
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
  
  // Calcular qué día de la semana es hoy en Santiago
  // Crear una fecha temporal para obtener el día de la semana
  const tempDate = new Date(year, month - 1, day)
  const currentDayOfWeek = tempDate.getDay() // 0=domingo, 5=viernes
  
  // Calcular días hasta el próximo viernes
  let daysToAdd = (5 - currentDayOfWeek + 7) % 7
  
  // Si hoy es viernes y ya pasó las 15:00, usar el próximo viernes
  if (currentDayOfWeek === 5 && hour >= 15) {
    daysToAdd = 7
  }
  
  // Calcular la fecha del próximo viernes (JavaScript maneja automáticamente el overflow de mes/año)
  const targetDate = new Date(year, month - 1, day + daysToAdd, 15, 0, 0)
  
  // Extraer componentes corregidos (en caso de overflow)
  const targetYear = targetDate.getFullYear()
  const targetMonth = targetDate.getMonth() + 1
  const targetDay = targetDate.getDate()
  
  // Crear string ISO para la fecha objetivo en Santiago (15:00)
  const targetDateStr = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}T15:00:00`
  
  // Convertir esta fecha de Santiago a UTC usando un método más directo
  // Calcular el offset actual de Santiago comparando UTC actual con Santiago actual
  const nowUTC = now.getTime()
  
  // Obtener la representación en Santiago de "ahora"
  const nowSantiagoParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(now)
  
  const sYear = parseInt(nowSantiagoParts.find(p => p.type === 'year').value)
  const sMonth = parseInt(nowSantiagoParts.find(p => p.type === 'month').value)
  const sDay = parseInt(nowSantiagoParts.find(p => p.type === 'day').value)
  const sHour = parseInt(nowSantiagoParts.find(p => p.type === 'hour').value)
  const sMin = parseInt(nowSantiagoParts.find(p => p.type === 'minute').value)
  
  // Crear una fecha local con estos componentes (será interpretada como hora local del navegador)
  const nowSantiagoAsLocal = new Date(sYear, sMonth - 1, sDay, sHour, sMin, 0)
  
  // Calcular el offset: la diferencia entre UTC y esta representación local
  // Si Santiago está UTC-3, cuando es 15:00 en Santiago es 18:00 UTC
  // Entonces offsetMs será positivo (18:00 - 15:00 = 3 horas = 10800000 ms)
  const offsetMs = nowUTC - nowSantiagoAsLocal.getTime()
  
  // Crear la fecha objetivo en hora local (que representa 15:00 en Santiago)
  // Ya tenemos targetDate que es la fecha correcta, así que la usamos directamente
  const targetAsLocal = targetDate
  
  // Convertir a UTC sumando el offset
  const targetUTC = new Date(targetAsLocal.getTime() + offsetMs)
  
  return targetUTC
}

const timeLeft = ref({ days: 0, hours: 0, mins: 0, secs: 0 })
let timer = null

const calculateTimeLeft = () => {
  const nextFriday = getNextFriday()
  const now = new Date()
  const diff = nextFriday.getTime() - now.getTime()
  
  if (diff <= 0) {
    // Si ya pasó, recalcular (esto no debería pasar frecuentemente)
    const newNextFriday = getNextFriday()
    const newDiff = newNextFriday.getTime() - now.getTime()
    const days = Math.max(0, Math.floor(newDiff / (1000 * 60 * 60 * 24)))
    const hours = Math.max(0, Math.floor((newDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
    const mins = Math.max(0, Math.floor((newDiff % (1000 * 60 * 60)) / (1000 * 60)))
    const secs = Math.max(0, Math.floor((newDiff % (1000 * 60)) / 1000))
    timeLeft.value = { days, hours, mins, secs }
  } else {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const secs = Math.floor((diff % (1000 * 60)) / 1000)
    timeLeft.value = { days, hours, mins, secs }
  }
}

onMounted(() => {
  calculateTimeLeft()
  timer = setInterval(() => {
    calculateTimeLeft()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>
