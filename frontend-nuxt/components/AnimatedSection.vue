<template>
  <div
    ref="elementRef"
    :class="[
      'transition-all duration-1000 transform',
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12',
      className
    ]"
    :style="{ transitionDelay: `${delay}ms` }"
  >
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  className: {
    type: String,
    default: ''
  },
  delay: {
    type: Number,
    default: 0
  }
})

const elementRef = ref(null)
const isVisible = ref(false)

let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.1 }
  )

  if (elementRef.value) {
    observer.observe(elementRef.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>