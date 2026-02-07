<template>
  <section id="inicio" class="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-gray-900 text-white">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 z-0">
      <img 
        src="https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=2636&auto=format&fit=crop" 
        alt="Remate de autos usados en Chile - RematAuto" 
        class="w-full h-full object-cover opacity-40"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent"></div>
    </div>

    <div class="container mx-auto px-4 z-10 relative">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        
        <!-- Left Content -->
        <div class="space-y-8">
          <AnimatedSection>
            <div class="inline-flex items-center gap-2 bg-brand-orange/20 border border-brand-orange/30 text-brand-orange px-4 py-2 rounded-full backdrop-blur-sm mb-6">
              <span class="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
              <span class="text-sm font-semibold tracking-wide text-orange-200">PRÓXIMO REMATE: VIERNES 15:00 HRS</span>
            </div>
          </AnimatedSection>

          <AnimatedSection :delay="100">
            <h1 class="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Vende tu Auto Usado en <span class="text-brand-orange inline-block transform hover:scale-105 transition-transform duration-300">2 Horas</span>
            </h1>
            <p class="text-xl text-gray-300 mt-4 leading-relaxed max-w-xl">
              El primer remate online de autos en Chile con <strong class="text-white">inspección profesional incluida</strong>. Si el precio no te gusta no lo vendes. Tienes la palabra final.
            </p>
          </AnimatedSection>

          <AnimatedSection :delay="200">
            <div class="flex flex-col sm:flex-row gap-4 pt-4">
              <button class="group bg-brand-orange hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-orange-900/20 transition-all flex items-center justify-center gap-2">
                Rematar mi Auto Ahora
                <ArrowRight class="group-hover:translate-x-1 transition-transform" />
              </button>
              <button class="group bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2">
                <Play :size="20" class="fill-current" />
                Ver Cómo Funciona
              </button>
            </div>
            <p class="text-sm text-gray-400 mt-4 ml-2">
              Inscripción gratis
            </p>
          </AnimatedSection>
        </div>

        <!-- Right Content - Valuation Form -->
        <AnimatedSection :delay="400" class="hidden md:block">
          <div class="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01]">
            <!-- Form Header / Tabs -->
            <div class="flex bg-gray-50 border-b border-gray-100">
              <button 
                @click="activeTab = 'auto'"
                :class="[
                  'flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors',
                  activeTab === 'auto' ? 'bg-white text-brand-orange border-t-2 border-brand-orange' : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                <Car :size="16" /> Automóvil
              </button>
              <button 
                @click="activeTab = 'moto'"
                :class="[
                  'flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors',
                  activeTab === 'moto' ? 'bg-white text-brand-orange border-t-2 border-brand-orange' : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                <Bike :size="16" /> Moto
              </button>
              <button 
                @click="activeTab = 'comercial'"
                :class="[
                  'flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors',
                  activeTab === 'comercial' ? 'bg-white text-brand-orange border-t-2 border-brand-orange' : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                <Truck :size="16" /> Comercial
              </button>
            </div>

            <!-- Form Body -->
            <div class="p-6">
              <div class="mb-4">
                <h3 class="text-xl font-bold text-gray-900 mb-2">Pon tu auto bajo la lupa de los expertos</h3>
                <p class="text-gray-500 text-sm leading-relaxed">Solo necesitamos tu patente y correo para iniciar el proceso. Publicamos tu auto ante nuestra red de compradores verificados para que tú solo elijas la mejor oferta.</p>
              </div>

              <form class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Patente</label>
                  <div class="relative">
                    <input 
                      type="text" 
                      placeholder="AAAA-12 o BB-BB-10" 
                      class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-base font-mono font-bold text-gray-900 uppercase placeholder:text-gray-300 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all" 
                    />
                    <div class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-200 text-gray-500 text-xs font-bold px-2 py-0.5 rounded">
                      CL
                    </div>
                  </div>
                </div>
                
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Email</label>
                  <input 
                    type="email" 
                    placeholder="tucorreo@ejemplo.com" 
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-base text-gray-900 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all" 
                  />
                </div>

                <button class="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold text-base py-3 rounded-lg shadow-md shadow-orange-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2">
                  <Search :size="18" />
                  Inscribir mi auto 
                </button>

                <p class="text-xs text-center text-gray-400 leading-tight pt-1">
                  Al hacer clic en "Inscribir mi auto", aceptas nuestros <a href="#" class="underline hover:text-brand-orange">Términos y Condiciones</a> y <a href="#" class="underline hover:text-brand-orange">Política de Privacidad</a>.
                </p>
              </form>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowRight, Play, Car, Bike, Truck, Search } from 'lucide-vue-next'
import AnimatedSection from './AnimatedSection.vue'

const activeTab = ref('auto')
</script>