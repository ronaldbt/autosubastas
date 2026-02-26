<template>
  <div class="font-sans text-gray-900 bg-white min-h-screen">
    <Header />
    <main class="pt-24 pb-16">
      <div class="container mx-auto px-4">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-extrabold text-gray-900 mb-4">Remates Activos de Autos</h1>
          <p class="text-xl text-gray-600 max-w-3xl">
            Remates online de autos de particulares y empresas en Chile. Vehículos inspeccionados, en buen estado.
          </p>
        </div>

        <!-- Barra búsqueda + Ordenar -->
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
          <div class="flex-1 relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="¿Qué estás buscando?"
              class="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none"
            />
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-gray-600">Ordenar por</span>
            <select
              v-model="sortBy"
              class="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none bg-white"
            >
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="anio-desc">Más recientes primero</option>
              <option value="anio-asc">Más antiguos primero</option>
            </select>
          </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Sidebar filtros (izquierda) -->
          <aside class="lg:w-72 flex-shrink-0">
            <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-24">
              <div class="p-4 border-b border-gray-100">
                <h2 class="text-lg font-bold text-brand-orange">Filtros ({{ activeFiltersCount }})</h2>
              </div>

              <div class="divide-y divide-gray-100">
                <!-- Tipo auto -->
                <FilterSection v-model:open="filterOpen.tipoAuto" title="Tipo auto">
                  <label
                    v-for="opt in filterOptions.tipoAuto"
                    :key="opt.value"
                    class="flex items-center gap-3 py-2 px-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      v-model="filters.tipoAuto"
                      type="checkbox"
                      :value="opt.value"
                      class="rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
                    />
                    <span class="text-gray-700">{{ opt.label }}</span>
                    <span class="text-gray-400 text-sm ml-auto">({{ opt.count }})</span>
                  </label>
                </FilterSection>

                <!-- Marca -->
                <FilterSection v-model:open="filterOpen.marca" title="Marca">
                  <div class="max-h-48 overflow-y-auto">
                    <label
                      v-for="opt in filterOptions.marca"
                      :key="opt.value"
                      class="flex items-center gap-3 py-2 px-4 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        v-model="filters.marca"
                        type="checkbox"
                        :value="opt.value"
                        class="rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
                      />
                      <span class="text-gray-700">{{ opt.label }}</span>
                      <span class="text-gray-400 text-sm ml-auto">({{ opt.count }})</span>
                    </label>
                  </div>
                </FilterSection>

                <!-- Modelo -->
                <FilterSection v-model:open="filterOpen.modelo" title="Modelo">
                  <div class="max-h-48 overflow-y-auto">
                    <label
                      v-for="opt in filterOptions.modelo"
                      :key="opt.value"
                      class="flex items-center gap-3 py-2 px-4 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        v-model="filters.modelo"
                        type="checkbox"
                        :value="opt.value"
                        class="rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
                      />
                      <span class="text-gray-700">{{ opt.label }}</span>
                      <span class="text-gray-400 text-sm ml-auto">({{ opt.count }})</span>
                    </label>
                  </div>
                </FilterSection>

                <!-- Año -->
                <FilterSection v-model:open="filterOpen.anio" title="Año">
                  <div class="max-h-48 overflow-y-auto">
                    <label
                      v-for="opt in filterOptions.anio"
                      :key="opt.value"
                      class="flex items-center gap-3 py-2 px-4 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        v-model="filters.anio"
                        type="checkbox"
                        :value="opt.value"
                        class="rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
                      />
                      <span class="text-gray-700">{{ opt.label }}</span>
                      <span class="text-gray-400 text-sm ml-auto">({{ opt.count }})</span>
                    </label>
                  </div>
                </FilterSection>

                <!-- Combustible -->
                <FilterSection v-model:open="filterOpen.combustible" title="Combustible">
                  <label
                    v-for="opt in filterOptions.combustible"
                    :key="opt.value"
                    class="flex items-center gap-3 py-2 px-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      v-model="filters.combustible"
                      type="checkbox"
                      :value="opt.value"
                      class="rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
                    />
                    <span class="text-gray-700">{{ opt.label }}</span>
                    <span class="text-gray-400 text-sm ml-auto">({{ opt.count }})</span>
                  </label>
                </FilterSection>

                <!-- Tracción -->
                <FilterSection v-model:open="filterOpen.traccion" title="Tracción">
                  <label
                    v-for="opt in filterOptions.traccion"
                    :key="opt.value"
                    class="flex items-center gap-3 py-2 px-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      v-model="filters.traccion"
                      type="checkbox"
                      :value="opt.value"
                      class="rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
                    />
                    <span class="text-gray-700">{{ opt.label }}</span>
                    <span class="text-gray-400 text-sm ml-auto">({{ opt.count }})</span>
                  </label>
                  <p v-if="filterOptions.traccion.length === 0" class="px-4 py-2 text-gray-400 text-sm">Sin datos</p>
                </FilterSection>

                <!-- Transmisión -->
                <FilterSection v-model:open="filterOpen.transmision" title="Transmisión">
                  <label
                    v-for="opt in filterOptions.transmision"
                    :key="opt.value"
                    class="flex items-center gap-3 py-2 px-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      v-model="filters.transmision"
                      type="checkbox"
                      :value="opt.value"
                      class="rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
                    />
                    <span class="text-gray-700">{{ opt.label }}</span>
                    <span class="text-gray-400 text-sm ml-auto">({{ opt.count }})</span>
                  </label>
                </FilterSection>
              </div>

              <div class="p-4 border-t border-gray-100">
                <button
                  @click="clearFilters"
                  class="flex items-center gap-2 text-brand-orange font-semibold hover:underline text-sm"
                >
                  <Menu class="w-4 h-4" />
                  Menos filtros
                </button>
              </div>
            </div>
          </aside>

          <!-- Contenido principal (derecha) -->
          <div class="flex-1 min-w-0">
            <p class="mb-4 text-gray-600 text-sm">Cada remate tiene su propio plazo. Inicia sesión como comprador para pujar.</p>

            <!-- Grid de autos -->
            <div v-if="loading" class="flex justify-center py-20">
              <div class="animate-spin w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full" />
            </div>

            <template v-else>
              <p class="text-gray-600 mb-6 font-semibold">{{ filteredCars.length }} Resultados</p>

              <div v-if="filteredCars.length === 0" class="text-center py-16 bg-gray-50 rounded-2xl">
                <p class="text-gray-600 text-lg">
                  {{ activeFiltersCount > 0 ? 'No hay autos disponibles con los filtros seleccionados.' : 'No hay remates activos en este momento.' }}
                </p>
                <p v-if="activeFiltersCount === 0" class="text-gray-500 text-sm mt-2">Los autos aparecerán aquí cuando un administrador los envíe a subasta desde el panel de admin.</p>
                <button
                  v-if="activeFiltersCount > 0"
                  @click="clearFilters"
                  class="mt-4 text-brand-orange font-semibold hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>

              <div v-else class="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <div
                  v-for="car in filteredCars"
                  :key="car.id"
                  class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group"
                >
                  <div class="relative h-48 overflow-hidden bg-gray-100">
                    <div class="absolute top-3 left-3 z-10 flex flex-col gap-2">
                      <div class="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                        <Check class="w-3 h-3" />
                        INSPECCIONADO
                      </div>
                      <RemateCountdownBadge v-if="car.fechaFinRemate" :fecha-fin-remate="car.fechaFinRemate" />
                    </div>
                    <div class="absolute top-3 right-3 z-10 flex flex-col gap-2">
                      <button
                        type="button"
                        @click.stop="toggleFavorite(car.id)"
                        class="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center transition"
                        :title="isFavorite(car.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'"
                      >
                        <Heart
                          :size="18"
                          :class="isFavorite(car.id) ? 'text-red-500 fill-red-500' : 'text-gray-600'"
                        />
                      </button>
                      <button
                        type="button"
                        @click.stop="shareCar(car)"
                        class="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center transition"
                        title="Compartir"
                      >
                        <Share2 :size="18" class="text-gray-600" />
                      </button>
                    </div>
                    <img
                      :src="car.imageUrl"
                      :alt="car.title"
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <NuxtLink
                        :to="`/remates/${car.id}`"
                        class="w-full bg-white text-gray-900 font-bold py-2 rounded-lg shadow hover:bg-brand-orange hover:text-white transition-colors text-center block text-sm"
                      >
                        Ver detalles y pujar
                      </NuxtLink>
                    </div>
                  </div>
                  <div class="p-4 flex-1 flex flex-col">
                    <h3 class="text-lg font-bold text-gray-900 mb-1">{{ car.title }}</h3>
                    <p class="text-gray-500 text-sm mb-3">{{ car.year }} · {{ car.fuelLabel }}</p>
                    <div class="flex flex-wrap gap-1.5 mb-4">
                      <span v-if="car.transmission && car.transmission !== '—'" class="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded uppercase">
                        {{ car.transmission }}
                      </span>
                      <span v-if="car.km < 50000" class="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">POCO KILOMETRAJE</span>
                    </div>
                    <div v-if="car.ultimaOferta != null" class="mb-3 p-2.5 bg-amber-50 rounded-lg flex items-center justify-between gap-2">
                      <span class="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                        <Wrench :size="14" />
                        Última oferta
                      </span>
                      <span class="text-base font-bold text-gray-900">${{ (car.ultimaOferta / 1000).toLocaleString('es-CL') }}</span>
                    </div>
                    <div class="mt-auto pt-3 border-t border-gray-100">
                      <span class="text-xs text-gray-500">Mín</span>
                      <p class="text-xl font-bold text-gray-900">
                        ${{ (car.reservePrice / 1000).toLocaleString('es-CL') }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- CTA -->
        <section class="mt-16 bg-gray-50 rounded-2xl p-8 text-center">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">¿Quieres comprar en el remate?</h2>
          <p class="text-gray-600 mb-6 max-w-xl mx-auto">
            Regístrate como comprador (dealer) para participar en las subastas online. Es gratuito.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/registro" class="bg-brand-orange hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors">
              Registrarme como comprador
            </NuxtLink>
            <NuxtLink to="/login" class="bg-white border-2 border-gray-300 hover:border-brand-orange text-gray-900 px-8 py-4 rounded-xl font-bold text-lg transition-colors">
              Ya tengo cuenta
            </NuxtLink>
          </div>
        </section>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Search, Menu, Check, Heart, Share2, Wrench } from 'lucide-vue-next'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import FilterSection from '~/components/FilterSection.vue'
