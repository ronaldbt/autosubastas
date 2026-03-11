<template>
  <div class="font-sans text-slate-900 bg-slate-50 min-h-screen">
    <!-- Redirigir a login si no está autenticado -->
    <Header />
    
    <main>
      <Hero />
      
      <!-- Modern How It Works Section -->
      <section id="como-funciona" class="py-24 bg-slate-50">
        <div class="max-w-7xl mx-auto px-4">
          <AnimatedSection class="text-center mb-16">
            <h2 class="text-4xl font-black text-slate-900 mb-4">Cómo funcionan los remates de autos</h2>
            <p class="text-slate-500 text-lg max-w-2xl mx-auto">Vende tu auto de forma segura, rápida y al mejor precio del mercado en 4 simples pasos.</p>
          </AnimatedSection>
          
          <!-- Timeline Animado -->
          <div class="max-w-4xl mx-auto">
            <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-6 md:p-8">
              <div class="relative">
                <!-- Línea de progreso animada -->
                <div class="absolute top-10 left-10 right-10 h-0.5 bg-slate-200 z-0 hidden md:block rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 transition-all duration-1000 ease-out rounded-full"
                    :style="{ width: activeStep >= howItWorksSteps.length - 1 ? '100%' : `${(activeStep / (howItWorksSteps.length - 1)) * 100}%` }"
                  ></div>
                </div>
                
                <!-- Pasos del timeline -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-3 relative z-10">
                  <div
                    v-for="(step, index) in howItWorksSteps"
                    :key="index"
                    @mouseenter="hoveredStep = index"
                    @mouseleave="hoveredStep = null"
                    class="flex flex-col items-center cursor-pointer group"
                  >
                    <!-- Círculo con icono -->
                    <div class="relative mb-3">
                      <!-- Anillo animado cuando está activo o hover -->
                      <div 
                        v-if="index <= activeStep || hoveredStep === index"
                        class="absolute inset-0 rounded-full animate-ping bg-blue-600"
                        style="animation-duration: 2s; opacity: 0.25;"
                      ></div>
                      
                      <div
                        :class="[
                          'w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-500 transform',
                          index <= activeStep 
                            ? 'bg-blue-600 border-blue-600 shadow-md scale-105' 
                            : 'bg-white border-slate-200 group-hover:border-blue-600 group-hover:scale-100',
                          hoveredStep === index ? 'shadow-lg scale-110' : ''
                        ]"
                      >
                        <component 
                          :is="step.icon" 
                          :size="28"
                          :class="[
                            'transition-all duration-300',
                            index <= activeStep ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                          ]"
                        />
                        
                        <!-- Checkmark cuando está completado -->
                        <div 
                          v-if="index < activeStep"
                          class="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce"
                        >
                          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      
                      <!-- Número del paso -->
                      <div 
                        v-if="index > activeStep"
                        :class="[
                          'absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border-2 border-white shadow-sm transition-all duration-300',
                          hoveredStep === index ? 'bg-blue-600 text-white scale-110' : 'bg-slate-200 text-slate-600'
                        ]"
                      >
                        {{ index + 1 }}
                      </div>
                    </div>
                    
                    <!-- Título y descripción -->
                    <div class="text-center max-w-[160px]">
                      <h3 
                        :class="[
                          'text-base font-bold mb-1.5 transition-colors duration-300',
                          index <= activeStep || hoveredStep === index ? 'text-blue-600' : 'text-slate-900 group-hover:text-blue-600'
                        ]"
                      >
                        {{ step.title }}
                      </h3>
                      <p 
                        :class="[
                          'text-xs leading-relaxed transition-all duration-300',
                          hoveredStep === index ? 'text-slate-700 scale-105' : 'text-slate-500'
                        ]"
                      >
                        {{ step.desc }}
                      </p>
                    </div>
                    
                    <!-- Línea conectora en móvil -->
                      <div 
                      v-if="index < howItWorksSteps.length - 1"
                      class="md:hidden w-0.5 h-10 bg-slate-200 my-3 relative overflow-hidden"
                    >
                      <div 
                        v-if="index < activeStep"
                        class="absolute top-0 left-0 w-full bg-blue-600 transition-all duration-500"
                        :style="{ height: '100%' }"
                      ></div>
                    </div>
                  </div>
                </div>
                
                <!-- Mensaje sobre no estar obligado a vender -->
                <div class="mt-8 pt-6 border-t border-slate-100">
                  <div class="flex items-start justify-center gap-3 text-center">
                    <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-sm text-slate-700 leading-relaxed max-w-2xl">
                      <span class="font-semibold text-slate-900">Si el precio no te convence, no vendes.</span> No pagas nada, Tienes la palabra final.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AuctionPreview />
      <TiposDeRemates />
      <RematesPorCiudad />
      <Services />
      <Testimonials />
      
      <!-- Blog Preview Section -->
      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="text-3xl font-black mb-10 text-center text-slate-900">Guías y consejos sobre remate de autos</h2>
          <div class="grid md:grid-cols-3 gap-8">
            <NuxtLink
              v-for="(post, i) in blogPosts"
              :key="i"
              :to="post.slug ? `/blog/${post.slug}` : '/blog'"
              class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow block group"
            >
              <img :src="post.img" :alt="post.title" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div class="p-6">
                <span class="text-xs font-bold text-blue-600 uppercase mb-2 block">Blog</span>
                <h3 class="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors text-slate-900">{{ post.title }}</h3>
                <p class="text-sm text-slate-500">Aprende los mejores trucos para comprar y vender autos en Chile de forma segura.</p>
                <span class="text-blue-600 font-semibold text-sm mt-4 inline-block group-hover:underline">Leer más →</span>
              </div>
            </NuxtLink>
          </div>
          <div class="text-center mt-10">
            <NuxtLink
              to="/blog"
              class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors"
            >
              Ver todos los artículos
              <ArrowRight :size="18" />
            </NuxtLink>
          </div>
        </div>
      </section>

      <FAQ />
      
      <!-- Final CTA -->
      <section class="py-20 bg-slate-900 text-white text-center">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="text-3xl md:text-5xl font-black mb-6">¿Listo para vender tu auto en remate?</h2>
          <p class="text-xl text-slate-400 mb-8">Cada remate tiene su propio plazo. Inscribe tu auto y participa cuando quieras.</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink
              to="/registro"
              class="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform text-center text-white"
            >
              Inscribir mi Auto Gratis
            </NuxtLink>
            <NuxtLink
              to="/login"
              class="bg-transparent border-2 border-slate-500 hover:bg-slate-800 px-8 py-4 rounded-xl font-bold text-lg transition-colors text-center"
            >
              Iniciar Sesión
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>
    
    <Footer />
    <ScrollToTop />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { ArrowUp, ArrowRight, MessageCircle, FileText, Wrench, Gavel, DollarSign } from 'lucide-vue-next'
