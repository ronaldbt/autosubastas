<template>
  <div class="border-b border-gray-100 last:border-b-0">
    <button
      @click="emit('update:open', !props.open)"
      class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
    >
      <span class="font-semibold text-gray-900">{{ title }}</span>
      <svg
        :class="['w-5 h-5 text-gray-500 transition-transform', props.open && 'rotate-180']"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[500px]"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-[500px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-show="props.open" class="overflow-hidden">
        <div class="pb-3">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  open: { type: Boolean, default: true }
})

const emit = defineEmits(['update:open'])
</script>