import RemateCountdownBadge from '~/components/RemateCountdownBadge.vue'
import { useImageUrl } from '~/composables/useImageUrl'

const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'
const siteUrl = config.public.siteUrl || 'https://autoremates.cl'
const { getImageUrl } = useImageUrl()

const FAVORITES_KEY = 'autoremates_favorites'
const favorites = ref(new Set(JSON.parse(typeof localStorage !== 'undefined' ? (localStorage.getItem(FAVORITES_KEY) || '[]') : '[]')))

function isFavorite(id) {
  return favorites.value.has(Number(id))
}

function toggleFavorite(id) {
  const n = Number(id)
  const next = new Set(favorites.value)
  if (next.has(n)) next.delete(n)
  else next.add(n)
  favorites.value = next
  if (typeof localStorage !== 'undefined') localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]))
}

function shareCar(car) {
  const url = `${siteUrl}/remates/${car.id}`
  const text = `${car.title} ${car.year} – Remate AutoRemates`
  if (navigator.share) {
    navigator.share({ title: text, url, text }).catch(() => {})
  } else {
    navigator.clipboard?.writeText(url).then(() => alert('Enlace copiado'))
  }
}

const loading = ref(true)
const allCars = ref([])
const searchQuery = ref('')
const sortBy = ref('precio-asc')