import Header from '~/components/Header.vue'
import Hero from '~/components/Hero.vue'
import AuctionPreview from '~/components/AuctionPreview.vue'
import Services from '~/components/Services.vue'
import Testimonials from '~/components/Testimonials.vue'
import Footer from '~/components/Footer.vue'
import AnimatedSection from '~/components/AnimatedSection.vue'
import ScrollToTop from '~/components/ScrollToTop.vue'
import FAQ from '~/components/FAQ.vue'

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl || 'https://autoremates.cl'
const route = useRoute()

// SEO Meta Tags
useSeoMeta({
  title: 'AutoRemates Chile - Remate de Autos de Particulares y Empresas | Remates Online',
  description: 'Remate de autos de particulares y empresas en Chile. Remates online. Podemos entregar el auto al comprador en cualquier ciudad de Chile. Inspección profesional incluida. Si el precio no te convence, no vendes.',
  keywords: 'remate de autos, remates de autos, remate auto, remate autos, remate vehiculos, remate de autos santiago, remates de autos en santiago, remate siniestrados, remate autos siniestrados, remate de autos embargados, remate de autos embargados chile, compra vehiculos chocados, remate de autos particulares, remate de autos empresas, remate de autos chile, subasta de autos, remates online',
  ogTitle: 'AutoRemates Chile - Remate de Autos de Particulares y Empresas',
  ogDescription: 'Remate de autos de particulares y empresas en Chile. Remates online, vehículos inspeccionados, en buen estado. Inspección profesional incluida.',
  ogImage: siteUrl + '/subasta.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'AutoRemates Chile - Remate y subasta de autos online en Chile',
  ogUrl: siteUrl + route.path,
  ogType: 'website',
  ogSiteName: 'AutoRemates Chile',
  ogLocale: 'es_CL',
  twitterCard: 'summary_large_image',
  twitterTitle: 'AutoRemates Chile - Remate de Autos de Particulares y Empresas',
  twitterDescription: 'Remate de autos de particulares y empresas en Chile. Vehículos en buen estado, inspección profesional incluida.',
  twitterImage: siteUrl + '/subasta.png',
  twitterImageAlt: 'AutoRemates Chile - Remate y subasta de autos usados'
})

