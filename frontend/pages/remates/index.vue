<template>
  <div class="font-sans text-slate-900 bg-slate-50 min-h-screen">
    <Header />
    <main class="pt-32 pb-16">
      <div class="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Remates Activos de Autos</h1>
          <p class="text-xl text-slate-600 mb-6">
            Remates online de autos de particulares y empresas en Chile. Vehículos inspeccionados, en buen estado.
          </p>

          <section class="mb-10">
            <h2 class="text-2xl font-bold text-slate-900 mb-3">Remates de autos online en Chile</h2>
            <p class="text-slate-600 leading-relaxed max-w-full">
              En esta página encuentras los <strong>remates activos de autos</strong> y las <strong>subastas de autos</strong> en curso. Todos los vehículos pasan por inspección profesional antes del remate. Puedes filtrar por marca, modelo, año y combustible. Cada remate tiene su propio plazo; inicia sesión como comprador para pujar en las <strong>subastas de autos online</strong>. Si buscas <strong>próximos remates de autos</strong> o <strong>remate de autos usados</strong> en Santiago, Concepción, Iquique o el resto de Chile, aquí verás las ofertas actuales.
            </p>
          </section>
        </div>

        <!-- Barra búsqueda + Ordenar -->
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
          <div class="flex-1 relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="¿Qué estás buscando?"
              class="w-full px-4 py-3 pl-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
            />
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-slate-600">Ordenar por</span>
            <select
              v-model="sortBy"
              class="px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white"
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
            <div class="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden sticky top-28 shadow-sm">
              <div class="p-4 border-b border-slate-100">
                <p class="text-lg font-bold text-blue-600">Filtros ({{ activeFiltersCount }})</p>
              </div>

              <div class="divide-y divide-gray-100">
                <FilterSection v-model:open="filterOpen.tipoAuto" title="Tipo auto">
                  <label
                    v-for="opt in filterOptions.tipoAuto"
                    :key="opt.value"
                    class="flex items-center gap-3 py-2 px-4 hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      v-model="filters.tipoAuto"
                      type="checkbox"
                      :value="opt.value"
                      class="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                    />
                    <span class="text-slate-700">{{ opt.label }}</span>
                    <span class="text-slate-400 text-sm ml-auto">({{ opt.count }})</span>
                  </label>
                </FilterSection>
                <FilterSection v-model:open="filterOpen.marca" title="Marca">
                  <div class="max-h-48 overflow-y-auto">
                    <label
                      v-for="opt in filterOptions.marca"
                      :key="opt.value"
                      class="flex items-center gap-3 py-2 px-4 hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        v-model="filters.marca"
                        type="checkbox"
                        :value="opt.value"
                        class="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                      />
                      <span class="text-slate-700">{{ opt.label }}</span>
                      <span class="text-slate-400 text-sm ml-auto">({{ opt.count }})</span>
                    </label>
                  </div>
                </FilterSection>
                <FilterSection v-model:open="filterOpen.modelo" title="Modelo">
                  <div class="max-h-48 overflow-y-auto">
                    <label
                      v-for="opt in filterOptions.modelo"
                      :key="opt.value"
                      class="flex items-center gap-3 py-2 px-4 hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        v-model="filters.modelo"
                        type="checkbox"
                        :value="opt.value"
                        class="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                      />
                      <span class="text-slate-700">{{ opt.label }}</span>
                      <span class="text-slate-400 text-sm ml-auto">({{ opt.count }})</span>
                    </label>
                  </div>
                </FilterSection>
                <FilterSection v-model:open="filterOpen.anio" title="Año">
                  <div class="max-h-48 overflow-y-auto">
                    <label
                      v-for="opt in filterOptions.anio"
                      :key="opt.value"
                      class="flex items-center gap-3 py-2 px-4 hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        v-model="filters.anio"
                        type="checkbox"
                        :value="opt.value"
                        class="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                      />
                      <span class="text-slate-700">{{ opt.label }}</span>
                      <span class="text-slate-400 text-sm ml-auto">({{ opt.count }})</span>
                    </label>
                  </div>
                </FilterSection>
                <FilterSection v-model:open="filterOpen.combustible" title="Combustible">
                  <label
                    v-for="opt in filterOptions.combustible"
                    :key="opt.value"
                    class="flex items-center gap-3 py-2 px-4 hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      v-model="filters.combustible"
                      type="checkbox"
                      :value="opt.value"
                      class="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                    />
                    <span class="text-slate-700">{{ opt.label }}</span>
                    <span class="text-slate-400 text-sm ml-auto">({{ opt.count }})</span>
                  </label>
                </FilterSection>
                <FilterSection v-model:open="filterOpen.traccion" title="Tracción">
                  <label
                    v-for="opt in filterOptions.traccion"
                    :key="opt.value"
                    class="flex items-center gap-3 py-2 px-4 hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      v-model="filters.traccion"
                      type="checkbox"
                      :value="opt.value"
                      class="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                    />
                    <span class="text-slate-700">{{ opt.label }}</span>
                    <span class="text-slate-400 text-sm ml-auto">({{ opt.count }})</span>
                  </label>
                  <p v-if="filterOptions.traccion.length === 0" class="px-4 py-2 text-slate-400 text-sm">Sin datos</p>
                </FilterSection>
                <FilterSection v-model:open="filterOpen.transmision" title="Transmisión">
                  <label
                    v-for="opt in filterOptions.transmision"
                    :key="opt.value"
                    class="flex items-center gap-3 py-2 px-4 hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      v-model="filters.transmision"
                      type="checkbox"
                      :value="opt.value"
                      class="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                    />
                    <span class="text-slate-700">{{ opt.label }}</span>
                    <span class="text-slate-400 text-sm ml-auto">({{ opt.count }})</span>
                  </label>
                </FilterSection>
              </div>
              <div class="p-4 border-t border-slate-100">
                <button
                  @click="clearFilters"
                  class="flex items-center gap-2 text-blue-600 font-semibold hover:underline text-sm"
                >
                  <Menu class="w-4 h-4" />
                  Menos filtros
                </button>
              </div>
            </div>
          </aside>

          <div class="flex-1 min-w-0">
            <p class="mb-4 text-slate-600 text-sm">Cada remate tiene su propio plazo. Inicia sesión como comprador para pujar.</p>
            <div v-if="loading" class="flex justify-center py-20">
              <div class="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
            <template v-else>
              <h2 class="text-xl font-bold text-slate-900 mb-4">Vehículos en remate</h2>
              <p class="text-slate-600 mb-6 font-semibold">{{ filteredCars.length }} Resultados</p>
              <div v-if="filteredCars.length === 0" class="text-center py-16 bg-slate-50 rounded-2xl">
                <p class="text-slate-600 text-lg">
                  {{ activeFiltersCount > 0 ? 'No hay autos disponibles con los filtros seleccionados.' : 'No hay remates activos en este momento.' }}
                </p>
                <p v-if="activeFiltersCount === 0" class="text-slate-500 text-sm mt-2">Los autos aparecerán aquí cuando un administrador los envíe a subasta desde el panel de admin.</p>
                <button
                  v-if="activeFiltersCount > 0"
                  @click="clearFilters"
                  class="mt-4 text-blue-600 font-semibold hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
              <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div
                  v-for="car in filteredCars"
                  :key="car.id"
                  class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-slate-200 flex flex-col group"
                >
                  <div class="relative h-48 overflow-hidden bg-slate-100">
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
                          :class="isFavorite(car.id) ? 'text-red-500 fill-red-500' : 'text-slate-600'"
                        />
                      </button>
                      <button
                        type="button"
                        @click.stop="shareCar(car)"
                        class="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center transition"
                        title="Compartir"
                      >
                        <Share2 :size="18" class="text-slate-600" />
                      </button>
                    </div>
                    <img
                      :src="car.imageUrl"
                      :alt="car.title"
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div class="p-4 flex-1 flex flex-col">
                    <h3 class="text-lg font-bold text-slate-900 mb-1">{{ car.title }}</h3>
                    <p class="text-slate-500 text-sm mb-3">
                      {{ car.year }} · {{ car.fuelLabel }}<template v-if="car.km != null && car.km > 0"> · {{ formatKilometrajeChile(car.km) }}</template>
                    </p>
                    <div class="flex flex-wrap gap-1.5 mb-3">
                      <span v-if="car.transmission && car.transmission !== '—'" class="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded uppercase">
                        {{ car.transmission }}
                      </span>
                    </div>
                    <div v-if="car.ultimaOferta != null" class="mb-3 p-2.5 bg-amber-50 rounded-lg flex items-center justify-between gap-2">
                      <span class="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                        <Wrench :size="14" />
                        Última oferta
                      </span>
                      <span class="text-base font-bold text-slate-900">${{ formatPriceChile(car.ultimaOferta) }}</span>
                    </div>
                    <div class="mt-auto pt-3 border-t border-slate-100 flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <span class="text-xs text-slate-500">Mín</span>
                        <p class="text-xl font-bold text-slate-900">
                          ${{ formatPriceChile(car.reservePrice) }}
                        </p>
                      </div>
                      <NuxtLink
                        :to="`/dealer/remates-live-${String(car.id)}`"
                        class="bg-slate-900 hover:bg-blue-600 text-white font-black py-3 px-5 rounded-xl text-center text-sm transition-colors shrink-0 inline-block w-full"
                      >
                        Ver detalles y pujar
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- Cómo participar -->
        <section class="mt-16 bg-white rounded-2xl border border-slate-200 p-8 md:p-10">
          <h2 class="text-2xl font-bold text-slate-900 mb-4">Cómo participar en una subasta de autos online</h2>
          <p class="text-slate-600 mb-4 leading-relaxed">
            Para pujar en nuestros <strong>remates de autos online</strong> debes registrarte como comprador (dealer). El proceso es gratuito. Una vez verificado, podrás ver todos los <strong>remates activos de autos</strong>, revisar el informe de inspección de cada vehículo y ofertar en vivo. En Chile, <strong>cómo funcionan los remates de autos</strong> en AutoRemates: cada auto tiene su propia fecha de cierre; cuando llega la hora, la mejor puja gana. Todos los autos están inspeccionados y en buen estado —nos especializamos en <strong>remate de autos de particulares y empresas</strong>, no en autos chocados ni de aseguradora.
          </p>
          <p class="text-slate-600 leading-relaxed">
            Si te preguntas <strong>dónde hay remates de autos en Chile</strong>, aquí puedes participar desde cualquier ciudad. Realizamos <strong>subastas de autos</strong> con entrega posible a todo el país. Revisa los vehículos en remate arriba y regístrate para comprar.
          </p>
        </section>

        <section class="mt-16 bg-slate-50 rounded-2xl p-8 text-center">
          <h2 class="text-2xl font-bold text-slate-900 mb-4">Participa en remates de autos online</h2>
          <p class="text-slate-600 mb-6 max-w-xl mx-auto">
            Regístrate como comprador (dealer) para participar en las subastas online. Es gratuito.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/registro" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors">
              Registrarme como comprador
            </NuxtLink>
            <NuxtLink to="/login" class="bg-white border-2 border-slate-300 hover:border-blue-600 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg transition-colors">
              Ya tengo cuenta
            </NuxtLink>
          </div>
        </section>

        <!-- Preguntas frecuentes remates -->
        <section id="faq-remates" class="mt-16 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div class="p-8 md:p-10 border-b border-slate-100 text-center">
            <h2 class="text-2xl font-bold text-slate-900 mb-2">Preguntas frecuentes sobre remates de autos</h2>
            <p class="text-slate-600 max-w-2xl mx-auto">Todo lo que necesitas saber para participar en remates y subastas de autos en Chile.</p>
          </div>
          <div class="divide-y divide-slate-100 max-w-3xl mx-auto">
            <div
              v-for="(faq, index) in faqsRemates"
              :key="index"
              class="border-slate-100"
            >
              <button
                type="button"
                @click="toggleFaqRemates(index)"
                class="w-full px-6 md:px-8 py-5 text-left flex items-center justify-between bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-inset"
              >
                <h3 class="text-lg font-bold text-slate-900 pr-8">{{ faq.question }}</h3>
                <svg
                  :class="['w-6 h-6 text-blue-600 transition-transform duration-300 flex-shrink-0', openFaqRemates[index] ? 'rotate-180' : '']"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-[500px]"
                leave-active-class="transition-all duration-300 ease-in"
                leave-from-class="opacity-100 max-h-[500px]"
                leave-to-class="opacity-0 max-h-0"
              >
                <div v-if="openFaqRemates[index]" class="overflow-hidden">
                  <div class="px-6 md:px-8 py-5 bg-slate-50 border-t border-slate-100 text-center md:text-left">
                    <p class="text-slate-700 leading-relaxed whitespace-pre-line max-w-2xl mx-auto">{{ faq.answer }}</p>
                  </div>
                </div>
              </Transition>
            </div>
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
import { formatPriceChile, formatKilometrajeChile } from '~/utils/format'

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
  const url = `${siteUrl}/dealer/remates-live-${car.id}`
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
  const traccion = []
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
  if (filters.tipoAuto.length) list = list.filter(c => filters.tipoAuto.includes(c.tipoLabel || TIPO_LABELS[c.tipoTransporte]))
  if (filters.marca.length) list = list.filter(c => c.marca && filters.marca.includes(c.marca))
  if (filters.modelo.length) list = list.filter(c => filters.modelo.includes(c.modelo || c.title))
  if (filters.anio.length) list = list.filter(c => filters.anio.includes(String(c.year)))
  if (filters.combustible.length) list = list.filter(c => filters.combustible.includes(c.fuelLabel))
  if (filters.traccion.length) list = list.filter(c => c.traccion && filters.traccion.includes(c.traccion))
  if (filters.transmision.length) list = list.filter(c => c.transmission && filters.transmision.includes(c.transmission))
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

