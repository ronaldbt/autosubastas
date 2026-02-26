<template>
  <div class="font-sans text-gray-900 bg-white min-h-screen">
    <Header />
    <main class="pt-24 pb-16">
      <div v-if="loading" class="container mx-auto px-4 py-20 text-center">
        <div class="animate-spin w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full mx-auto" />
        <p class="mt-4 text-gray-600">Cargando detalle del remate...</p>
      </div>

      <div v-else-if="error" class="container mx-auto px-4 py-20">
        <div class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl max-w-xl mx-auto text-center">
          <p class="font-semibold">{{ error }}</p>
          <NuxtLink to="/remates" class="mt-4 inline-block text-brand-orange font-bold hover:underline">Volver a remates</NuxtLink>
        </div>
      </div>

      <div v-else-if="auto" class="container mx-auto px-4 max-w-5xl">
        <NuxtLink to="/remates" class="inline-flex items-center gap-2 text-gray-600 hover:text-brand-orange font-semibold mb-8">
          <ArrowLeft :size="20" />
          Volver a remates activos
        </NuxtLink>

        <div class="grid md:grid-cols-2 gap-8">
          <div class="space-y-4">
            <div class="rounded-2xl overflow-hidden bg-gray-100 aspect-video">
              <img
                :src="mainImageUrl"
                :alt="auto.marca + ' ' + auto.modelo"
                class="w-full h-full object-cover"
              />
            </div>
            <div v-if="auto.estado === 'en_remate' && auto.fechaFinRemate" class="flex items-center gap-2 p-4 bg-green-50 rounded-xl">
              <Clock class="w-5 h-5 text-green-600 flex-shrink-0" />
              <span class="font-bold text-green-800">Tiempo restante: <RemateCountdownBadge :fecha-fin-remate="auto.fechaFinRemate" /></span>
            </div>
          </div>

          <div>
            <div class="mb-4">
              <span class="bg-brand-orange text-white text-xs font-bold px-2 py-1 rounded uppercase">En remate</span>
            </div>
            <h1 class="text-3xl font-extrabold text-gray-900 mb-2">{{ auto.marca }} {{ auto.modelo }}</h1>
            <p class="text-gray-500 text-lg mb-6">{{ auto.anio }} · {{ fuelLabel }}<template v-if="auto.kilometraje != null && auto.kilometraje > 0"> · {{ formatKilometrajeChile(auto.kilometraje) }}</template></p>

            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="p-4 bg-gray-50 rounded-xl">
                <p class="text-xs text-gray-500 uppercase font-semibold">Precio mínimo</p>
                <p class="text-lg font-bold text-gray-900">${{ formatPriceChile(auto.precioBase || auto.precioActual) }}</p>
              </div>
            </div>

            <div v-if="auto.ultimaOferta != null" class="p-4 bg-amber-50 rounded-xl flex items-center justify-between gap-4 mb-6">
              <span class="font-semibold text-amber-800 flex items-center gap-2">
                <Wrench :size="20" />
                Última oferta
              </span>
              <span class="text-2xl font-bold text-gray-900">${{ formatPriceChile(auto.ultimaOferta) }}</span>
            </div>

            <p class="text-gray-600 mb-8">{{ auto.descripcion || 'Vehículo inspeccionado, en buen estado. Participa en el remate pujando por este auto.' }}</p>

            <div class="flex flex-col sm:flex-row gap-4">
              <NuxtLink
                to="/login"
                class="inline-flex justify-center items-center gap-2 bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-colors"
              >
                Iniciar sesión para pujar
              </NuxtLink>
              <NuxtLink
                to="/registro"
                class="inline-flex justify-center items-center gap-2 bg-white border-2 border-gray-300 hover:border-brand-orange text-gray-900 font-bold py-4 px-8 rounded-xl transition-colors"
              >
                Registrarme como comprador
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowLeft, Clock, Wrench } from 'lucide-vue-next'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import RemateCountdownBadge from '~/components/RemateCountdownBadge.vue'
import { useImageUrl } from '~/composables/useImageUrl'
import { formatPriceChile, formatKilometrajeChile } from '~/utils/format'

// Página pública: ver detalle del remate sin login; para pujar se pide login en la misma página
definePageMeta({ auth: false })

if (typeof window !== 'undefined') {
  console.log('[Remates Detalle] Script setup ejecutado (página /remates/[id])')
}

const route = useRoute()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'
const { getImageUrl } = useImageUrl()

const loading = ref(true)
const error = ref(null)
const auto = ref(null)

const mainImageUrl = computed(() => {
  if (!auto.value?.imagenes?.length) return 'https://picsum.photos/seed/car/800/600'
  return getImageUrl(auto.value.imagenes[0])
})

const fuelLabel = computed(() => {
  const c = (auto.value?.peritaje?.combustible || '').toUpperCase()
  const map = { DIESEL: 'Diésel', GASOLINA: 'Gasolina', ELECTRICO: 'Eléctrico', BENCINA: 'Bencina' }
  return map[c] || c || '—'
})

onMounted(async () => {
  const id = route.params.id
  console.log('[Remates Detalle] onMounted route.params=', route.params, 'id=', id, 'path=', route.path, 'API_BASE=', API_BASE)
  if (!id) {
    error.value = 'ID no válido'
    loading.value = false
    console.warn('[Remates Detalle] ID no válido')
    return
  }
  try {
    const url = `${API_BASE}/autos/${id}`
    console.log('[Remates Detalle] Fetching', url)
    auto.value = await $fetch(url)
    console.log('[Remates Detalle] Auto cargado OK', auto.value?.id, auto.value?.marca, auto.value?.modelo)
  } catch (e) {
    console.error('[Remates Detalle] Error fetch', e)
    error.value = e.data?.message || e.message || 'No se pudo cargar el remate'
  } finally {
    loading.value = false
  }
})

const configSeo = useRuntimeConfig()
const siteUrl = configSeo.public.siteUrl || 'https://autoremates.cl'

useSeoMeta({
  title: () => auto.value ? `${auto.value.marca} ${auto.value.modelo} ${auto.value.anio} – Remate | AutoRemates` : 'Remate | AutoRemates',
  description: () => auto.value ? `Remate de ${auto.value.marca} ${auto.value.modelo} ${auto.value.anio}. Vehículo inspeccionado. Puja por este auto.` : 'Remate de autos en Chile.',
  ogUrl: () => siteUrl + route.path
})

useHead({
  link: () => [{ rel: 'canonical', href: siteUrl + route.path }]
})
</script>
