<template>
  <span
    v-if="countdown.text"
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold',
      countdown.expired ? 'bg-gray-200 text-gray-600' : 'bg-green-500 text-white'
    ]"
  >
    <Clock v-if="!countdown.expired" class="w-3.5 h-3.5" />
    {{ countdown.text }}
  </span>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Clock } from 'lucide-vue-next'

const props = defineProps({
  fechaFinRemate: { type: [Date, String], default: null }
})

function getCountdown(fin) {
  if (!fin) return { text: '', expired: true }
  const end = new Date(fin)
  const now = new Date()
  if (end <= now) return { text: 'Finalizado', expired: true }
  const diffMs = end - now
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000))
  const diffHours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  if (diffDays > 0) return { text: `${diffDays} día${diffDays !== 1 ? 's' : ''} restante${diffDays !== 1 ? 's' : ''}`, expired: false }
  if (diffHours > 0) return { text: `${diffHours} hora${diffHours !== 1 ? 's' : ''} restante${diffHours !== 1 ? 's' : ''}`, expired: false }
  const diffMins = Math.floor(diffMs / (60 * 1000))
  return { text: `${diffMins} min restantes`, expired: false }
}

const now = ref(Date.now())
const countdown = computed(() => {
  const _ = now.value // react to timer
  return getCountdown(props.fechaFinRemate)
})

let interval
onMounted(() => {
  interval = setInterval(() => { now.value = Date.now() }, 60000)
})
onUnmounted(() => clearInterval(interval))
</script>
