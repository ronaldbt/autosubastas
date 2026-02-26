<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Calendario</h1>
        <p class="text-gray-600 mt-2">Gestiona eventos, remates e inspecciones</p>
      </div>
      <button class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2">
        <PlusCircle :size="20" />
        <span>Nuevo Evento</span>
      </button>
    </div>

    <!-- Vista de Calendario -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            @click="previousMonth"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft :size="20" class="text-gray-600" />
          </button>
          <h2 class="text-xl font-bold text-gray-900">
            {{ currentMonthName }} {{ currentYear }}
          </h2>
          <button
            @click="nextMonth"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight :size="20" class="text-gray-600" />
          </button>
        </div>
        <button
          @click="goToToday"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Hoy
        </button>
      </div>

      <!-- Calendario Grid -->
      <div class="grid grid-cols-7 gap-2">
        <!-- Días de la semana -->
        <div
          v-for="day in daysOfWeek"
          :key="day"
          class="text-center text-sm font-medium text-gray-700 py-2"
        >
          {{ day }}
        </div>

        <!-- Días del mes -->
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="[
            'min-h-24 p-2 border border-gray-200 rounded-lg',
            day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
            day.isToday ? 'ring-2 ring-orange-500' : ''
          ]"
        >
          <div class="flex items-center justify-between mb-1">
            <span
              :class="[
                'text-sm font-medium',
                day.isToday ? 'text-orange-600' : day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              ]"
            >
              {{ day.day }}
            </span>
          </div>
          <div class="space-y-1">
            <div
              v-for="event in day.events"
              :key="event.id"
              :class="[
                'text-xs px-2 py-1 rounded truncate cursor-pointer',
                getEventClass(event.type)
              ]"
              @click="viewEvent(event)"
            >
              {{ event.title }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Eventos Próximos -->
    <div class="mt-6 bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Próximos Eventos</h2>
      <div class="space-y-3">
        <div
          v-for="event in upcomingEvents"
          :key="event.id"
          class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div
            :class="[
              'w-3 h-3 rounded-full',
              getEventDotClass(event.type)
            ]"
          ></div>
          <div class="flex-1">
            <p class="font-medium text-gray-900">{{ event.title }}</p>
            <p class="text-sm text-gray-500">{{ formatEventDate(event.fecha) }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="viewEvent(event)"
              class="px-3 py-1 text-sm text-orange-600 hover:bg-orange-50 rounded transition-colors"
            >
              Ver
            </button>
            <button
              @click="editEvent(event)"
              class="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { PlusCircle, ChevronLeft, ChevronRight, Gavel, ClipboardCheck, Calendar as CalendarIcon } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['admin']
})

const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const currentDate = ref(new Date())
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())

const currentMonthName = computed(() => {
  return currentDate.value.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })
})

// Eventos de ejemplo
const events = ref([
  {
    id: 1,
    title: 'Remate: Toyota Corolla',
    fecha: new Date(2026, 2, 20, 14, 0),
    type: 'remate'
  },
  {
    id: 2,
    title: 'Inspección: Honda Civic',
    fecha: new Date(2026, 2, 20, 10, 0),
    type: 'inspeccion'
  },
  {
    id: 3,
    title: 'Remate: Ford Ranger',
    fecha: new Date(2026, 2, 22, 15, 0),
    type: 'remate'
  },
  {
    id: 4,
    title: 'Inspección: Chevrolet Cruze',
    fecha: new Date(2026, 2, 25, 11, 0),
    type: 'inspeccion'
  }
])

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()
  
  const days = []
  const today = new Date()
  
  // Días del mes anterior
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({
      day: prevMonthLastDay - i,
      isCurrentMonth: false,
      isToday: false,
      events: []
    })
  }
  
  // Días del mes actual
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const dayEvents = events.value.filter(event => {
      const eventDate = new Date(event.fecha)
      return eventDate.getDate() === day &&
             eventDate.getMonth() === month &&
             eventDate.getFullYear() === year
    })
    
    days.push({
      day,
      isCurrentMonth: true,
      isToday: date.toDateString() === today.toDateString(),
      events: dayEvents
    })
  }
  
  // Días del mes siguiente para completar la cuadrícula
  const remainingDays = 42 - days.length
  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      day,
      isCurrentMonth: false,
      isToday: false,
      events: []
    })
  }
  
  return days
})

const upcomingEvents = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return events.value
    .filter(event => new Date(event.fecha) >= today)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .slice(0, 5)
})

const getEventClass = (type) => {
  const classes = {
    remate: 'bg-orange-100 text-orange-800',
    inspeccion: 'bg-blue-100 text-blue-800',
    evento: 'bg-purple-100 text-purple-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getEventDotClass = (type) => {
  const classes = {
    remate: 'bg-orange-500',
    inspeccion: 'bg-blue-500',
    evento: 'bg-purple-500'
  }
  return classes[type] || 'bg-gray-500'
}

const formatEventDate = (date) => {
  return new Date(date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const previousMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

const goToToday = () => {
  currentDate.value = new Date()
}

const viewEvent = (event) => {
  console.log('Ver evento:', event)
}

const editEvent = (event) => {
  console.log('Editar evento:', event)
}
</script>










