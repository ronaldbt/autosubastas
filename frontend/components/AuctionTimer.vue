<template>
  <div
    :class="[
      'flex items-center gap-2 px-4 py-2 rounded-full font-black text-sm transition-all duration-500 shadow-sm',
      getStyles()
    ]"
  >
    <svg
      :class="['w-4 h-4', currentLevel === UrgencyLevel.FINAL_CALL ? 'animate-spin' : '']"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        :stroke-width="3"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span>
      {{ formatTime() }}
    </span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { UrgencyLevel } from '~/utils/auctionConstants'

const props = defineProps({
  endTime: {
    type: Date,
    required: true
  },
  onUrgencyChange: {
    type: Function,
    default: null
  },
  onEnd: {
    type: Function,
    default: null
  }
})

const timeLeft = ref(0)
const currentLevel = ref(UrgencyLevel.STABLE)
let intervalId = null

const calculateTime = () => {
  const now = new Date().getTime()
  const distance = new Date(props.endTime).getTime() - now
  
  let level = UrgencyLevel.STABLE
  const minutes = distance / (1000 * 60)
  
  if (distance <= 0) {
    if (props.onEnd) props.onEnd()
    return 0
  }

  if (minutes < 1) level = UrgencyLevel.FINAL_CALL
  else if (minutes < 5) level = UrgencyLevel.CRITICAL
  else if (minutes < 10) level = UrgencyLevel.WARNING

  if (level !== currentLevel.value) {
    currentLevel.value = level
    if (props.onUrgencyChange) props.onUrgencyChange(level)
  }

  return distance
}

const formatTime = () => {
  const t = Math.max(0, timeLeft.value)
  const d = Math.floor(t / (24 * 60 * 60 * 1000))
  const h = Math.floor((t % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  const m = Math.floor((t % (60 * 60 * 1000)) / (60 * 1000))
  const s = Math.floor((t % (60 * 1000)) / 1000)
  const parts = []
  if (d > 0) parts.push(`${d}d`)
  parts.push(`${h}h`)
  parts.push(`${m}m`)
  parts.push(`${s}s`)
  return parts.join(' ')
}

const getStyles = () => {
  switch (currentLevel.value) {
    case UrgencyLevel.FINAL_CALL:
      return 'bg-red-600 text-white animate-bounce ring-4 ring-red-200'
    case UrgencyLevel.CRITICAL:
      return 'bg-red-100 text-red-600 animate-pulse border border-red-200'
    case UrgencyLevel.WARNING:
      return 'bg-amber-100 text-amber-600 border border-amber-200'
    default:
      return 'bg-blue-50 text-blue-600 border border-blue-100'
  }
}

watch(() => props.endTime, () => {
  if (intervalId) {
    clearInterval(intervalId)
  }
  timeLeft.value = calculateTime()
  intervalId = setInterval(() => {
    timeLeft.value = calculateTime()
  }, 1000)
}, { immediate: true })

onMounted(() => {
  timeLeft.value = calculateTime()
  intervalId = setInterval(() => {
    timeLeft.value = calculateTime()
  }, 1000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

