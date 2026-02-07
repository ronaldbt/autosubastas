<template>
  <section class="py-24 bg-white">
    <div class="container mx-auto px-4">
      <AnimatedSection class="text-center mb-16">
        <h2 class="text-4xl font-extrabold text-gray-900 mb-4">Preguntas Frecuentes</h2>
        <p class="text-gray-500 text-lg max-w-2xl mx-auto">Todo lo que necesitas saber sobre nuestro sistema de remates de autos</p>
      </AnimatedSection>

      <div class="max-w-4xl mx-auto space-y-4">
        <AnimatedSection
          v-for="(faq, index) in faqs"
          :key="index"
          :delay="index * 50"
        >
          <div class="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <button
              @click="toggleFaq(index)"
              class="w-full px-6 py-5 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-inset"
            >
              <h3 class="text-lg font-bold text-gray-900 pr-8">{{ faq.question }}</h3>
              <div class="flex-shrink-0">
                <svg
                  :class="[
                    'w-6 h-6 text-brand-orange transition-transform duration-300',
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
                <div class="px-6 py-5 bg-gray-50 border-t border-gray-200">
                  <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ faq.answer }}</p>
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
    question: '¿Cómo funciona el proceso de remate?',
    answer: 'El proceso es simple y rápido: 1) Inscribes tu auto completando un formulario con la patente y datos básicos, 2) Realizamos una inspección técnica profesional de 60 puntos en nuestros centros certificados, 3) Tu auto se publica y recibes ofertas en vivo de compradores verificados, 4) Aceptas la mejor oferta y recibes el pago inmediato. Todo el proceso se completa en aproximadamente 2 horas.'
  },
  {
    question: '¿Cuál es la comisión por cada transacción?',
    answer: 'Tomamos una comisión de cada transacción. La comisión en la mayoría de los casos es del 3-10% y se calcula teniendo en cuenta el historial de automóviles, la condición técnica del automóvil y la demanda actual del mercado.'
  },
  {
    question: '¿Quién paga la comisión de la transacción?',
    answer: 'La comisión siempre es pagada por el comprador. El precio que verás en los resultados de la subasta ya es menor que la comisión, por lo que como vendedor recibes el monto acordado sin descuentos adicionales.'
  },
  {
    question: '¿Qué pasa si el precio no me convence?',
    answer: 'Si el precio no te conviene, simplemente puedes irte. No tienes que pagar ni firmar nada. Todo es gratis y sin compromiso. Te pediremos que evalúes el servicio y el trabajo del inspector a través de SMS. ¡Siempre estaremos encantados de volver a verte cuando quieras!'
  },
  {
    question: '¿Cómo ganan los compradores en el remate?',
    answer: 'En el 90% de los casos, el comprador planea revender el coche. Él espera ganar dinero a través de reparaciones, preparación previa a la venta, la diferencia en el costo del automóvil en diferentes regiones, préstamos y seguros. Los compradores son dealers profesionales que conocen el mercado.'
  },
  {
    question: '¿Qué incluye la inspección profesional?',
    answer: 'La inspección incluye una revisión técnica exhaustiva de 60 puntos que evalúa: carrocería, chasis, frenos, suspensión, neumáticos, sistema eléctrico, motor, transmisión y más. Esta inspección está incluida sin costo adicional y garantiza transparencia total en la transacción.'
  },
  {
    question: '¿Cuánto tiempo tarda todo el proceso?',
    answer: 'Compramos cualquier coche en 2 horas al precio de mercado. Desde que inscribes tu auto hasta que recibes el pago, todo el proceso está optimizado para ser rápido y eficiente. La inspección se realiza inmediatamente y el remate comienza de forma automática.'
  },
  {
    question: '¿Necesito registrarme para vender mi auto?',
    answer: 'Sí, necesitas crear una cuenta gratuita a través del sitio web o puedes llamarnos directamente. El registro es simple, rápido y totalmente gratuito. Una vez registrado, puedes inscribir tu auto en minutos.'
  },
  {
    question: '¿Qué tipos de autos aceptan para remate?',
    answer: 'Aceptamos todo tipo de vehículos: automóviles, motos y vehículos comerciales. No importa la marca, modelo, año o condición. Todos los autos son evaluados por nuestros inspectores profesionales y tienen la oportunidad de ser vendidos en el remate.'
  },
  {
    question: '¿El pago es inmediato?',
    answer: 'Sí, el pago es inmediato una vez que aceptas una oferta. No hay esperas ni procesos largos. Recibes el dinero directamente y de forma segura. Es uno de los principales beneficios de nuestro sistema de remates online.'
  }
]

const openFaqs = ref({})

const toggleFaq = (index) => {
  openFaqs.value[index] = !openFaqs.value[index]
}
</script>

