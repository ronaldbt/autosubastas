<template>
  <div class="bg-white shadow-md rounded-lg p-4 flex flex-col gap-2 hover:shadow-lg transition">
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-bold text-gray-800">
        {{ peritaje.patente }} - {{ peritaje.marca }} {{ peritaje.modelo }}
      </h2>
      <span
        class="text-xs px-2 py-1 rounded font-semibold"
        :class="estadoColor(peritaje.estado)"
      >
        {{ peritaje.estado }}
      </span>
    </div>

    <div class="text-sm text-gray-600 flex flex-col sm:flex-row sm:justify-between">
      <div><strong>Fecha:</strong> {{ formatoFecha(peritaje.fecha) }}</div>
      <div v-if="peritaje.precio"><strong>Precio:</strong> ${{ peritaje.precio?.toLocaleString() }}</div>
    </div>

    <div class="mt-2 text-right">
      <NuxtLink
        :to="`/perito/peritajes/${peritaje.id}`"
        class="text-sm text-orange-600 hover:underline font-medium"
      >
        Ver detalle →
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
defineProps({
  peritaje: Object
})

function formatoFecha(fecha) {
  if (!fecha) return 'N/A'
  return new Date(fecha).toLocaleDateString('es-CL')
}

function estadoColor(estado) {
  switch (estado) {
    case 'PENDIENTE':
      return 'bg-yellow-100 text-yellow-800'
    case 'EN_PROCESO':
      return 'bg-blue-100 text-blue-800'
    case 'FINALIZADO':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>










