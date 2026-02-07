<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full text-center">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-6xl font-bold text-gray-200 mb-4">{{ error?.statusCode || 404 }}</div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          {{ error?.statusCode === 404 ? 'Página no encontrada' : 'Algo salió mal' }}
        </h1>
        <p class="text-gray-600 mb-8">
          {{ error?.statusCode === 404
            ? 'La página que buscas no existe o fue movida.'
            : (error?.message || 'Ha ocurrido un error. Intenta de nuevo.') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/"
            class="inline-flex justify-center items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
          >
            Volver al inicio
          </NuxtLink>
          <NuxtLink
            to="/login"
            class="inline-flex justify-center items-center px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Iniciar sesión
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  error: {
    type: Object,
    default: () => ({ statusCode: 404, message: 'Page not found' })
  }
})
</script>