useHead({
  link: [
    { rel: 'canonical', href: siteUrl + route.path }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'AutoRemates Chile',
        url: siteUrl,
        logo: siteUrl + '/favicon-256.png',
        description: 'Remate de autos de particulares y empresas en Chile. Remates online, vehículos inspeccionados, en buen estado, sin daños estructurales.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Av. Apoquindo 4500',
          addressLocality: 'Las Condes',
          addressRegion: 'Región Metropolitana',
          addressCountry: 'CL'
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+56-9-7979-6841',
          contactType: 'customer service',
          areaServed: 'CL',
          availableLanguage: 'Spanish'
        },
        sameAs: [
          'https://www.facebook.com/autoremates',
          'https://www.instagram.com/autoremates',
          'https://www.youtube.com/autoremates'
        ]
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'AutoRemates Chile',
        url: siteUrl,
        description: 'Remate de autos de particulares y empresas en Chile. Remates online, vehículos inspeccionados, en buen estado, sin daños estructurales.',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: siteUrl + '/?q={search_term_string}'
          },
          'query-input': 'required name=search_term_string'
        }
      })
    }
  ]
})

const howItWorksSteps = [
  { title: 'Inscribe', desc: 'Completa el formulario con la patente y datos básicos del vehículo.', icon: FileText, color: 'bg-blue-50 text-blue-600' },
  { title: 'Inspecciona', desc: 'Revisión técnica de 60 puntos en nuestros centros certificados.', icon: Wrench, color: 'bg-blue-50 text-blue-600' },
  { title: 'Remata', desc: 'Tu auto se publica y recibes ofertas en vivo de compradores.', icon: Gavel, color: 'bg-purple-50 text-purple-600' },
  { title: 'Cobra', desc: 'Aceptas la mejor oferta y recibes el pago inmediato.', icon: DollarSign, color: 'bg-green-50 text-green-600' },
]

// Animación del timeline
const activeStep = ref(0)
const hoveredStep = ref(null)
let animationInterval = null
let restartInterval = null

onMounted(() => {
  // Animación automática que recorre los pasos
  const animateSteps = () => {
    activeStep.value = 0
    
    animationInterval = setInterval(() => {
      if (activeStep.value < howItWorksSteps.length - 1) {
        activeStep.value++
      } else {
        // Reiniciar después de un momento
        clearInterval(animationInterval)
        setTimeout(() => {
          activeStep.value = 0
          animateSteps()
        }, 2000)
      }
    }, 1800)
  }
  
  // Iniciar animación después de un pequeño delay
  setTimeout(() => {
    animateSteps()
  }, 800)
})

onUnmounted(() => {
  if (animationInterval) {
    clearInterval(animationInterval)
  }
  if (restartInterval) {
    clearInterval(restartInterval)
  }
})

const blogPosts = [
  { title: 'Remate vs Clasificados', img: 'https://picsum.photos/seed/blog1/600/400', slug: 'remate-vs-clasificados' },
  { title: '10 Cosas que revisar antes de comprar', img: 'https://picsum.photos/seed/blog2/600/400', slug: '10-cosas-revisar-comprar-auto' },
  { title: 'Cómo funciona la inspección', img: 'https://picsum.photos/seed/blog3/600/400', slug: 'como-funciona-inspeccion-auto' }
]

// Función para obtener el próximo viernes
const getNextFridayDate = () => {
  const now = new Date()
  
  // Obtener fecha actual en Santiago
  const santiagoParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(now)
  
  const year = parseInt(santiagoParts.find(p => p.type === 'year').value)
  const month = parseInt(santiagoParts.find(p => p.type === 'month').value)
  const day = parseInt(santiagoParts.find(p => p.type === 'day').value)
  const hour = parseInt(santiagoParts.find(p => p.type === 'hour').value)
  
  const tempDate = new Date(year, month - 1, day)
  const currentDayOfWeek = tempDate.getDay()
  
  let daysToAdd = (5 - currentDayOfWeek + 7) % 7
  
  if (currentDayOfWeek === 5 && hour >= 15) {
    daysToAdd = 7
  }
  
  // JavaScript Date maneja automáticamente el overflow de mes/año
  return new Date(year, month - 1, day + daysToAdd)
}

// Formatear la fecha del próximo viernes
const nextFridayText = computed(() => {
  const nextFriday = getNextFridayDate()
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  
  const day = nextFriday.getDate()
  const month = months[nextFriday.getMonth()]
  
  return `Viernes ${day} ${month}`
})

</script>