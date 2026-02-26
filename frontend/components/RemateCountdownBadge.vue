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

/** Formato corto: "3d 5h 20m 30s" */
function getCountdown(fin) {
  if (!fin) return { text: '', expired: true }
  const end = new Date(fin)
  const now = new Date()
  if (end <= now) return { text: 'Finalizado', expired: true }
  let diffMs = end - now
  const d = Math.floor(diffMs / (24 * 60 * 60 * 1000))
  diffMs %= 24 * 60 * 60 * 1000
  const h = Math.floor(diffMs / (60 * 60 * 1000))
  diffMs %= 60 * 60 * 1000
  const m = Math.floor(diffMs / (60 * 1000))
  diffMs %= 60 * 1000
  const s = Math.floor(diffMs / 1000)
  const parts = []
  if (d > 0) parts.push(`${d}d`)
  parts.push(`${h}h`)
  parts.push(`${m}m`)
  parts.push(`${s}s`)
  return { text: parts.join(' '), expired: false }
}

const now = ref(Date.now())
const countdown = computed(() => {
  const _ = now.value
  return getCountdown(props.fechaFinRemate)
})

let interval
onMounted(() => {
  interval = setInterval(() => { now.value = Date.now() }, 1000)
})
onUnmounted(() => clearInterval(interval))
</script>
