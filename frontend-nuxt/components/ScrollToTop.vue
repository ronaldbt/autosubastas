<template>
  <div :class="[
    'fixed bottom-8 right-8 z-40 transition-opacity duration-300',
    visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
  ]">
    <button 
      @click="scrollToTop"
      class="bg-gray-900 hover:bg-gray-800 text-white p-3 rounded-full shadow-lg transition-transform hover:-translate-y-1"
    >
      <ArrowUp :size="24" />
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowUp } from 'lucide-vue-next'

const visible = ref(false)

const toggleVisibility = () => {
  if (window.pageYOffset > 300) {
    visible.value = true
  } else {
    visible.value = false
  }
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}

onMounted(() => {
  window.addEventListener("scroll", toggleVisibility)
})

onUnmounted(() => {
  window.removeEventListener("scroll", toggleVisibility)
})
</script>