<template>
  <div>
    <!-- Dual CTA Section -->
    <section id="vende" class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-8">
          
          <!-- Vendedores -->
          <AnimatedSection class="relative rounded-3xl overflow-hidden shadow-2xl group">
            <div class="absolute inset-0 bg-gray-900/90 z-10 transition-colors group-hover:bg-gray-900/80"></div>
            <img src="https://images.unsplash.com/photo-1560250056-07ba64664864?auto=format&fit=crop&q=80" alt="Vender" class="absolute inset-0 w-full h-full object-cover" />
            <div class="relative z-20 p-10 h-full flex flex-col items-start text-white">
              <span class="bg-brand-orange text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">Para Vendedores</span>
              <h3 class="text-3xl font-bold mb-4">¿Quieres Vender tu Auto?</h3>
              <ul class="space-y-3 mb-8 flex-1">
                <li v-for="(item, i) in sellerFeatures" :key="i" class="flex items-center gap-2">
                  <div class="bg-green-500 rounded-full p-1">
                    <Check :size="12" :stroke-width="4" />
                  </div>
                  <span class="font-medium text-gray-200">{{ item }}</span>
                </li>
              </ul>
              <button class="w-full sm:w-auto bg-white text-gray-900 hover:bg-brand-orange hover:text-white px-8 py-3 rounded-xl font-bold transition-all">
                Inscribir mi Auto →
              </button>
            </div>
          </AnimatedSection>

          <!-- Compradores -->
          <AnimatedSection :delay="200" class="relative rounded-3xl overflow-hidden shadow-2xl group">
            <div class="absolute inset-0 bg-brand-blue/90 z-10 transition-colors group-hover:bg-brand-blue/80"></div>
            <img src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&q=80" alt="Comprar" class="absolute inset-0 w-full h-full object-cover" />
            <div class="relative z-20 p-10 h-full flex flex-col items-start text-white">
              <span class="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">Para Compradores</span>
              <h3 class="text-3xl font-bold mb-4">¿Buscas Auto con Garantía?</h3>
              <ul class="space-y-3 mb-8 flex-1">
                <li v-for="(item, i) in buyerFeatures" :key="i" class="flex items-center gap-2">
                  <div class="bg-blue-300 rounded-full p-1">
                    <Check :size="12" :stroke-width="4" class="text-blue-900" />
                  </div>
                  <span class="font-medium text-blue-50">{{ item }}</span>
                </li>
              </ul>
              <button class="w-full sm:w-auto bg-white text-brand-blue hover:bg-gray-100 px-8 py-3 rounded-xl font-bold transition-all">
                Registrarme para Comprar →
              </button>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>

    <!-- Inspection Cross-sell -->
    <section id="inspeccion" class="py-24 bg-gray-50 overflow-hidden">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <div class="inline-block bg-purple-100 text-purple-700 font-bold px-4 py-1 rounded-full text-sm mb-6">
              SERVICIO ADICIONAL
            </div>
            <h2 class="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              ¿Vas a comprar a un particular? <span class="text-purple-600">No te arriesgues.</span>
            </h2>
            <p class="text-lg text-gray-600 mb-8 leading-relaxed">
              Hazlo inspeccionar por los mismos expertos que revisan 60 autos al mes en nuestros remates. Evita estafas y compra tranquilo.
            </p>

            <div class="space-y-6">
              <div v-for="feature in inspectionFeatures" :key="feature.title" class="flex gap-4">
                <div class="bg-white p-3 rounded-xl shadow-md h-fit">
                  <component :is="feature.icon" class="text-purple-600" :size="28" />
                </div>
                <div>
                  <h4 class="text-xl font-bold text-gray-900">{{ feature.title }}</h4>
                  <p class="text-gray-600">{{ feature.description }}</p>
                </div>
              </div>
            </div>

            <div class="mt-10 flex gap-4">
              <button class="px-8 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-200">
                Ver Paquetes
              </button>
              <button class="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-bold hover:bg-purple-50 transition">
                Agendar Ahora
              </button>
            </div>
          </AnimatedSection>

          <AnimatedSection :delay="300" class="relative">
            <div class="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            
            <img 
              src="https://images.unsplash.com/photo-1626074961596-cab914d9392e?auto=format&fit=crop&q=80" 
              alt="Mecánico inspeccionando auto" 
              class="relative rounded-3xl shadow-2xl z-10 w-full transform hover:scale-[1.02] transition-transform duration-500"
            />
            
            <div class="absolute -bottom-6 -left-6 z-20 bg-white p-6 rounded-2xl shadow-xl max-w-xs animate-bounce-slow">
              <div class="flex gap-1 text-yellow-400 mb-2">★★★★★</div>
              <p class="text-gray-700 font-medium italic">"Me salvó de comprar un auto con el motor malo. Valió cada peso."</p>
              <p class="text-gray-400 text-sm mt-2 font-bold">— Carlos M., Santiago</p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Check, ClipboardList, AlertCircle, TrendingUp } from 'lucide-vue-next'
import AnimatedSection from './AnimatedSection.vue'

const sellerFeatures = [
  'Inspección profesional incluida',
  'Remates online',
  'Solo pagas si vendes (10%)',
  'Precio justo garantizado'
]

const buyerFeatures = [
  'Todos los autos inspeccionados',
  'Informe técnico completo',
  'Compra segura y transparente',
  'Precios competitivos'
]

const inspectionFeatures = [
  {
    title: 'Inspección de 60 Puntos',
    description: 'Motor, transmisión, suspensión, frenos, eléctricos y más.',
    icon: ClipboardList
  },
  {
    title: 'Informe Detallado PDF',
    description: 'Con fotos, diagnóstico computarizado y estimación de reparaciones.',
    icon: AlertCircle
  },
  {
    title: 'Desde $89.990',
    description: 'Invierte $90.000 antes de gastar $8.000.000 en un auto malo.',
    icon: TrendingUp
  }
]
</script>