const TIPO_LABELS = {
  AUTOMOVIL: 'Automóvil',
  CAMIONETA: 'Camioneta',
  SUV: 'SUV',
  MOTOCICLETA: 'Motocicleta',
  CAMION: 'Camión',
  BUS: 'Bus'
}

const COMBUSTIBLE_LABELS = {
  DIESEL: 'Diésel',
  GASOLINA: 'Gasolina',
  ELECTRICO: 'Eléctrico',
  BENCINA: 'Bencina'
}

const filterOpen = reactive({
  tipoAuto: true,
  marca: true,
  modelo: false,
  anio: true,
  combustible: true,
  traccion: false,
  transmision: true
})

const filters = reactive({
  tipoAuto: [],
  marca: [],
  modelo: [],
  anio: [],
  combustible: [],
  traccion: [],
  transmision: []
})

function mapAutoToCard(auto) {
  const tipo = auto.peritaje?.tipoTransporte || 'AUTOMOVIL'
  const fuel = (auto.peritaje?.combustible || '').toUpperCase() || 'GASOLINA'
  const trans = auto.peritaje?.transmision || null
  return {
    id: auto.id,
    marca: (auto.marca || '').trim(),
    modelo: (auto.modelo || '').trim(),
    title: `${auto.marca || ''} ${auto.modelo || ''}`.trim() || 'Auto',
    year: auto.anio || '—',
    km: Number(auto.kilometraje) || 0,
    transmission: trans,
    fuel: fuel,
    fuelLabel: COMBUSTIBLE_LABELS[fuel] || fuel,
    tipoTransporte: tipo,
    tipoLabel: TIPO_LABELS[tipo] || tipo,
    traccion: auto.peritaje?.traccion || null,
    reservePrice: Number(auto.precioBase) || Number(auto.precioActual) || 0,
    ultimaOferta: auto.ultimaOferta != null ? Number(auto.ultimaOferta) : null,
    fechaFinRemate: auto.fechaFinRemate || null,
    imageUrl: (auto.imagenes && auto.imagenes[0]) ? getImageUrl(auto.imagenes[0]) : 'https://picsum.photos/seed/car' + auto.id + '/800/600',
    inspected: true
  }
}