const faqsRemates = [
  {
    question: '¿Cómo participar en una subasta de autos online?',
    answer: 'Debes registrarte como comprador (dealer) en AutoRemates. Una vez verificado, podrás ver los autos en remate, revisar las inspecciones y pujar en las subastas en vivo. Cada remate tiene su propio plazo. El registro es gratuito.'
  },
  {
    question: '¿Cómo funcionan los remates de autos?',
    answer: 'Los remates de autos son subastas donde los compradores pujan por vehículos. En AutoRemates: el vendedor inscribe su auto, realizamos inspección técnica de 60 puntos, el auto se subasta online con compradores verificados y se acepta la mejor oferta con pago inmediato.'
  },
  {
    question: '¿Dónde hay remates de autos en Chile?',
    answer: 'En AutoRemates realizamos remates online, por lo que puedes participar desde cualquier parte de Chile. Tenemos centros de inspección y los vehículos en remate pueden entregarse en distintas ciudades. Revisa los remates activos en esta página.'
  },
  {
    question: '¿Los autos en remate están inspeccionados?',
    answer: 'Sí. Todos los autos que aparecen en remates activos pasan por una inspección profesional de 60 puntos antes de subastarse. Puedes revisar el informe técnico de cada vehículo antes de pujar.'
  },
  {
    question: '¿Cuándo son los próximos remates de autos?',
    answer: 'Cada auto tiene su propia fecha de cierre de remate. En la ficha de cada vehículo verás la cuenta regresiva. Los remates en vivo se realizan según el calendario publicado; regístrate como comprador para recibir información y pujar.'
  }
]

const openFaqRemates = ref({})

function toggleFaqRemates(index) {
  openFaqRemates.value[index] = !openFaqRemates.value[index]
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
  link: [{ rel: 'canonical', href: siteUrl + '/remates' }],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqsRemates.map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer }
        }))
      })
    }
  ]
})
</script>
