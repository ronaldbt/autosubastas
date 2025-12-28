<template>
  <div class="text-center px-2 md:px-4">
    <div class="bg-gray-900 text-white rounded-lg p-3 min-w-[60px] md:min-w-[80px]">
      <div class="text-2xl md:text-3xl font-bold font-mono">
        {{ val.toString().padStart(2, '0') }}
      </div>
    </div>
    <div class="text-xs uppercase mt-2 font-semibold text-gray-500">{{ label }}</div>
  </div>
</template>

<script setup>
defineProps({
  val: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    required: true
  }
})
</script>