function buildFilterOptions(cars) {
  const tipoCounts = {}
  cars.forEach(c => {
    const v = c.tipoTransporte || c.tipoLabel
    if (v) {
      const label = TIPO_LABELS[v] || v
      tipoCounts[label] = (tipoCounts[label] || 0) + 1
    }
  })
  const tipoAuto = Object.entries(tipoCounts).map(([value, count]) => ({ value, label: value, count }))

  const marcaCounts = {}
  cars.forEach(c => {
    const v = c.marca || c.title?.split(' ')[0]
    if (v) {
      const m = (v || '').trim()
      if (m) marcaCounts[m] = (marcaCounts[m] || 0) + 1
    }
  })
  const marca = Object.entries(marcaCounts).map(([value, count]) => ({ value, label: value, count })).sort((a, b) => b.count - a.count)

  const modeloCounts = {}
  cars.forEach(c => {
    const v = c.modelo || c.title
    if (v) modeloCounts[v] = (modeloCounts[v] || 0) + 1
  })
  const modelo = Object.entries(modeloCounts).map(([value, count]) => ({ value, label: value, count })).sort((a, b) => b.count - a.count)
  const anioCounts = {}
  cars.forEach(c => {
    const v = c.year
    if (v != null && v !== '—') {
      const y = String(v)
      anioCounts[y] = (anioCounts[y] || 0) + 1
    }
  })
  const anio = Object.entries(anioCounts).map(([value, count]) => ({ value, label: value, count })).sort((a, b) => Number(b.value) - Number(a.value))
  const combCounts = {}
  cars.forEach(c => {
    const v = c.fuelLabel
    if (v) combCounts[v] = (combCounts[v] || 0) + 1
  })
  const combustible = Object.entries(combCounts).map(([value, count]) => ({ value, label: value, count })).sort((a, b) => b.count - a.count)
  const traccion = [] // no hay datos
  const transCounts = {}
  cars.forEach(c => {
    const v = c.transmission
    if (v && v !== '—') transCounts[v] = (transCounts[v] || 0) + 1
  })
  const transmision = Object.entries(transCounts).map(([value, count]) => ({ value, label: value, count })).sort((a, b) => b.count - a.count)

  return { tipoAuto, marca, modelo, anio, combustible, traccion, transmision }
}

