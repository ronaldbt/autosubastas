<template>
  <div class="font-sans text-gray-900 bg-white">
    <!-- Redirigir a login si no está autenticado -->
    <Header />
    
    <main>
      <h1 class="sr-only">Remate de Autos de Particulares y Empresas en Chile - Remates Online</h1>
      <Hero />
      
      <!-- Modern How It Works Section -->
      <section id="como-funciona" class="py-24 bg-white">
        <div class="container mx-auto px-4">
          <AnimatedSection class="text-center mb-16">
            <h2 class="text-4xl font-extrabold text-gray-900 mb-4">¿Cómo Funciona?</h2>
            <p class="text-gray-500 text-lg max-w-2xl mx-auto">Vende tu auto de forma segura, rápida y al mejor precio del mercado en 4 simples pasos.</p>
          </AnimatedSection>
          
          <!-- Timeline Animado -->
          <div class="max-w-4xl mx-auto">
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
              <div class="relative">
                <!-- Línea de progreso animada -->
                <div class="absolute top-10 left-10 right-10 h-0.5 bg-gray-200 z-0 hidden md:block rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-gradient-to-r from-brand-orange via-orange-400 to-orange-500 transition-all duration-1000 ease-out rounded-full"
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
                        class="absolute inset-0 rounded-full animate-ping bg-brand-orange"
                        style="animation-duration: 2s; opacity: 0.25;"
                      ></div>
                      
                      <div
                        :class="[
                          'w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-500 transform',
                          index <= activeStep 
                            ? 'bg-brand-orange border-brand-orange shadow-md scale-105' 
                            : 'bg-white border-gray-200 group-hover:border-brand-orange group-hover:scale-100',
                          hoveredStep === index ? 'shadow-lg scale-110' : ''
                        ]"
                      >
                        <component 
                          :is="step.icon" 
                          :size="28"
                          :class="[
                            'transition-all duration-300',
                            index <= activeStep ? 'text-white' : 'text-gray-400 group-hover:text-brand-orange'
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
                          hoveredStep === index ? 'bg-brand-orange text-white scale-110' : 'bg-gray-200 text-gray-600'
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
                          index <= activeStep || hoveredStep === index ? 'text-brand-orange' : 'text-gray-900 group-hover:text-brand-orange'
                        ]"
                      >
                        {{ step.title }}
                      </h3>
                      <p 
                        :class="[
                          'text-xs leading-relaxed transition-all duration-300',
                          hoveredStep === index ? 'text-gray-700 scale-105' : 'text-gray-500'
                        ]"
                      >
                        {{ step.desc }}
                      </p>
                    </div>
                    
                    <!-- Línea conectora en móvil -->
                    <div 
                      v-if="index < howItWorksSteps.length - 1"
                      class="md:hidden w-0.5 h-10 bg-gray-200 my-3 relative overflow-hidden"
                    >
                      <div 
                        v-if="index < activeStep"
                        class="absolute top-0 left-0 w-full bg-brand-orange transition-all duration-500"
                        :style="{ height: '100%' }"
                      ></div>
                    </div>
                  </div>
                </div>
                
                <!-- Mensaje sobre no estar obligado a vender -->
                <div class="mt-8 pt-6 border-t border-gray-100">
                  <div class="flex items-start justify-center gap-3 text-center">
                    <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-sm text-gray-700 leading-relaxed max-w-2xl">
                      <span class="font-semibold text-gray-900">Si el precio no te convence, no vendes.</span> No pagas nada, Tienes la palabra final.
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
      <section class="py-20 bg-gray-50">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold mb-10 text-center">Guías y Consejos</h2>
          <div class="grid md:grid-cols-3 gap-8">
            <NuxtLink
              v-for="(post, i) in blogPosts"
              :key="i"
              :to="post.slug ? `/blog/${post.slug}` : '/blog'"
              class="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow block group"
            >
              <img :src="post.img" :alt="post.title" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div class="p-6">
                <span class="text-xs font-bold text-brand-orange uppercase mb-2 block">Blog</span>
                <h3 class="text-lg font-bold mb-2 group-hover:text-brand-orange transition-colors">{{ post.title }}</h3>
                <p class="text-sm text-gray-500">Aprende los mejores trucos para comprar y vender autos en Chile de forma segura.</p>
                <span class="text-brand-orange font-semibold text-sm mt-4 inline-block group-hover:underline">Leer más →</span>
              </div>
            </NuxtLink>
          </div>
          <div class="text-center mt-10">
            <NuxtLink
              to="/blog"
              class="inline-flex items-center gap-2 bg-brand-orange hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-colors"
            >
              Ver todos los artículos
              <ArrowRight :size="18" />
            </NuxtLink>
          </div>
        </div>
      </section>

      <FAQ />
      
      <!-- Final CTA -->
      <section class="py-20 bg-gray-900 text-white text-center">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl md:text-5xl font-extrabold mb-6">¿Listo para Vender?</h2>
          <p class="text-xl text-gray-400 mb-8">Cada remate tiene su propio plazo. Inscribe tu auto y participa cuando quieras.</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink
              to="/registro"
              class="bg-brand-orange hover:bg-orange-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform text-center"
            >
              Inscribir mi Auto Gratis
            </NuxtLink>
            <NuxtLink
              to="/login"
              class="bg-transparent border border-gray-600 hover:bg-gray-800 px-8 py-4 rounded-xl font-bold text-lg transition-colors text-center"
            >
              Iniciar Sesión
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>
    
    <Footer />
    <ScrollToTop />
    
    <!-- Floating Assistant Button -->
    <button 
      @click="openWhatsApp"
      class="fixed bottom-24 right-6 z-50 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold animate-float transition-colors group"
    >
      <MessageCircle :size="24" class="group-hover:rotate-12 transition-transform" />
      <span class="text-sm md:text-base">Asistente en línea</span>
      <span class="relative flex h-3 w-3">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-200 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </span>
    </button>
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
  keywords: 'remate de autos particulares, remate de autos empresas, remate de autos chile, subasta de autos, remates de autos en santiago, remates de autos en concepcion, remates de autos en iquique, remate autos buen estado, remates de autos online, como saber si un auto es de remate, remate autos particulares chile',
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
  { title: 'Inspecciona', desc: 'Revisión técnica de 60 puntos en nuestros centros certificados.', icon: Wrench, color: 'bg-orange-50 text-orange-600' },
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

const openWhatsApp = () => {
  window.open('https://wa.me/56979796841', '_blank')
}
</script>