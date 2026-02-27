<template>
  <section id="faq" class="py-24 bg-white">
    <div class="container mx-auto px-4">
      <AnimatedSection class="text-center mb-16">
        <h2 class="text-4xl font-extrabold text-slate-900 mb-4">Preguntas Frecuentes</h2>
        <p class="text-slate-500 text-lg max-w-2xl mx-auto">Todo lo que necesitas saber sobre nuestro sistema de remates de autos</p>
      </AnimatedSection>

      <div class="max-w-4xl mx-auto space-y-4">
        <AnimatedSection
          v-for="(faq, index) in faqs"
          :key="index"
          :delay="index * 50"
        >
          <div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <button
              @click="toggleFaq(index)"
              class="w-full px-6 py-5 text-left flex items-center justify-between bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-inset"
            >
              <h3 class="text-lg font-bold text-slate-900 pr-8">{{ faq.question }}</h3>
              <div class="flex-shrink-0">
                <svg
                  :class="[
                    'w-6 h-6 text-blue-600 transition-transform duration-300',
                    openFaqs[index] ? 'rotate-180' : ''
                  ]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-[1000px]"
              leave-active-class="transition-all duration-300 ease-in"
              leave-from-class="opacity-100 max-h-[1000px]"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-if="openFaqs[index]" class="overflow-hidden">
                <div class="px-6 py-5 bg-slate-50 border-t border-slate-200">
                  <p class="text-slate-700 leading-relaxed whitespace-pre-line">{{ faq.answer }}</p>
                </div>
              </div>
            </Transition>
          </div>
        </AnimatedSection>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import AnimatedSection from './AnimatedSection.vue'

const faqs = [
  {
    question: '¿En qué se diferencia AutoRemates de otros remates?',
    answer: 'AutoRemates se especializa en remates de autos de particulares y empresas, con vehículos en buen estado. No trabajamos con autos chocados, judiciales ni de aseguradora. Ofrecemos inspección profesional de 60 puntos, remates online y pago inmediato. Si el precio no te convence, no vendes.'
  },
  {
    question: '¿Aceptan autos chocados o de aseguradora?',
    answer: 'No. En AutoRemates nos enfocamos en vehículos de particulares y empresas, en buen estado y sin daños estructurales. Los remates de autos chocados o de aseguradora son otra modalidad del mercado; nosotros te ayudamos a vender tu auto particular o de flota con transparencia total.'
  },
  {
    question: '¿Cómo saber si un auto es de remate?',
    answer: 'Un auto es de remate cuando fue incautado, embargado, siniestrado o está en poder de aseguradoras, municipalidades o tribunales. Puedes verificarlo en el Registro de Vehículos Motorizados (REVEM) del Ministerio de Transportes o consultando la procedencia del vehículo con el vendedor.'
  },
  {
    question: '¿Cómo funcionan los remates de autos?',
    answer: 'Los remates de autos son subastas donde los compradores pujan por vehículos. En AutoRemates: 1) El vendedor inscribe su auto, 2) Realizamos una inspección técnica profesional de 60 puntos, 3) El auto se subasta online con compradores verificados, 4) Se acepta la mejor oferta y el pago es inmediato.'
  },
  {
    question: '¿Cómo participar en una subasta de autos online?',
    answer: 'Debes registrarte como comprador (dealer) en AutoRemates. Una vez verificado, podrás ver los autos disponibles, revisar las inspecciones y pujar en las subastas en vivo. Los remates se realizan cada viernes a las 15:00 hrs. El registro es gratuito.'
  },
  {
    question: '¿Qué es un remate de autos de aseguradora?',
    answer: 'Son vehículos declarados pérdida total por compañías de seguros. Las aseguradoras los subastan para recuperar parte del valor. Incluyen autos chocados, siniestrados o con daños. Es un tipo de remate distinto al que ofrece AutoRemates, que se especializa en autos de particulares y empresas en buen estado.'
  },
  {
    question: '¿Dónde hay remates de autos en Chile?',
    answer: 'En AutoRemates realizamos remates online, por lo que puedes participar desde cualquier parte de Chile. Tenemos centros de inspección en Santiago, Concepción e Iquique. Si ganas un remate, podemos entregar el auto en cualquier ciudad (con costo).'
  },
  {
    question: '¿Pueden entregar el auto al comprador si está en otra ciudad?',
    answer: 'Sí. Cuando se remata un auto, podemos ir a dejarlo al comprador en cualquier ciudad de Chile. Este servicio tiene un costo que se cotiza según la ubicación. Contáctanos para una cotización.'
  },
  {
    question: '¿Cómo funciona el proceso de remate en AutoRemates?',
    answer: 'El proceso es simple: 1) Inscribes tu auto con la patente y datos básicos, 2) Inspección técnica profesional de 60 puntos en centros certificados, 3) Tu auto se publica y recibes ofertas en vivo en el remate online, 4) Aceptas la mejor oferta y recibes el pago inmediato.'
  },
  {
    question: '¿Qué pasa si el precio no me convence?',
    answer: 'Si el precio no te conviene, simplemente puedes irte. No tienes que pagar ni firmar nada. Todo es gratis y sin compromiso. Si el precio no te convence, no vendes.'
  },
  {
    question: '¿Qué incluye la inspección profesional?',
    answer: 'La inspección incluye una revisión técnica exhaustiva de 60 puntos: carrocería, chasis, frenos, suspensión, neumáticos, sistema eléctrico, motor y transmisión. Está incluida sin costo adicional y garantiza transparencia total.'
  }
]

const openFaqs = ref({})

const toggleFaq = (index) => {
  openFaqs.value[index] = !openFaqs.value[index]
}

// Schema.org FAQPage para SEO
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer
          }
        }))
      })
    }
  ]
})
</script>