const filterOptions = computed(() => buildFilterOptions(allCars.value))

const filteredCars = computed(() => {
  let list = [...allCars.value]

  if (filters.tipoAuto.length) {
    list = list.filter(c => filters.tipoAuto.includes(c.tipoLabel || TIPO_LABELS[c.tipoTransporte]))
  }
  if (filters.marca.length) {
    list = list.filter(c => c.marca && filters.marca.includes(c.marca))
  }
  if (filters.modelo.length) {
    list = list.filter(c => filters.modelo.includes(c.modelo || c.title))
  }
  if (filters.anio.length) {
    list = list.filter(c => filters.anio.includes(String(c.year)))
  }
  if (filters.combustible.length) {
    list = list.filter(c => filters.combustible.includes(c.fuelLabel))
  }
  if (filters.traccion.length) {
    list = list.filter(c => c.traccion && filters.traccion.includes(c.traccion))
  }
  if (filters.transmision.length) {
    list = list.filter(c => c.transmission && filters.transmision.includes(c.transmission))
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(c =>
      (c.title || '').toLowerCase().includes(q) ||
      (c.fuelLabel || '').toLowerCase().includes(q) ||
      String(c.year).includes(q)
    )
  }

  if (sortBy.value === 'precio-asc') list.sort((a, b) => a.reservePrice - b.reservePrice)
  else if (sortBy.value === 'precio-desc') list.sort((a, b) => b.reservePrice - a.reservePrice)
  else if (sortBy.value === 'anio-desc') list.sort((a, b) => (b.year || 0) - (a.year || 0))
  else if (sortBy.value === 'anio-asc') list.sort((a, b) => (a.year || 0) - (b.year || 0))

  return list
})

const activeFiltersCount = computed(() => {
  return filters.tipoAuto.length + filters.marca.length + filters.modelo.length +
    filters.anio.length + filters.combustible.length + filters.traccion.length + filters.transmision.length
})

async function fetchCars() {
  loading.value = true
  try {
    const list = await $fetch(`${API_BASE}/autos?estado=en_remate`)
    const mapped = (Array.isArray(list) ? list : []).map(mapAutoToCard)
    allCars.value = mapped
  } catch (e) {
    console.warn('[remates] Error cargando autos:', e)
    allCars.value = []
  } finally {
    loading.value = false
  }
}

function clearFilters() {
  filters.tipoAuto = []
  filters.marca = []
  filters.modelo = []
  filters.anio = []
  filters.combustible = []
  filters.traccion = []
  filters.transmision = []
  searchQuery.value = ''
}

onMounted(() => fetchCars())

useSeoMeta({
  title: 'Remates Activos de Autos Chile | Subasta Online',
  description: 'Remates online de autos de particulares y empresas en Chile. Vehículos inspeccionados.',
  ogTitle: 'Remates Activos de Autos Chile | AutoRemates',
  ogDescription: 'Remates online de autos en Chile.',
  ogUrl: siteUrl + '/remates'
})

useHead({
  link: [{ rel: 'canonical', href: siteUrl + '/remates' }]
})
</script>
