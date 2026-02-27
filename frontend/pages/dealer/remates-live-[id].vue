<template>
  <div
    :class="[
      'min-h-screen transition-colors duration-1000',
      urgency === UrgencyLevel.FINAL_CALL ? 'bg-red-50/50' : 'bg-slate-50'
    ]"
  >
    <Header />
    <div class="max-w-7xl mx-auto px-4 pt-24 pb-6">
      <!-- Notificación flotante -->
      <Transition name="bounce">
        <div
          v-if="notification"
          class="fixed top-24 right-6 z-[100] animate-bounce"
        >
          <div class="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <span class="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
            <span class="text-sm font-bold">{{ notification }}</span>
          </div>
        </div>
      </Transition>

      <NuxtLink
        :to="user ? '/dealer/remates-live' : '/remates'"
        class="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 group font-bold"
      >
        <svg
          class="w-5 h-5 group-hover:-translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {{ user ? 'VOLVER AL PANEL' : 'VOLVER A REMATES' }}
      </NuxtLink>

      <!-- Skeleton mientras carga la primera vez: misma estructura que el contenido, sin texto "Cargando..." -->
      <div v-if="loading && !auction" class="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
        <div class="lg:col-span-8 space-y-8">
          <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-3">
            <div class="aspect-video rounded-[2rem] bg-slate-200" />
            <div class="flex gap-3 mt-4 p-2">
              <div v-for="i in 5" :key="i" class="flex-shrink-0 w-32 h-20 rounded-2xl bg-slate-200" />
            </div>
          </div>
          <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-10">
            <div class="h-8 w-48 bg-slate-200 rounded-lg mb-4" />
            <div class="h-12 w-3/4 bg-slate-200 rounded-xl mb-10" />
            <div class="grid grid-cols-4 gap-8 p-8 bg-slate-50 rounded-3xl">
              <div v-for="i in 4" :key="i" class="h-16 bg-slate-200 rounded-lg" />
            </div>
          </div>
        </div>
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8">
            <div class="h-10 bg-slate-200 rounded-lg mb-4" />
            <div class="h-24 bg-slate-200 rounded-2xl mb-6" />
            <div class="h-12 bg-slate-200 rounded-xl" />
          </div>
        </div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
        {{ error }}
      </div>

      <div v-else-if="auction" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Columna Izquierda: Galería e Info -->
        <div class="lg:col-span-8 space-y-8">
          <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-3 relative">
            <div class="aspect-video rounded-[2rem] overflow-hidden relative bg-slate-100 group">
              <img
                :src="getImageUrl(allImages[activeImage])"
                alt="Car"
                class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div class="absolute top-6 left-6 flex flex-col gap-3">
                <AuctionTimer
                  :end-time="new Date(auction.fechaFinRemate)"
                  @urgency-change="setUrgency"
                />
              </div>
            </div>
            <div class="flex gap-3 mt-4 p-2 overflow-x-auto no-scrollbar">
              <button
                v-for="(img, idx) in allImages.slice(0, 10)"
                :key="idx"
                @click="activeImage = idx"
                :class="[
                  'flex-shrink-0 w-32 h-20 rounded-2xl overflow-hidden border-4 transition-all',
                  activeImage === idx
                    ? 'border-blue-600 scale-105 shadow-lg'
                    : 'border-transparent opacity-60 hover:opacity-100'
                ]"
              >
                <img :src="getImageUrl(img)" class="w-full h-full object-cover" alt="thumbnail" />
              </button>
            </div>
          </div>

          <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-10">
            <div class="mb-10">
              <div class="flex items-center gap-3 mb-2">
                <span class="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-black uppercase">
                  LOTE #{{ String(auction.id).padStart(4, '0') }}
                </span>
                <span class="text-slate-400 font-bold text-xs uppercase tracking-widest">SUBASTA ACTIVA</span>
              </div>
              <h1 class="text-4xl font-black text-slate-900 tracking-tighter">
                {{ auction.marca }} {{ auction.modelo }}
                <span class="text-blue-600">{{ auction.anio }}</span>
              </h1>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 p-8 bg-slate-50 rounded-3xl">
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span class="text-[10px] font-black uppercase tracking-widest">Kilometraje</span>
                </div>
                <p class="text-lg font-black text-slate-700">{{ formatNumber(auction.kilometraje) }} km</p>
              </div>
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span class="text-[10px] font-black uppercase tracking-widest">Motorización</span>
                </div>
                <p class="text-lg font-black text-slate-700">{{ getEngineSummary() }}</p>
              </div>
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span class="text-[10px] font-black uppercase tracking-widest">Transmisión</span>
                </div>
                <p class="text-lg font-black text-slate-700">{{ getTransmissionInfo() }}</p>
              </div>
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.628.288a2 2 0 01-1.117.21 2 2 0 01-1.183-.55l-1.293-1.293a2 2 0 00-2.828 0 2 2 0 000 2.828l1.293 1.293a2 2 0 001.83.518l.628-.288a6 6 0 013.86-.517l2.387.477a2 2 0 011.022.547l2.387 2.387a2 2 0 102.828-2.828l-2.387-2.387z"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span class="text-[10px] font-black uppercase tracking-widest">Combustible</span>
                </div>
                <p class="text-lg font-black text-slate-700">{{ getFuelInfo() }}</p>
              </div>
            </div>

            <!-- Peritaje: datos técnicos -->
            <div v-if="auction.peritaje" class="space-y-6">
              <!-- Diagrama de Carrocería con Números -->
              <div v-if="auction.peritaje.carroceriaImagenNumeros && auction.peritaje.carroceriaImagenNumeros.length > 0" class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-6">
                <h3 class="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Diagrama de Carrocería
                </h3>
                <div class="relative bg-slate-100 rounded-2xl p-4 border-2 border-slate-200">
                  <div class="relative mx-auto">
                    <img
                      src="/carroceria_peritaje.png"
                      alt="Diagrama de Carrocería"
                      class="max-w-full h-auto rounded-lg shadow-lg"
                    />
                    <!-- Números superpuestos -->
                    <div
                      v-for="(num, index) in auction.peritaje.carroceriaImagenNumeros"
                      :key="index"
                      :style="{
                        position: 'absolute',
                        left: `${num.x}%`,
                        top: `${num.y}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10
                      }"
                    >
                      <div
                        :style="{
                          backgroundColor: getEstadoColorForRemate(num.numero),
                          color: 'white',
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                          border: '3px solid white'
                        }"
                      >
                        {{ num.numero }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Leyenda de Estados -->
                <div class="mt-4 p-4 bg-slate-50 rounded-xl">
                  <h4 class="text-sm font-bold text-slate-700 mb-2">Leyenda de Estados</h4>
                  <div class="grid grid-cols-3 gap-2">
                    <div
                      v-for="(estado, index) in estadosCarroceria"
                      :key="index"
                      class="flex items-center gap-2 text-xs"
                    >
                      <div
                        class="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs"
                        :style="{ backgroundColor: estado.color }"
                      >
                        {{ index + 1 }}
                      </div>
                      <span class="text-slate-600 font-medium">{{ estado.label }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Motorización: grid legible como en el peritaje -->
              <div v-if="motorEntries.length > 0" class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-6 mt-6">
                <h3 class="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  </svg>
                  Revisión de Motor
                </h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  <div
                    v-for="(item, idx) in motorEntries"
                    :key="idx"
                    class="p-3 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">{{ item.label }}</p>
                    <p
                      :class="[
                        'text-sm font-bold',
                        item.badge === 'alert' ? 'text-red-600' : item.badge === 'warn' ? 'text-amber-600' : 'text-slate-700'
                      ]"
                    >
                      {{ item.value }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Datos técnicos del peritaje (todos los campos excepto datos personales) -->
              <div v-if="peritajeTechnicalSections.length > 0" class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-6 mt-6">
                <h3 class="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Datos técnicos del peritaje
                </h3>
                <div class="space-y-6">
                  <div
                    v-for="(section, sIdx) in peritajeTechnicalSections"
                    :key="sIdx"
                    class="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                  >
                    <h4 class="text-sm font-black text-slate-600 uppercase tracking-wide mb-3">{{ section.title }}</h4>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      <div
                        v-for="(item, idx) in section.items"
                        :key="idx"
                        class="p-3 rounded-xl border border-slate-200 bg-slate-50"
                      >
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">{{ item.label }}</p>
                        <p class="text-sm font-bold text-slate-700">{{ item.value }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Pujas y Martillo -->
        <div class="lg:col-span-4">
          <div class="sticky top-28 space-y-6">
            <div
              :class="[
                'bg-white rounded-[2.5rem] shadow-2xl border-4 p-8 transition-all duration-500',
                urgency === UrgencyLevel.FINAL_CALL ? 'border-red-500 animate-pulse' : 'border-slate-100'
              ]"
            >
              <div class="relative text-center mb-8">
                <!-- Martillo Animado -->
                <div
                  :class="[
                    'absolute -top-12 -right-4 text-4xl transition-all duration-300 transform',
                    hammerActive ? 'rotate-[45deg] scale-125' : 'rotate-[-20deg] opacity-20'
                  ]"
                >
                  🔨
                </div>

                <span class="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em]">OFERTA MÁXIMA ACTUAL</span>
                <div
                  :class="[
                    'text-5xl font-black mt-2 tracking-tighter transition-all duration-300',
                    hammerActive ? 'scale-110 text-blue-600' : 'text-slate-900'
                  ]"
                >
                  ${{ formatPrice(currentPrice) }}
                </div>
                <div class="flex items-center justify-center gap-2 mt-2">
                  <span class="text-xs font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full uppercase">
                    Pujas: {{ bids.length }}
                  </span>
                </div>
              </div>

              <div v-if="user" class="space-y-3 mb-6">
                <div class="grid grid-cols-2 gap-3">
                  <button
                    @click="handleUserBid(50000)"
                    :disabled="isPlacingBid || isFinished"
                    class="bg-slate-50 border-2 border-slate-100 py-4 rounded-2xl font-black text-slate-700 hover:border-blue-600 hover:text-blue-600 transition-all active:scale-90 disabled:opacity-50"
                  >
                    +$50.000
                  </button>
                  <button
                    @click="handleUserBid(100000)"
                    :disabled="isPlacingBid || isFinished"
                    class="bg-slate-50 border-2 border-slate-100 py-4 rounded-2xl font-black text-slate-700 hover:border-blue-600 hover:text-blue-600 transition-all active:scale-90 disabled:opacity-50"
                  >
                    +$100.000
                  </button>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="customBidAmount = Math.max(50000, customBidAmount - 50000)"
                    :disabled="isPlacingBid || isFinished || customBidAmount <= 50000"
                    class="w-12 h-12 rounded-xl border-2 border-slate-200 font-black text-slate-600 hover:bg-slate-100 disabled:opacity-50 flex items-center justify-center"
                  >
                    −
                  </button>
                  <button
                    @click="handleUserBid(customBidAmount)"
                    :disabled="isPlacingBid || isFinished"
                    :class="[
                      'flex-1 py-5 rounded-2xl font-black text-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50',
                      urgency === UrgencyLevel.FINAL_CALL
                        ? 'bg-red-600 text-white shadow-red-200'
                        : 'bg-blue-600 text-white shadow-blue-200'
                    ]"
                  >
                    PUJAR ${{ formatPrice(customBidAmount) }}
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    @click="customBidAmount = customBidAmount + 50000"
                    :disabled="isPlacingBid || isFinished"
                    class="w-12 h-12 rounded-xl border-2 border-slate-200 font-black text-slate-600 hover:bg-slate-100 disabled:opacity-50 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
              <div v-else class="mb-6 p-6 rounded-2xl bg-slate-50 border-2 border-slate-200 text-center">
                <p class="text-slate-700 font-bold mb-4">Inicia sesión para pujar en este remate</p>
                <div class="flex flex-col sm:flex-row gap-3 justify-center">
                  <NuxtLink to="/login" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                    Iniciar sesión
                  </NuxtLink>
                  <NuxtLink to="/registro" class="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-3 px-6 rounded-xl transition-colors">
                    Registrarme
                  </NuxtLink>
                </div>
              </div>

              <p v-if="user" class="text-[10px] text-center text-slate-400 font-bold uppercase leading-tight">
                ⚠️ Cada puja en el último minuto añade 10s extra de tiempo al reloj.
              </p>
            </div>

            <!-- Historial de Actividad -->
            <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
              <div class="bg-slate-50 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
                <h3 class="font-black text-slate-800 uppercase text-xs tracking-widest">Actividad en Vivo</h3>
                <div class="flex gap-1">
                  <div class="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></div>
                  <div class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                </div>
              </div>
              <div class="max-h-[400px] overflow-y-auto p-2 space-y-2">
                <div
                  v-for="(bid, i) in sortedBids"
                  :key="bid.id"
                  :class="[
                    'px-6 py-4 rounded-2xl flex justify-between items-center transition-all animate-slide-in',
                    i === 0 ? 'bg-blue-50 ring-2 ring-blue-100' : 'bg-white'
                  ]"
                >
                  <div class="flex items-center gap-3">
                    <div
                      :class="[
                        'w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black',
                        i === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                      ]"
                    >
                      {{ getInitials(bid.pujador?.nombre || 'Usuario') }}
                    </div>
                    <div>
                      <p class="text-sm font-black text-slate-800 leading-none mb-1">
                        {{ bid.pujador?.nombre || 'Usuario' }}
                        <span v-if="bid.pujadorId === user?.id" class="text-blue-600 text-xs ml-2">(Tú)</span>
                      </p>
                      <p class="text-[10px] text-slate-400 font-bold">
                        {{ formatTimeOnly(bid.fechaPuja) }}
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p :class="['text-sm font-black', i === 0 ? 'text-blue-600' : 'text-slate-900']">
                      ${{ formatPrice(bid.monto) }}
                    </p>
                    <span v-if="i === 0" class="text-[8px] font-black text-blue-400 uppercase tracking-tighter">
                      Oferta Líder
                    </span>
                  </div>
                </div>
                <div v-if="bids.length === 0" class="text-center py-8 text-slate-400 text-sm">
                  Aún no hay pujas. ¡Sé el primero!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, navigateTo } from 'nuxt/app'
import AuctionTimer from '~/components/AuctionTimer.vue'
import { UrgencyLevel } from '~/utils/auctionConstants'
import { useAuth } from '~/composables/useAuth'
import { useImageUrl } from '~/composables/useImageUrl'

// Página pública: cualquiera puede ver el remate en vivo; para pujar hace falta estar logueado (dealer)
definePageMeta({
  layout: false, // Página pública: usamos Header público en lugar del layout dashboard
  auth: false
})

const route = useRoute()
const { getAuthHeaders, user, checkAuth } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const auction = ref(null)
const bids = ref([])
const activeImage = ref(0)
const urgency = ref(UrgencyLevel.STABLE)
const hammerActive = ref(false)
const notification = ref(null)
const loading = ref(false)
const error = ref(null)
const isPlacingBid = ref(false)
const customBidAmount = ref(100000)
const viewersCount = ref(0)
let updateInterval = null
let hammerTimeout = null
let viewerPollInterval = null
let viewerHeartbeatInterval = null

// Obtener el ID del parámetro de ruta (ahora desde route.params.id)
const autoId = computed(() => {
  const id = route.params.id
  console.log('[remates-live-[id]] Auto ID obtenido del route.params:', id)
  console.log('[remates-live-[id]] Route completo:', route)
  return id
})

const currentPrice = computed(() => {
  if (bids.value.length > 0) {
    const highestBid = bids.value.reduce((max, b) => parseFloat(b.monto) > parseFloat(max.monto) ? b : max, bids.value[0])
    return parseFloat(highestBid.monto)
  }
  return parseFloat(auction.value?.precioActual || auction.value?.precioBase || 0)
})

// Combinar todas las imágenes del auto y del peritaje
const allImages = computed(() => {
  const images = []
  
  // Agregar imágenes del auto
  if (auction.value?.imagenes && Array.isArray(auction.value.imagenes)) {
    images.push(...auction.value.imagenes)
  }
  
  // Agregar imágenes del peritaje (todas las secciones)
  if (auction.value?.peritaje?.imagenesPorSeccion) {
    const peritajeImagenes = auction.value.peritaje.imagenesPorSeccion
    Object.keys(peritajeImagenes).forEach(seccion => {
      if (Array.isArray(peritajeImagenes[seccion])) {
        images.push(...peritajeImagenes[seccion])
      }
    })
  }
  
  // Agregar imágenes generales del peritaje
  if (auction.value?.peritaje?.imagenes && Array.isArray(auction.value.peritaje.imagenes)) {
    images.push(...auction.value.peritaje.imagenes)
  }
  
  return images.filter(img => img && img.trim() !== '')
})

// Asegurar que activeImage esté dentro del rango válido
watch(allImages, (newImages) => {
  if (newImages.length > 0 && activeImage.value >= newImages.length) {
    activeImage.value = 0
  }
}, { immediate: true })

const sortedBids = computed(() => {
  return [...bids.value].sort((a, b) => {
    const montoDiff = parseFloat(b.monto) - parseFloat(a.monto)
    if (montoDiff !== 0) return montoDiff
    return new Date(b.fechaPuja) - new Date(a.fechaPuja)
  })
})

const isFinished = computed(() => {
  if (!auction.value) return false
  // Si el estado es 'vendido', definitivamente terminó
  if (auction.value.estado === 'vendido') return true
  // Si el estado no es 'en_remate', terminó
  if (auction.value.estado !== 'en_remate') return true
  // Si hay fechaFinRemate y ya pasó, terminó
  if (auction.value.fechaFinRemate) {
    const ahora = new Date()
    const fin = new Date(auction.value.fechaFinRemate)
    return fin <= ahora
  }
  return false
})

const setUrgency = (level) => {
  urgency.value = level
}

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('es-CL').format(price)
}

const formatNumber = (num) => {
  if (!num) return '0'
  return new Intl.NumberFormat('es-CL').format(num)
}

const formatStatus = (estado) => {
  const status = {
    en_remate: 'En Remate',
    vendido: 'Vendido',
    aprobado: 'Aprobado'
  }
  return status[estado] || estado
}

const formatDateTime = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const formatTimeOnly = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const getInitials = (name) => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const { getImageUrl: getImageUrlHelper } = useImageUrl()

const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/800x600?text=Sin+Imagen'
  return getImageUrlHelper(imagePath)
}

const motorLabel = (key) => {
  const labels = {
    bloque_motor: 'Bloque motor',
    culata: 'Culata',
    valvulas: 'Válvulas',
    pistones: 'Pistones',
    bielas: 'Bielas',
    cigueñal: 'Cigüeñal',
    sistema_refrigeracion: 'Sist. refrigeración',
    sistema_lubricacion: 'Sist. lubricación',
    filtro_aceite: 'Filtro aceite',
    filtro_aire: 'Filtro aire',
    correa_distribucion: 'Correa distribución',
    cadena_distribucion: 'Cadena distribución',
    bujias: 'Bujías',
    bobinas_encendido: 'Bobinas encendido',
    inyectores: 'Inyectores',
    bomba_combustible: 'Bomba combustible',
    alternador: 'Alternador',
    motor_arranque: 'Motor arranque',
    sensor_oxigeno: 'Sensor oxígeno',
    catalizador: 'Catalizador',
    sistema_escape: 'Sistema escape'
  }
  return labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const motorEntries = computed(() => {
  let motor = auction.value?.peritaje?.motor
  if (!motor) return []
  if (typeof motor === 'string') {
    try {
      motor = JSON.parse(motor)
    } catch {
      return []
    }
  }
  if (typeof motor !== 'object') return []
  const alertValues = ['REQUIERE_REPARACION', 'MALO', 'REPARAR']
  const warnValues = ['REGULAR']
  return Object.entries(motor)
    .filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== '')
    .map(([key, value]) => {
      const v = String(value).trim()
      let badge = null
      if (alertValues.some(x => v.toUpperCase().includes(x))) badge = 'alert'
      else if (warnValues.some(x => v.toUpperCase().includes(x))) badge = 'warn'
      return { label: motorLabel(key), value: v, badge }
    })
})

const getEngineSummary = () => {
  let motor = auction.value?.peritaje?.motor
  if (!motor) return 'N/A'
  if (typeof motor === 'string') {
    try {
      motor = JSON.parse(motor)
    } catch {
      return motor
    }
  }
  if (typeof motor === 'object') {
    const n = Object.values(motor).filter(v => v !== null && v !== undefined && String(v).trim() !== '').length
    return n ? `Revisión técnica (${n} ítems)` : 'Sin detalle'
  }
  return 'N/A'
}

const getTransmissionInfo = () => {
  if (auction.value?.peritaje?.transmision) {
    return auction.value.peritaje.transmision
  }
  return 'Automática' // Valor por defecto
}

const getFuelInfo = () => {
  if (auction.value?.peritaje?.combustible) {
    return auction.value.peritaje.combustible
  }
  return 'Gasolina' // Valor por defecto
}

// Campos técnicos del peritaje a mostrar (excluye patente, propietario, RUT, cliente, teléfono, email, dirección)
const PERITAJE_FIELD_LABELS = {
  numeroMotor: 'Nº Motor',
  numeroChasis: 'Nº Chasis',
  numeroSerial: 'Nº Serial',
  tipoTransporte: 'Tipo transporte',
  anio: 'Año',
  color: 'Color',
  procedencia: 'Procedencia',
  fabricante: 'Fabricante',
  tipoSello: 'Tipo sello',
  combustible: 'Combustible',
  kilometraje: 'Kilometraje',
  revisionTecnica_comuna: 'Rev. técnica comuna',
  revisionTecnica_mes: 'Rev. técnica mes',
  revisionTecnica_estado: 'Rev. técnica estado',
  revisionTecnica_ultimoControl: 'Rev. técnica último control',
  revisionTecnica_fechaVencimiento: 'Rev. técnica vencimiento',
  gases_comuna: 'Gases comuna',
  gases_mes: 'Gases mes',
  gases_estado: 'Gases estado',
  gases_ultimoControl: 'Gases último control',
  gases_fechaVencimiento: 'Gases vencimiento',
  permisoCirculacion_info: 'Permiso circulación',
  permisoCirculacion_fechaVencimiento: 'Permiso vencimiento',
  soap_estado: 'SOAP estado',
  soap_compania: 'SOAP compañía',
  soap_fechaInicio: 'SOAP inicio',
  soap_fechaVencimiento: 'SOAP vencimiento',
  transportePublico: 'Transporte público',
  tipoTransportePublico: 'Tipo transp. público',
  restriccionVehicular_condicion: 'Restricción vehicular',
  restriccionVehicular_comunasPuenteAltoSanBernardo: 'Restricción PA-SB',
  restriccionVehicular_provinciaSantiago: 'Restricción Stgo',
  reporte_robo: 'Reporte robo',
  reporte_remate: 'Reporte remate',
  multas: 'Multas',
  valorAvaluo: 'Valor avalúo',
  precio: 'Precio sugerido',
  frenos_eficacia_delantera: 'Frenos eff. del.',
  frenos_eficacia_trasera: 'Frenos eff. tras.',
  frenos_diferencia_fuerza_delantera: 'Frenos diff. del.',
  frenos_diferencia_fuerza_trasera: 'Frenos diff. tras.',
  frenos_esfuerzo: 'Frenos esfuerzo',
  frenos_peso: 'Frenos peso',
  frenos_total: 'Frenos total',
  frenos_estado_general: 'Frenos estado',
  suspension_delantera_izquierda: 'Susp. del. izq.',
  suspension_delantera_derecha: 'Susp. del. der.',
  suspension_trasera_izquierda: 'Susp. tras. izq.',
  suspension_trasera_derecha: 'Susp. tras. der.',
  suspension_diferencia_delantera: 'Susp. diff. del.',
  suspension_diferencia_trasera: 'Susp. diff. tras.',
  suspension_estado_general: 'Suspensión estado',
  escanerMotor: 'Escáner OBD-II',
  observaciones_generales: 'Observaciones'
}

const toLabel = (key) => PERITAJE_FIELD_LABELS[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
const excludeKeys = new Set(['patente', 'propietario', 'propietarioRut', 'cliente', 'telefono', 'email', 'direccion', 'fecha', 'creadoPor', 'peritoId', 'estado', 'imagenes', 'imagenesPorSeccion', 'carroceriaImagenNumeros', 'carroceria', 'chasis', 'llantas', 'motor'])

const peritajeTechnicalSections = computed(() => {
  const p = auction.value?.peritaje
  if (!p) return []
  const sections = []
  const toItem = (key, value) => {
    if (value === null || value === undefined || value === '') return null
    if (key === 'valorAvaluo' || key === 'precio') {
      const n = Number(value)
      if (!n || isNaN(n)) return null
    }
    let display = value
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) return null
    if (key === 'valorAvaluo' || key === 'precio') display = formatPrice(Number(value))
    if (key === 'kilometraje') display = formatNumber(Number(value)) + ' km'
    if (value instanceof Date || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value))) {
      try { display = new Date(value).toLocaleDateString('es-CL') } catch {}
    }
    return { label: toLabel(key), value: String(display) }
  }
  const groups = {
    'Vehículo': ['numeroMotor', 'numeroChasis', 'numeroSerial', 'tipoTransporte', 'anio', 'color', 'procedencia', 'fabricante', 'tipoSello', 'combustible', 'kilometraje'],
    'Revisión técnica': ['revisionTecnica_comuna', 'revisionTecnica_mes', 'revisionTecnica_estado', 'revisionTecnica_ultimoControl', 'revisionTecnica_fechaVencimiento'],
    'Gases': ['gases_comuna', 'gases_mes', 'gases_estado', 'gases_ultimoControl', 'gases_fechaVencimiento'],
    'Permiso circulación': ['permisoCirculacion_info', 'permisoCirculacion_fechaVencimiento'],
    'SOAP': ['soap_estado', 'soap_compania', 'soap_fechaInicio', 'soap_fechaVencimiento'],
    'Restricción vehicular': ['restriccionVehicular_condicion', 'restriccionVehicular_comunasPuenteAltoSanBernardo', 'restriccionVehicular_provinciaSantiago'],
    'Reportes y deudas': ['reporte_robo', 'reporte_remate', 'multas'],
    'Valoración': ['valorAvaluo', 'precio'],
    'Frenos': ['frenos_eficacia_delantera', 'frenos_eficacia_trasera', 'frenos_diferencia_fuerza_delantera', 'frenos_diferencia_fuerza_trasera', 'frenos_esfuerzo', 'frenos_peso', 'frenos_total', 'frenos_estado_general'],
    'Suspensión': ['suspension_delantera_izquierda', 'suspension_delantera_derecha', 'suspension_trasera_izquierda', 'suspension_trasera_derecha', 'suspension_diferencia_delantera', 'suspension_diferencia_trasera', 'suspension_estado_general'],
    'Otros': ['escanerMotor', 'observaciones_generales']
  }
  for (const [title, keys] of Object.entries(groups)) {
    const items = keys
      .filter(k => !excludeKeys.has(k) && p[k] !== undefined)
      .map(k => toItem(k, p[k]))
      .filter(Boolean)
    if (items.length) sections.push({ title, items })
  }
  // Carrocería, chasis, llantas (objetos key-value)
  const formatObjValue = (v) => {
    if (v === null || v === undefined) return ''
    if (typeof v !== 'object') return String(v).trim()
    const parts = Object.entries(v).filter(([, x]) => x != null && x !== '').map(([key, x]) => `${key}: ${x}`)
    return parts.length ? parts.join(' · ') : ''
  }
  const objToItems = (obj, labelFn) => {
    if (!obj || typeof obj !== 'object') return []
    const parsed = typeof obj === 'string' ? (() => { try { return JSON.parse(obj) } catch { return {} } })() : obj
    return Object.entries(parsed)
      .map(([k, v]) => ({ label: labelFn(k), value: formatObjValue(v) }))
      .filter(item => item.value)
  }
  const toLabelKey = (k) => k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  if (p.carroceria && Object.keys(typeof p.carroceria === 'string' ? (() => { try { return JSON.parse(p.carroceria) } catch { return {} } })() : p.carroceria).length) {
    const items = objToItems(p.carroceria, toLabelKey)
    if (items.length) sections.push({ title: 'Carrocería (detalle)', items })
  }
  if (p.chasis && Object.keys(typeof p.chasis === 'string' ? (() => { try { return JSON.parse(p.chasis) } catch { return {} } })() : p.chasis).length) {
    const items = objToItems(p.chasis, toLabelKey)
    if (items.length) sections.push({ title: 'Chasis (detalle)', items })
  }
  if (p.llantas && Object.keys(typeof p.llantas === 'string' ? (() => { try { return JSON.parse(p.llantas) } catch { return {} } })() : p.llantas).length) {
    const items = objToItems(p.llantas, toLabelKey)
    if (items.length) sections.push({ title: 'Llantas (detalle)', items })
  }
  return sections
})

// Estados de carrocería (24 estados) - mismo orden que en autos-peritaje.vue
const estadosCarroceria = [
  { value: 'BIEN', label: 'BIEN', color: '#10b981' },
  { value: 'BIEN REPA', label: 'BIEN REPA', color: '#3b82f6' },
  { value: 'BIEN REPAR POR REMOC', label: 'BIEN REPAR POR REMOC', color: '#6366f1' },
  { value: 'BUENO', label: 'BUENO', color: '#22c55e' },
  { value: 'CORROIDO', label: 'CORROIDO', color: '#f59e0b' },
  { value: 'CUARTEADO', label: 'CUARTEADO', color: '#ef4444' },
  { value: 'DESCUADRE', label: 'DESCUADRE', color: '#f97316' },
  { value: 'DESENGRAFE', label: 'DESENGRAFE', color: '#84cc16' },
  { value: 'FISURADO', label: 'FISURADO', color: '#eab308' },
  { value: 'GOLEVE', label: 'GOLEVE', color: '#14b8a6' },
  { value: 'GOLPEADO', label: 'GOLPEADO', color: '#f43f5e' },
  { value: 'MAL REPAR', label: 'MAL REPAR', color: '#dc2626' },
  { value: 'MAL REPINT', label: 'MAL REPINT', color: '#b91c1c' },
  { value: 'MALO', label: 'MALO', color: '#991b1b' },
  { value: 'NO REALIZADA', label: 'NO REALIZADA', color: '#6b7280' },
  { value: 'NO TIENE', label: 'NO TIENE', color: '#9ca3af' },
  { value: 'PINTURA MANC', label: 'PINTURA MANC', color: '#a855f7' },
  { value: 'RAYADO', label: 'RAYADO', color: '#ec4899' },
  { value: 'REGUL', label: 'REGUL', color: '#8b5cf6' },
  { value: 'REMOV', label: 'REMOV', color: '#64748b' },
  { value: 'REPINT', label: 'REPINT', color: '#06b6d4' },
  { value: 'REPINTADO PARCIAL', label: 'REPINTADO PARCIAL', color: '#0ea5e9' },
  { value: 'ROTO', label: 'ROTO', color: '#dc2626' },
  { value: 'SUMIDO', label: 'SUMIDO', color: '#f97316' }
]

const getEstadoColorForRemate = (numero) => {
  // Obtener el color del estado correspondiente al número
  if (numero >= 1 && numero <= estadosCarroceria.length) {
    return estadosCarroceria[numero - 1].color
  }
  return '#6b7280' // Color por defecto
}

const showNotification = (msg) => {
  notification.value = msg
  setTimeout(() => {
    notification.value = null
  }, 3000)
}

const activateHammer = () => {
  hammerActive.value = true
  if (hammerTimeout) clearTimeout(hammerTimeout)
  hammerTimeout = setTimeout(() => {
    hammerActive.value = false
  }, 600)
}

const loadAuction = async () => {
  if (!autoId.value) {
    console.error('[remates-live-[id]] No hay autoId disponible')
    error.value = 'ID de remate no proporcionado'
    loading.value = false
    return
  }

  const isInitialLoad = !auction.value
  if (isInitialLoad) {
    loading.value = true
    error.value = null
  }

  let timeoutId
  if (isInitialLoad) {
    timeoutId = setTimeout(() => {
      if (loading.value && !auction.value) {
        loading.value = false
        error.value = 'Tiempo de espera agotado. Compruebe que el backend esté en marcha y la URL de la API sea correcta.'
      }
    }, 15000)
  }

  try {
    const response = await $fetch(`${API_BASE}/autos/${autoId.value}`, {
      headers: getAuthHeaders()
    })
    if (isInitialLoad && timeoutId) clearTimeout(timeoutId)
    if (isInitialLoad) {
      auction.value = response
      loading.value = false
    } else {
      Object.assign(auction.value, response)
    }
    await loadBids()
  } catch (err) {
    if (isInitialLoad && timeoutId) clearTimeout(timeoutId)
    console.error('[remates-live-[id]] Error cargando remate:', err)
    error.value = err.data?.message || err.message || 'Error al cargar el remate'
  } finally {
    loading.value = false
  }
}

const loadBids = async () => {
  if (!auction.value) {
    console.warn('[remates-live-[id]] No hay auction para cargar pujas')
    return
  }

  try {
    console.log('[remates-live-[id]] Cargando pujas para auto:', auction.value.id)
    const response = await $fetch(`${API_BASE}/remates?autoId=${auction.value.id}`, {
      headers: getAuthHeaders()
    })
    console.log('[remates-live-[id]] Pujas cargadas:', response)
    bids.value = response.sort((a, b) => {
      const montoDiff = parseFloat(b.monto) - parseFloat(a.monto)
      if (montoDiff !== 0) return montoDiff
      return new Date(b.fechaPuja) - new Date(a.fechaPuja)
    })
  } catch (err) {
    console.error('[remates-live-[id]] Error cargando pujas:', err)
  }
}

const handleUserBid = async (increase) => {
  console.log('[remates-live-[id]] handleUserBid llamado con increase:', increase)
  console.log('[remates-live-[id]] Estado actual - auction:', auction.value, 'isPlacingBid:', isPlacingBid.value, 'isFinished:', isFinished.value)
  
  if (!auction.value || isPlacingBid.value || isFinished.value) {
    console.warn('[remates-live-[id]] No se puede pujar - condiciones no cumplidas')
    return
  }

  const newAmount = currentPrice.value + increase
  console.log('[remates-live-[id]] Nueva puja calculada:', newAmount, 'Precio actual:', currentPrice.value)

  isPlacingBid.value = true
  try {
    console.log('[remates-live-[id]] Enviando puja al servidor...')
    await $fetch(`${API_BASE}/remates`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: {
        autoId: auction.value.id,
        monto: newAmount
      }
    })
    console.log('[remates-live-[id]] Puja enviada exitosamente')

    activateHammer()
    showNotification('¡Tu puja ha sido procesada!')
    await loadBids()
    await loadAuction()
  } catch (err) {
    console.error('[remates-live-[id]] Error realizando puja:', err)
    showNotification(err.data?.message || 'Error al realizar la puja')
  } finally {
    isPlacingBid.value = false
  }
}

// Viewers: dealers + admin viendo este remate (datos reales desde el backend)
const loadViewers = async () => {
  if (!auction.value?.id) return
  try {
    const res = await $fetch(`${API_BASE}/remates/autos/${auction.value.id}/viewers`, {
      headers: getAuthHeaders()
    })
    if (typeof res?.count === 'number') viewersCount.value = res.count
  } catch (_) {
    // No bloquear la UI si falla el conteo
  }
}

const sendViewHeartbeat = async () => {
  if (!auction.value?.id) return
  try {
    const res = await $fetch(`${API_BASE}/remates/autos/${auction.value.id}/view`, {
      method: 'POST',
      headers: getAuthHeaders()
    })
    if (typeof res?.count === 'number') viewersCount.value = res.count
  } catch (_) {}
}

function startViewerTracking() {
  if (!auction.value?.id) return
  loadViewers()
  sendViewHeartbeat()
  if (viewerPollInterval) clearInterval(viewerPollInterval)
  viewerPollInterval = setInterval(loadViewers, 10000)
  if (viewerHeartbeatInterval) clearInterval(viewerHeartbeatInterval)
  viewerHeartbeatInterval = setInterval(sendViewHeartbeat, 25000)
}

// Watcher para detener actualizaciones cuando el remate termine
watch([isFinished, () => auction.value?.estado], ([finished, estado]) => {
  if (finished || estado === 'vendido') {
    console.log('[remates-live-[id]] Remate finalizado, deteniendo actualizaciones')
    if (updateInterval) {
      clearInterval(updateInterval)
      updateInterval = null
    }
  }
}, { immediate: true })

onMounted(async () => {
  if (process.client) await checkAuth()
  loadAuction()

  // Actualizar pujas cada 2 segundos solo si el remate está activo y no ha terminado
  updateInterval = setInterval(() => {
    // Verificar si el remate terminó antes de actualizar
    if (!auction.value || isFinished.value || auction.value.estado !== 'en_remate') {
      console.log('[remates-live-[id]] Remate finalizado, deteniendo actualizaciones')
      if (updateInterval) {
        clearInterval(updateInterval)
        updateInterval = null
      }
      return
    }
    
    // Solo actualizar si el remate está activo
    loadBids()
    loadAuction()
  }, 2000)
})

// Iniciar conteo de viewers cuando el remate esté cargado (solo si hay usuario logueado)
watch([auction, user], ([a, u]) => {
  if (a?.id && u) startViewerTracking()
}, { immediate: true })

onUnmounted(() => {
  console.log('[remates-live-[id]] Componente desmontado')
  if (updateInterval) clearInterval(updateInterval)
  if (hammerTimeout) clearTimeout(hammerTimeout)
  if (viewerPollInterval) clearInterval(viewerPollInterval)
  if (viewerHeartbeatInterval) clearInterval(viewerHeartbeatInterval)
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>



